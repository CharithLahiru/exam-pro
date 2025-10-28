package com.logicx.exampro.config;

import com.logicx.exampro.dto.StatusResponse;
import com.logicx.exampro.dto.UserRequest;
import com.logicx.exampro.dto.UserResponse;
import com.logicx.exampro.entity.User;
import com.logicx.exampro.repository._interface.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import jakarta.ws.rs.core.Response;
import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@Service
public class KeycloakUserService {

    @Value("${keycloak.auth-server-url}")
    private String keycloakServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    @Value("${keycloak.admin.username}")
    private String adminUsername;

    @Value("${keycloak.admin.password}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public KeycloakUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Creates a new user in both local database and Keycloak
     */
    public StatusResponse createUser(UserRequest userRequest) {
        try {
            // Check if username already exists in local DB
            if (userRepository.existsById(userRequest.getUsername())) {
                return StatusResponse.error("Username already exists: " + userRequest.getUsername());
            }

            // Create user in Keycloak first
            String keycloakUserId = createKeycloakUser(userRequest);

            if (keycloakUserId == null) {
                return StatusResponse.error("Failed to create user in Keycloak");
            }

            // Save user to local database
            User user = new User(userRequest);
            user.setKeycloakId(keycloakUserId); // Store Keycloak ID for reference
            User savedUser = userRepository.save(user);

            UserResponse userResponse = new UserResponse(savedUser);
            return StatusResponse.success("User created successfully", userResponse);

        } catch (Exception e) {
            return StatusResponse.error("Failed to create user: " + e.getMessage());
        }
    }

    /**
     * Creates user in Keycloak and returns the Keycloak user ID
     */
    public String createKeycloakUser(UserRequest userRequest) {
        Keycloak keycloak = null;
        try {
            // Initialize Keycloak admin client
            keycloak = KeycloakBuilder.builder()
                    .serverUrl(keycloakServerUrl)
                    .realm("master") // Use master realm for admin access
                    .username(adminUsername)
                    .password(adminPassword)
                    .clientId("admin-cli")
                    .build();

            // Get realm and users resource
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();

            // Create user representation
            UserRepresentation user = new UserRepresentation();
            user.setEnabled(true);
            user.setUsername(userRequest.getUsername());
            user.setEmail(userRequest.getEmail());
            user.setFirstName(userRequest.getFirstName());
            user.setLastName(userRequest.getLastName());
            user.setEmailVerified(false);

            // Add custom attributes if needed
            Map<String, List<String>> attributes = new HashMap<>();
            attributes.put("mobile", Collections.singletonList(userRequest.getMobile()));
            attributes.put("accountType", Collections.singletonList(userRequest.getAccountType()));
            user.setAttributes(attributes);

            // Create user
            Response response = usersResource.create(user);

            if (response.getStatus() != 201) {
                if(!"Created".equalsIgnoreCase(response.toString()))  throw new RuntimeException("Failed to create user in Keycloak: " + response.getStatusInfo());
            }

            // Extract user ID from location header
            String locationHeader = response.getHeaderString("Location");
            String userId = locationHeader.substring(locationHeader.lastIndexOf('/') + 1);

            // Set password
            setUserPassword(usersResource, userId, userRequest.getPassword());

            // Assign role based on account type
            assignRole(realmResource, userId, userRequest.getAccountType());

            response.close();
            return userId;

        } catch (Exception e) {
            throw new RuntimeException("Error creating Keycloak user: " + e.getMessage(), e);
        } finally {
            if (keycloak != null) {
                keycloak.close();
            }
        }
    }

    /**
     * Sets password for Keycloak user
     */
    private void setUserPassword(UsersResource usersResource, String userId, String password) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false); // Set to true if you want users to change password on first login

        usersResource.get(userId).resetPassword(credential);
    }

    /**
     * Assigns role to user based on account type
     */
    private void assignRole(RealmResource realmResource, String userId, String accountType) {
        String roleName = mapAccountTypeToRole(accountType);

        try {
            var roleRepresentation = realmResource.roles().get(roleName).toRepresentation();
            realmResource.users().get(userId).roles().realmLevel()
                    .add(Collections.singletonList(roleRepresentation));
        } catch (Exception e) {
            throw new RuntimeException("Failed to assign role: " + roleName, e);
        }
    }

    /**
     * Maps account type to Keycloak role
     */
    private String mapAccountTypeToRole(String accountType) {
        return switch (accountType.toUpperCase()) {
            case "STUDENT" -> "ROLE_STUDENT";
            case "TEACHER" -> "ROLE_TEACHER";
            case "ADMIN" -> "ROLE_ADMIN";
            default -> "ROLE_STUDENT"; // Default role
        };
    }

    /**
     * Authenticates user and returns JWT token
     */
    public AuthenticationResponse authenticateUser(String username, String password) {
        try {
//            String tokenUrl = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
            String tokenUrl = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("grant_type", "password");
            formData.add("client_id", clientId);
            formData.add("client_secret", clientSecret);
            formData.add("username", username);
            formData.add("password", password);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                return new AuthenticationResponse(
                        (String) responseBody.get("access_token"),
                        (String) responseBody.get("refresh_token"),
                        (String) responseBody.get("token_type"),
                        (Integer) responseBody.get("expires_in")
                );
            }

            throw new RuntimeException("Authentication failed");

        } catch (Exception e) {
            throw new RuntimeException("Authentication error: " + e.getMessage(), e);
        }
    }

    /**
     * Refreshes access token using refresh token
     */
    public AuthenticationResponse refreshToken(String refreshToken) {
        try {
//            String tokenUrl = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
            String tokenUrl = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("grant_type", "refresh_token");
            formData.add("client_id", clientId);
            formData.add("client_secret", clientSecret);
            formData.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                return new AuthenticationResponse(
                        (String) responseBody.get("access_token"),
                        (String) responseBody.get("refresh_token"),
                        (String) responseBody.get("token_type"),
                        (Integer) responseBody.get("expires_in")
                );
            }

            throw new RuntimeException("Token refresh failed");

        } catch (Exception e) {
            throw new RuntimeException("Token refresh error: " + e.getMessage(), e);
        }
    }

    /**
     * Logs out user by invalidating tokens
     */
    public void logoutUser(String refreshToken) {
        try {
//            String logoutUrl = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/logout";
            String logoutUrl = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/logout";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", clientId);
            formData.add("client_secret", clientSecret);
            formData.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            restTemplate.postForEntity(logoutUrl, request, Void.class);

        } catch (Exception e) {
            throw new RuntimeException("Logout error: " + e.getMessage(), e);
        }
    }
}

// ========================================
// 3. AuthenticationController.java (CONTROLLER)
// ========================================


// Login Request DTO
class LoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    public LoginRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

// Refresh Token Request DTO
class RefreshTokenRequest {
    @NotBlank
    private String refreshToken;

    public RefreshTokenRequest() {
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}

// Authentication Response DTO
class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Integer expiresIn;

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String accessToken, String refreshToken, String tokenType, Integer expiresIn) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Integer getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Integer expiresIn) {
        this.expiresIn = expiresIn;
    }
}