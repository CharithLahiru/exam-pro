package com.logicx.exampro.config;

import com.logicx.exampro.dto.StatusResponse;
import com.logicx.exampro.dto.UserRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationController.class);

    private final KeycloakUserService keycloakUserService;

    public AuthenticationController(KeycloakUserService keycloakUserService) {
        this.keycloakUserService = keycloakUserService;
    }

    /**
     * Register a new user
     * POST /api/auth/register
     */
//    @PostMapping("/register")
//    public ResponseEntity<StatusResponse> registerUser(@Valid @RequestBody UserRequest userRequest) {
//        StatusResponse response = keycloakUserService.createUser(userRequest);
//
//        if (response.isSuccess()) {
//            return ResponseEntity.ok(response);
//        }
//        return ResponseEntity.badRequest().body(response);
//    }

    /**
     * Login user and get JWT token
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthenticationResponse response = keycloakUserService.authenticateUser(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            AuthenticationResponse response = keycloakUserService.refreshToken(request.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<StatusResponse> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        try {
            String refreshToken = (request != null) ? request.getRefreshToken() : null;
            keycloakUserService.logoutUser(refreshToken);
            return ResponseEntity.ok(StatusResponse.success("Logged out successfully", null));
        } catch (Exception e) {
            log.error("Error during user logout: {}", e.getMessage(), e);
            return ResponseEntity.ok(StatusResponse.success("Logged out successfully", null));
        }
    }
}
