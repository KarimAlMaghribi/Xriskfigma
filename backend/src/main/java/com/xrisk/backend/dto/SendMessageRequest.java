package com.xrisk.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class SendMessageRequest {
    @NotBlank
    private String senderUserId;

    @NotBlank
    private String message;

    public String getSenderUserId() {
        return senderUserId;
    }

    public void setSenderUserId(String senderUserId) {
        this.senderUserId = senderUserId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
