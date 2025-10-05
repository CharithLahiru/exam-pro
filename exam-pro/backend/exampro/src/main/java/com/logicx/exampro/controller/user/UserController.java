package com.logicx.exampro.controller.user;

import com.logicx.exampro.dto.UserResponse;
import com.logicx.exampro.service._interface.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/account")
@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/username/{userName}")
    public ResponseEntity<UserResponse> getUserDetails(
            @PathVariable(value = "userName") String username) {

        UserResponse userDetails = userService.getUserByUsername(username);
        return ResponseEntity.ok(userDetails);
    }
}
