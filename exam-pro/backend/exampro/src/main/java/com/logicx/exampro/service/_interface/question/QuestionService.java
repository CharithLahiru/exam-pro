package com.logicx.exampro.service._interface.question;

import com.logicx.exampro.dto.QuestionRequest;
import com.logicx.exampro.dto.StatusResponse;

public interface QuestionService {
    StatusResponse getQuestionById(String id);
    StatusResponse createQuestion(QuestionRequest questionDetails);
    StatusResponse updateQuestion(String username, QuestionRequest questionRequest);
    StatusResponse deleteQuestion(String questionId);
}
