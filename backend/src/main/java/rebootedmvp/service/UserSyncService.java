package rebootedmvp.service;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import io.jsonwebtoken.Claims;
import rebootedmvp.User;
import rebootedmvp.UserMapper;
import rebootedmvp.domain.impl.UserProfileImpl;
import rebootedmvp.repository.UserProfileRepository;
import rebootedmvp.security.JwtTokenValidator;

/**
 * Service responsible for synchronizing Supabase users with the backend user
 * system.
 * Automatically creates backend users when new Supabase users authenticate.
 */
//TEMP COMMENTED OUT (authentication/validation)
 //@Service
public class UserSyncService {

    private static final Logger logger = LoggerFactory.getLogger(UserSyncService.class);

    // Synchronization locks per Supabase user ID to prevent race conditions
    private final ConcurrentHashMap<String, Object> userSyncLocks = new ConcurrentHashMap<>();

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private JwtTokenValidator jwtTokenValidator;

    /**
     * Synchronizes a Supabase user with the backend user system.
     * Creates a new backend user if one doesn't exist for the given Supabase user
     * ID.
     * Uses proper synchronization to prevent race conditions during user creation.
     * 
     * @param jwtToken The Supabase JWT token containing user information
     * @return The synchronized UserProfileImpl, or null if synchronization fails
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public User syncSupabaseUser(String jwtToken) {
        try {
            // Validate and extract claims from the JWT token
            logger.debug("Validating JWT token and extracting claims...");
            Claims claims = jwtTokenValidator.validateTokenAndGetClaims(jwtToken);

            if (claims == null) {
                logger.error("Invalid JWT token provided - cannot sync user");
                throw new SecurityException("Invalid JWT token");
            }

            String supabaseUserId = claims.getSubject();

            // Use per-user synchronization to prevent race conditions
            Object lockObject = userSyncLocks.computeIfAbsent(supabaseUserId, k -> new Object());

            try {
                synchronized (lockObject) {
                    return syncUserWithRetry(claims, supabaseUserId, 3);
                }
            } finally {
                // Clean up lock object to prevent memory leaks
                // Only remove if it's the same object we just used
                userSyncLocks.remove(supabaseUserId, lockObject);
            }

        } catch (SecurityException e) {
            logger.error("Failed to sync Supabase user: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Synchronizes a user with retry logic to handle race conditions and transient
     * failures
     */
    private User syncUserWithRetry(Claims claims, String supabaseUserId, int maxRetries) {
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Check if user already exists (with fresh read from database)
                Optional<User> existingUser = userProfileRepository.findBySupabaseUserId(supabaseUserId)
                        .map(UserMapper::toDomain);
                if (existingUser.isPresent()) {
                    logger.debug("User already exists for Supabase ID: {} (attempt {})", supabaseUserId, attempt);
                    return existingUser.get();
                }

                // Try to create new user
                User newUser = createUserFromSupabaseTokenSafe(claims);
                if (newUser != null) {
                    logger.info("Successfully created user for Supabase ID: {} (attempt {})", supabaseUserId, attempt);
                    return newUser;
                }

            } catch (DataIntegrityViolationException e) {
                // Handle race condition: another thread created the user between our check and
                // insert
                logger.debug("Constraint violation detected for Supabase ID: {} (attempt {}), retrying lookup",
                        supabaseUserId, attempt);

                // Try to find the user that was created by another thread
                Optional<User> existingUser = userProfileRepository.findBySupabaseUserId(supabaseUserId)
                        .map(UserMapper::toDomain);
                if (existingUser.isPresent()) {
                    logger.info("Found user created by another thread for Supabase ID: {}", supabaseUserId);
                    return existingUser.get();
                }

                // If still not found and we have more retries, continue
                if (attempt < maxRetries) {
                    try {
                        // Brief delay before retry to reduce contention
                        Thread.sleep(50 * attempt);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        logger.warn("Thread interrupted during user sync retry for Supabase ID: {}", supabaseUserId);
                        return null;
                    }
                }
            } catch (Exception e) {
                logger.error("Unexpected error during user sync for Supabase ID: {} (attempt {}): {}",
                        supabaseUserId, attempt, e.getMessage(), e);

                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(100 * attempt);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return null;
                    }
                }
            }
        }

        logger.error("Failed to sync user after {} attempts for Supabase ID: {}", maxRetries, supabaseUserId);
        return null;
    }

    /**
     * Creates a new backend user from Supabase JWT claims with additional error
     * handling
     */
    private User createUserFromSupabaseTokenSafe(Claims claims) {
        String supabaseUserId = claims.getSubject();
        String email = (String) claims.get("email");

        // Extract user metadata
        String fullName = extractFullName(claims);
        String username = generateUniqueUsername(email, supabaseUserId);
        User.UserType userType = determineUserType(claims, email);

        // Create new user profile
        User newUser = new UserProfileImpl(username, supabaseUserId, userType, email, fullName);

        try {
            User savedUser = userProfileRepository.save(UserMapper.toEntity(newUser));
            logger.info("Created new user for Supabase ID: {} with username: {}", supabaseUserId, username);
            return savedUser;
        } catch (DataIntegrityViolationException e) {
            // Re-throw constraint violations to be handled by retry logic
            throw e;
        } catch (Exception e) {
            logger.error("Failed to save new user for Supabase ID {}: {}", supabaseUserId, e.getMessage(), e);
            return null;
        }
    }

    /**
     * Extracts full name from JWT claims
     */
    private String extractFullName(Claims claims) {
        // Try different possible claim names for full name
        String fullName = (String) claims.get("name");
        if (fullName == null) {
            fullName = (String) claims.get("fullName");
        }
        if (fullName == null) {
            // Construct from first and last name
            String firstName = (String) claims.get("givenName");
            String lastName = (String) claims.get("familyName");
            if (firstName != null && lastName != null) {
                fullName = firstName + " " + lastName;
            } else if (firstName != null) {
                fullName = firstName;
            }
        }
        if (fullName == null) {
            String email = (String) claims.get("email");
            // Use email prefix as fallback
            if (email != null && email.contains("@")) {
                fullName = email.substring(0, email.indexOf("@"));
            }
        }
        return fullName != null ? fullName : "Unknown User";
    }

    /**
     * Generates a unique username from email and full name with enhanced race
     * condition protection
     */
    private String generateUniqueUsername(String email, String supabaseUserId) {
        String baseUsername;

        if (email != null && email.contains("@")) {
            baseUsername = email.substring(0, email.indexOf("@"));
        } else {
            // Use a portion of the Supabase user ID for uniqueness
            baseUsername = "user" + supabaseUserId.substring(0, Math.min(8, supabaseUserId.length()));
        }

        // Clean username - remove special characters
        baseUsername = baseUsername.replaceAll("[^a-zA-Z0-9]", "");

        // Ensure minimum length
        if (baseUsername.length() < 3) {
            baseUsername = "user" + supabaseUserId.substring(0, Math.min(8, supabaseUserId.length()));
        }

        // Ensure uniqueness with enhanced retry logic
        String username = baseUsername;
        int counter = 1;
        int maxAttempts = 50; // Prevent infinite loops

        while (counter <= maxAttempts && userProfileRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }

        // If all attempts failed, use supabase ID suffix for guaranteed uniqueness
        if (counter > maxAttempts) {
            username = baseUsername + "_" + supabaseUserId.substring(0, Math.min(8, supabaseUserId.length()));
        }

        return username;
    }

    /**
     * Determines user type based on JWT claims and email domain
     */
    private User.UserType determineUserType(Claims claims, String email) {
        // Check for explicit role in JWT
        String role = (String) claims.get("role");
        if (role != null) {
            if (role.toLowerCase().contains("teacher") || role.toLowerCase().contains("admin")
                    || role.toLowerCase().contains("instructor")) {
                return User.UserType.LDUser;
            } else if (role.toLowerCase().contains("student") || role.toLowerCase().contains("learner")) {
                return User.UserType.EmployeeUser;
            }
        }

        // Check app_metadata for role information
        Object appMetadata = claims.get("app_metadata");
        if (appMetadata != null) {
            // This would need to be parsed based on how Supabase structures app metadata
            // For now, we'll assume it's a simple role string
            String appRole = appMetadata.toString().toLowerCase();
            if (appRole.contains("teacher") || appRole.contains("admin")) {
                return User.UserType.LDUser;
            }
        }

        // Check email domain for organizational hints
        if (email != null) {
            String domain = email.substring(email.indexOf("@") + 1).toLowerCase();
            // Configure these domains based on your organization
            if (domain.contains("admin") || domain.contains("edu") || domain.contains("training")) {
                return User.UserType.LDUser;
            }
        }

        // Default to EmployeeUser (student/learner)
        return User.UserType.EmployeeUser;
    }

    /**
     * Gets or creates a user profile for the given JWT token
     * This is the main method that should be called from authentication filters
     */
    public User getOrCreateUser(String jwtToken) {
        return syncSupabaseUser(jwtToken);
    }

    /**
     * Updates an existing user's information from Supabase JWT
     */
    public User updateUserFromSupabase(String jwtToken) {
        try {
            Claims claims = jwtTokenValidator.validateTokenAndGetClaims(jwtToken);
            if (claims == null) {
                return null;
            }

            String supabaseUserId = claims.getSubject();
            Optional<User> existingUser = userProfileRepository.findBySupabaseUserId(supabaseUserId)
                    .map(UserMapper::toDomain);

            if (existingUser.isPresent()) {
                User user = existingUser.get();

                // Update email if changed
                // String newEmail = (String) claims.get("email");
                // if (newEmail != null && !newEmail.equals(user.getEmail())) {
                // user.setEmail(newEmail);
                // }

                // Update full name if changed
                String newFullName = extractFullName(claims);
                // if (newFullName != null && !newFullName.equals(user.getFullName())) {
                // user.setFullName(newFullName);
                // }

                return userProfileRepository.save(UserMapper.toEntity(user));
            }

        } catch (Exception e) {
            logger.error("Failed to update user from Supabase: {}", e.getMessage());
        }

        return null;
    }
}