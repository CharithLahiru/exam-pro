package com.logicx.exampro.service._interface.user;

import com.logicx.exampro.dto.UserResponse;

public interface UserService  {
    UserResponse getUserByUsername(String username);
}
