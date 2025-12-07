package com.xrisk.backend.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Message {
    private final UUID id;
    private final UUID offerId;
    private final String senderUserId;
    private final String body;
    private final LocalDateTime createdAt;

    public Message(UUID id, UUID offerId, String senderUserId, String body, LocalDateTime createdAt) {
        this.id = id;
        this.offerId = offerId;
        this.senderUserId = senderUserId;
        this.body = body;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getOfferId() {
        return offerId;
    }

    public String getSenderUserId() {
        return senderUserId;
    }

    public String getBody() {
        return body;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
