package com.logicx.exampro.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class StatusResponse {
    private boolean success;
    private String description;
    private Object data;

    public StatusResponse() {}

    public StatusResponse(boolean success, String description) {
        this.success = success;
        this.description = description;
    }

    public StatusResponse(boolean success, String description, Object data) {
        this.success = success;
        this.description = description;
        this.data = data;
    }

    // Static factory methods
    public static StatusResponse success(String description) {
        return new StatusResponse(true, description);
    }

    public static StatusResponse success(String description, Object data) {
        return new StatusResponse(true, description, data);
    }

    public static StatusResponse error(String description) {
        return new StatusResponse(false, description);
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
