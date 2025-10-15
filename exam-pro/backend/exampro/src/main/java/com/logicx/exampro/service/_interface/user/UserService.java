package com.logicx.exampro.service._interface.user;

import com.logicx.exampro.dto.StatusResponse;
import com.logicx.exampro.dto.UserRequest;
import com.logicx.exampro.dto.UserResponse;
import com.logicx.exampro.entity.User;

public interface UserService  {
    StatusResponse getUserByUsername(String username);
    StatusResponse createUser(UserRequest userDetails);
    StatusResponse updateUser(String username, UserRequest userRequest);
    StatusResponse deleteUser(String username);

}
