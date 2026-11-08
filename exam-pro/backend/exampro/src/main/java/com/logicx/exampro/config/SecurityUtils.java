package com.logicx.exampro.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        else if (principal instanceof Jwt) {
            Jwt jwt = (Jwt) principal;
            // Try different claims in order of preference
            String username = jwt.getClaimAsString("preferred_username");
            if (username != null) return username;

            username = jwt.getClaimAsString("email");
            if (username != null) return username;

            return jwt.getClaimAsString("sub"); // fallback to subject ID
        }
        else if (principal instanceof String) {
            return (String) principal;
        }
        else {
            return authentication.getName();
        }
    }

    public static Jwt getCurrentJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            return (Jwt) authentication.getPrincipal();
        }
        throw new RuntimeException("JWT not found in security context");
    }

    public static String getCurrentUserId() {
        Jwt jwt = getCurrentJwt();
        return jwt.getClaimAsString("sub"); // Keycloak user ID
    }

    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
    }
}
