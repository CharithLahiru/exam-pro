package com.logicx.exampro.service.implementation.user;

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
    public UserResponse getUserByUsername(String username) {
        // Get user from database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Convert Entity to DTO
        return new UserResponse(user);
    }
}
