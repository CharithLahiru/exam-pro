package com.logicx.exampro.service.implementation.user;

import com.logicx.exampro.dto.StatusResponse;
import com.logicx.exampro.dto.UserRequest;
import com.logicx.exampro.dto.UserResponse;
import com.logicx.exampro.entity.User;
import com.logicx.exampro.repository._interface.UserRepository;
import com.logicx.exampro.service._interface.user.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public StatusResponse getUserByUsername(String username) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElse(null);

            if (user == null) {
                return StatusResponse.error("User not found: " + username);
            }

            UserResponse userResponse = new UserResponse(user);
            return StatusResponse.success("User retrieved successfully", userResponse);

        } catch (Exception e) {
            return StatusResponse.error("Failed to retrieve user: " + e.getMessage());
        }
    }

    @Override
    public StatusResponse createUser(UserRequest userRequest) {

        //TODO: add audit log here
        try{
        // Check if username already exists
        if (userRepository.existsById(userRequest.getUsername())) {
            throw new RuntimeException("Username already exists: " + userRequest.getUsername());
        }

        User user = new User(userRequest);
        User savedUser = userRepository.save(user);

        UserResponse userResponse = new UserResponse(savedUser);
        return StatusResponse.success("User created successfully", userResponse);
        } catch (Exception e) {
            return StatusResponse.error("Failed to create user: " + e.getMessage());
        }
    }

    @Override
    public StatusResponse updateUser(String username, UserRequest userRequest) {
        try {
            User existingUser = userRepository.findByUsername(username)
                    .orElse(null);

            if (existingUser == null) {
                return StatusResponse.error("User not found: " + username);
            }

            // Update fields
            existingUser.setFirstName(userRequest.getFirstName());
            existingUser.setLastName(userRequest.getLastName());
            existingUser.setEmail(userRequest.getEmail());
            existingUser.setMobile(userRequest.getMobile());
            existingUser.setAccountType(userRequest.getAccountType());

            User updatedUser = userRepository.save(existingUser);
            UserResponse userResponse = new UserResponse(updatedUser);

            return StatusResponse.success("User updated successfully", userResponse);

        } catch (Exception e) {
            return StatusResponse.error("Failed to update user: " + e.getMessage());
        }

    }
    @Override
    public StatusResponse deleteUser(String username) {
        try {
            if (!userRepository.existsById(username)) {
                return StatusResponse.error("User not found: " + username);
            }

            userRepository.deleteById(username);
            return StatusResponse.success("User deleted successfully");

        } catch (Exception e) {
            return StatusResponse.error("Failed to delete user: " + e.getMessage());
        }
    }

}
