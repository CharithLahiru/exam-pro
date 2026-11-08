package com.logicx.exampro.controller.question;

import com.logicx.exampro.dto.QuestionRequest;
import com.logicx.exampro.dto.QuestionResponse;
import com.logicx.exampro.dto.StatusResponse;
import com.logicx.exampro.service._interface.question.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/question")
@RestController
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {this.questionService=questionService;}

    @PostMapping("/create-question")
    public ResponseEntity<StatusResponse> createQuestion(@RequestBody QuestionRequest questionRequest){
        StatusResponse response =  questionService.createQuestion(questionRequest);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/get-question/{questionId}")
    public ResponseEntity<StatusResponse> getQuestion(@PathVariable String questionId){
        StatusResponse response = questionService.getQuestionById(questionId);
        if(response.isSuccess()) {
            return ResponseEntity.ok(response);
        }else{
            return
                    ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/get-random-question/{subjectId}")
    public ResponseEntity<StatusResponse> getRandomQuestion(@PathVariable String subjectId){
        StatusResponse response = questionService.getRandomQuestion(subjectId);
        if(response.isSuccess()) {
            return ResponseEntity.ok(response);
        }else{
            return
                    ResponseEntity.badRequest().body(response);
        }
    }

}
