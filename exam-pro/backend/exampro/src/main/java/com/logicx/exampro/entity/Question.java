package com.logicx.exampro.entity;

import com.logicx.exampro.dto.QuestionRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "QUESTIONS")
public class Question {

    @Id
    @Column(name = "ID", length = 10)
    private String questionId;

    @Column(name = "CATEGORY", length = 10)
    private String questionCategory;

    @Column(name = "QUESTION", length = 30)
    private String question;

    @Column(name = "IMG_REF", length = 30)
    private String questionImgRef;

    @Column(name = "STATUS", length = 10)
    private String status;

    public Question() {
    }

    public Question(QuestionRequest questionRequest) {
        this.questionCategory=questionRequest.getQuestionCategory();
        this.question=questionRequest.getQuestion();
        this.questionImgRef=questionRequest.getQuestionImgRef();
        this.status="PENDING";
    }


    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public String getQuestionCategory() {
        return questionCategory;
    }

    public void setQuestionCategory(String questionCategory) {
        this.questionCategory = questionCategory;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getQuestionImgRef() {
        return questionImgRef;
    }

    public void setQuestionImgRef(String questionImgRef) {
        this.questionImgRef = questionImgRef;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
