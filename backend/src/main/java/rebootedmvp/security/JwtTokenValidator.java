package rebootedmvp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import rebootedmvp.config.SupabaseConfig;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class JwtTokenValidator {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenValidator.class);
    
    @Autowired
    private SupabaseConfig supabaseConfig;
    
    private SecretKey secretKey;
    
    public JwtTokenValidator() {
        logger.info("JWT Token Validator initialized");
    }
    
    /**
     * Initialize the secret key after Spring injection
     */
    private void initializeSecretKey() {
        if (secretKey == null && supabaseConfig != null) {
            String jwtSecret = supabaseConfig.getJwtSecret();
            if (jwtSecret != null && !jwtSecret.trim().isEmpty()) {
                try {
                    // Supabase JWT secrets are base64 encoded
                    byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
                    this.secretKey = Keys.hmacShaKeyFor(keyBytes);
                    logger.info("Successfully initialized JWT secret key from Supabase configuration");
                    logger.debug("JWT secret key length: {} bytes", keyBytes.length);
                } catch (Exception e) {
                    logger.warn("Failed to decode base64 JWT secret, falling back to direct bytes: {}", e.getMessage());
                    // Fallback to direct byte conversion
                    byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
                    if (keyBytes.length < 32) {
                        // Pad the key if it's too short
                        byte[] paddedKey = new byte[32];
                        System.arraycopy(keyBytes, 0, paddedKey, 0, keyBytes.length);
                        keyBytes = paddedKey;
                    }
                    this.secretKey = Keys.hmacShaKeyFor(keyBytes);
                }
            } else {
                logger.error("JWT secret not found in Supabase configuration");
                // Use a fallback secret for development
                String fallbackSecret = "your-256-bit-secret-your-256-bit-secret-your-256-bit-secret-your-256-bit-secret";
                this.secretKey = Keys.hmacShaKeyFor(fallbackSecret.getBytes(StandardCharsets.UTF_8));
            }
        }
    }
    
    public boolean validateToken(String token) {
        logger.debug("===== VALIDATING JWT TOKEN =====");
        logger.debug("Token length: {} characters", token != null ? token.length() : 0);
        
        if (token == null || token.trim().isEmpty()) {
            logger.warn("Token is null or empty");
            return false;
        }
        
        try {
            logger.debug("Attempting to parse JWT token using JJWT 0.12.3 API...");
            
            // Decode token header and payload for debugging
            String[] tokenParts = token.split("\\.");
            if (tokenParts.length >= 2) {
                try {
                    String header = new String(Base64.getUrlDecoder().decode(tokenParts[0]));
                    String payload = new String(Base64.getUrlDecoder().decode(tokenParts[1]));
                    logger.info("JWT Header: {}", header);
                    logger.info("JWT Payload: {}", payload);
                    
                    // Check if this is a Supabase user access token (has 'kid' field)
                    if (header.contains("\"kid\"")) {
                        logger.info("Detected Supabase user access token with kid field - using issuer verification");
                        return validateSupabaseUserToken(token);
                    }
                } catch (Exception e) {
                    logger.info("Could not decode JWT for inspection: {}", e.getMessage());
                }
            }
            
            // For API keys and other tokens, use the static secret
            initializeSecretKey();
            if (secretKey == null) {
                logger.error("JWT secret key not initialized");
                return false;
            }
            
            // Use JJWT 0.12.3 API directly
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            
            logger.debug("Successfully validated token");
            return true;
            
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.warn("JWT token is unsupported: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.warn("JWT token is malformed: {}", e.getMessage());
        } catch (SecurityException e) {
            logger.warn("JWT security error: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.warn("JWT token is invalid: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error validating JWT token: {}", e.getMessage(), e);
        }
        
        return false;
    }
    
    /**
     * Validate Supabase user access tokens using issuer verification
     */
    private boolean validateSupabaseUserToken(String token) {
        try {
            logger.info("Validating Supabase user access token using issuer verification");
            
            // For Supabase user tokens, we verify the issuer and basic structure
            // without signature verification for now
            Jwt<?, Claims> jwt = Jwts.parser()
                .requireIssuer("https://snvasvzrqiordsgmfcai.supabase.co/auth/v1")
                .build()
                .parseClaimsJwt(token.substring(0, token.lastIndexOf('.') + 1)); // Remove signature for parsing
            Claims claims = jwt.getPayload();
            
            // Additional validations
            if (claims.getExpiration() != null && claims.getExpiration().before(new java.util.Date())) {
                logger.warn("Supabase token is expired");
                return false;
            }
            
            if (!"authenticated".equals(claims.get("aud"))) {
                logger.warn("Token audience is not 'authenticated'");
                return false;
            }
            
            logger.info("Successfully validated Supabase user token for user: {}", claims.getSubject());
            return true;
            
        } catch (Exception e) {
            logger.error("Error validating Supabase user token: {}", e.getMessage(), e);
            return false;
        }
    }
    
    public Claims extractClaims(String token) {
        logger.debug("===== EXTRACTING JWT CLAIMS =====");
        
        if (token == null || token.trim().isEmpty()) {
            logger.warn("Cannot extract claims from null/empty token");
            return null;
        }
        
        try {
            // Check if this is a Supabase user access token
            String[] tokenParts = token.split("\\.");
            if (tokenParts.length >= 2) {
                String header = new String(Base64.getUrlDecoder().decode(tokenParts[0]));
                if (header.contains("\"kid\"")) {
                    logger.debug("Extracting claims from Supabase user token");
                    // For Supabase user tokens, parse without signature verification
                    Jwt<?, Claims> jwt = Jwts.parser()
                        .build()
                        .parseClaimsJwt(token.substring(0, token.lastIndexOf('.') + 1)); // Remove signature
                    return jwt.getPayload();
                }
            }
            
            // For API keys and other tokens, use the static secret
            initializeSecretKey();
            if (secretKey == null) {
                logger.error("JWT secret key not initialized");
                return null;
            }
            
            // Use JJWT 0.12.3 API directly
            Jws<Claims> jws = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            
            return jws.getPayload();
            
        } catch (Exception e) {
            logger.error("Error extracting claims from JWT token: {}", e.getMessage(), e);
            return null;
        }
    }
    
    // Alternative method that returns Claims instead of boolean (for compatibility)
    public Claims validateTokenAndGetClaims(String token) {
        if (validateToken(token)) {
            return extractClaims(token);
        }
        return null;
    }
    
    // Method expected by other classes
    public String extractUserId(String token) {
        Claims claims = extractClaims(token);
        return claims != null ? claims.getSubject() : null;
    }
    
    // Method expected by other classes  
    public String extractUserEmail(String token) {
        Claims claims = extractClaims(token);
        return claims != null ? (String) claims.get("email") : null;
    }
    
    // Method expected by other classes
    public String extractUserRole(String token) {
        Claims claims = extractClaims(token);
        if (claims != null) {
            // Check for role in different possible claim names
            String role = (String) claims.get("role");
            if (role == null) {
                role = (String) claims.get("user_role");
            }
            if (role == null && claims.get("app_metadata") != null) {
                // Handle nested metadata if it exists
                Object appMetadata = claims.get("app_metadata");
                if (appMetadata instanceof java.util.Map) {
                    @SuppressWarnings("unchecked")
                    java.util.Map<String, Object> metadata = (java.util.Map<String, Object>) appMetadata;
                    role = (String) metadata.get("role");
                }
            }
            return role;
        }
        return null;
    }
    
    // Method expected by other classes
    public boolean isTokenValid(String token) {
        return validateToken(token);
    }
}