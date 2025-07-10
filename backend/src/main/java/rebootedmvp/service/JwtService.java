package rebootedmvp.service;

import org.springframework.stereotype.Service;

import rebootedmvp.security.JwtTokenValidator;

@Service
public class JwtService {

    private final JwtTokenValidator jwtTokenValidator;

    public JwtService(JwtTokenValidator jwtTokenValidator) {
        this.jwtTokenValidator = jwtTokenValidator;
    }

    public String extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid Authorization header");
        }
        String token = authHeader.substring(7);
        // Use your existing JwtTokenValidator to validate and parse the token
        return jwtTokenValidator.extractUserId(token);
    }
}