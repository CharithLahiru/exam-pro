package com.logicx.exampro.service.implementation.question;

import com.logicx.exampro.dto.QuestionRequest;
import com.logicx.exampro.dto.QuestionResponse;
import com.logicx.exampro.dto.StatusResponse;
import com.logicx.exampro.entity.Question;
import com.logicx.exampro.repository._interface.QuestionRepository;
import com.logicx.exampro.service._interface.question.QuestionService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public StatusResponse getQuestionById(String id) {
        try {
            Question question = questionRepository.findById(id).orElse(null);
            if(question == null) return StatusResponse.error("Question not found: "+ id);

            QuestionResponse questionResponse = new QuestionResponse(question);
            return StatusResponse.success("Question retrieved successfully",questionResponse);
        } catch (Exception e){
            return StatusResponse.error("Failed to retrieve question: " + e.getMessage());
        }
    }

    @Override
    public StatusResponse createQuestion(QuestionRequest questionRequest) {
        try{
            Question question = new Question(questionRequest);
            Question savedQuestion = questionRepository.save(question);

            if (savedQuestion.getQuestionId()!= null) {
                return StatusResponse.success("Question saved successfully");
            } else {
                return StatusResponse.error("Failed to save question");
            }
        } catch (Exception e) {
            return StatusResponse.error("Failed to save question: " + e.getMessage());
        }
    }

    @Override
    public StatusResponse updateQuestion(String questionId, QuestionRequest questionRequest) {
        try {
            Optional<Question> existingQuestionOpt = questionRepository.findById(questionId);

            if (existingQuestionOpt.isEmpty()) {
                return StatusResponse.error("Question not found with ID: " + questionId);
            }

            Question existingQuestion = new Question(questionRequest);

            questionRepository.save(existingQuestion);
            return StatusResponse.success("Question updated successfully");

        } catch (Exception e) {
            return StatusResponse.error("Failed to update question: " + e.getMessage());
        }
    }

    @Override
    public StatusResponse deleteQuestion(String questionId) {
        try {
            if (!questionRepository.existsById(questionId)) {
                return StatusResponse.error("Question not found with ID: " + questionId);
            }

            questionRepository.deleteById(questionId);
            return StatusResponse.success("Question deleted successfully");

        } catch (Exception e) {
            return StatusResponse.error("Failed to delete question: " + e.getMessage());
        }
    }
}
