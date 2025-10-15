package com.logicx.exampro.dto;

public class QuestionRequest {
    private String questionId;
    private String questionCategory;
    private String question;
    private String questionImgRef;

    public QuestionRequest() {
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
}
