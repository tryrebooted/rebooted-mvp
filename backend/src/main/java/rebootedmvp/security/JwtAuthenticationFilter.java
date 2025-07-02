package rebootedmvp.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

//TEMP COMMENTED OUT (authentication/validation)
//@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    
    @Autowired
    private JwtTokenValidator jwtTokenValidator;
    
    @Autowired
    private rebootedmvp.service.UserSyncService userSyncService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String requestUri = request.getRequestURI();
        logger.debug("===== JWT FILTER PROCESSING REQUEST: {} =====", requestUri);
        
        try {
            // Extract the JWT token and validate it
            String jwt = extractJwtFromRequest(request);
            logger.debug("Extracted JWT token: {}", jwt != null ? "PRESENT" : "ABSENT");
            
            if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.debug("JWT token present and no existing authentication, validating...");
                
                // Validate the token and get claims
                Claims claims = jwtTokenValidator.validateTokenAndGetClaims(jwt);
                logger.debug("JWT validation result: {}", claims != null ? "VALID" : "INVALID");
                
                if (claims != null) {
                    logger.debug("JWT token validated successfully, syncing user...");
                    
                    // Get or create the user from the JWT claims
                    rebootedmvp.domain.impl.UserProfileImpl user = userSyncService.getOrCreateUser(jwt);
                    logger.debug("User sync result: {}", user != null ? user.getUsername() : "FAILED");
                    
                    if (user != null) {
                        logger.debug("Setting authentication for user: {}", user.getUsername());
                        
                        // Extract role from JWT token for authentication
                        String role = jwtTokenValidator.extractUserRole(jwt);
                        logger.debug("User role extracted: {}", role);
                        
                        // Create authorities based on user role or default to USER
                        List<SimpleGrantedAuthority> authorities = role != null ? 
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())) :
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
                        logger.debug("Assigned authorities: {}", authorities);
                        
                        // Create authentication token
                        UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(user.getSupabaseUserId(), null, authorities);
                        
                        // Add additional user details to the authentication
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // Set authentication in security context
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        
                        logger.info("Successfully authenticated user: '{}' with email: '{}' for request: {}", 
                                  user.getSupabaseUserId(), user.getEmail(), requestUri);
                    } else {
                        logger.debug("Invalid JWT token for request: {}", requestUri);
                    }
                } else {
                    logger.debug("Invalid JWT token for request: {}", requestUri);
                }
            } else {
                if (jwt == null) {
                    logger.debug("No JWT token found for request: {}", requestUri);
                } else {
                    logger.debug("Authentication already exists for request: {}", requestUri);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication for request '{}': {}", requestUri, e.getMessage(), e);
        }
        
        logger.debug("===== JWT FILTER COMPLETED FOR REQUEST: {} =====", requestUri);
        filterChain.doFilter(request, response);
    }
    
    /**
     * Extracts JWT token from the Authorization header
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (bearerToken != null && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }
}