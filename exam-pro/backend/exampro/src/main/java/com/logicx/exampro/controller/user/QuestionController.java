package com.logicx.exampro.controller.user;

import com.logicx.exampro.dto.StatusResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/question")
@RestController
public class QuestionController {
    @PostMapping("/savequestion")
    public ResponseEntity<StatusResponse> saveQuestion(){
        return null;
    }
}
