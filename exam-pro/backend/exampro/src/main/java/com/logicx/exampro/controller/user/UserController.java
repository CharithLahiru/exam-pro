package com.logicx.exampro.controller.user;

import com.logicx.exampro.dto.StatusResponse;
import com.logicx.exampro.dto.UserRequest;
import com.logicx.exampro.service._interface.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/account")
@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create user
    @PostMapping("/createuser")
    public ResponseEntity<StatusResponse> createUser(@RequestBody UserRequest userRequest) {
        StatusResponse response = userService.createUser(userRequest);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get user by username
    @GetMapping("/getuser/{username}")
    public ResponseEntity<StatusResponse> getUser(@PathVariable String username) {
        StatusResponse response = userService.getUserByUsername(username);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Update user
    @PutMapping("/updateUser/{username}")
    public ResponseEntity<StatusResponse> updateUser(
            @PathVariable String username,
            @RequestBody UserRequest userRequest) {
        StatusResponse response = userService.updateUser(username, userRequest);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Delete user
    @DeleteMapping("/deleteUser/{username}")
    public ResponseEntity<StatusResponse> deleteUser(@PathVariable String username) {
        StatusResponse response = userService.deleteUser(username);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
