package com.xrisk.backend.controller;

import com.xrisk.backend.dto.MessageResponse;
import com.xrisk.backend.dto.SendMessageRequest;
import com.xrisk.backend.model.Message;
import com.xrisk.backend.service.MessageService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/offers/{offerId}/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@PathVariable UUID offerId,
                                                       @Valid @RequestBody SendMessageRequest request) {
        try {
            Message message = messageService.addMessage(offerId, request);
            return ResponseEntity.ok(toResponse(message));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public List<MessageResponse> listMessages(@PathVariable UUID offerId) {
        return messageService.findByOffer(offerId).stream().map(this::toResponse).toList();
    }

    private MessageResponse toResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setOfferId(message.getOfferId());
        response.setSenderUserId(message.getSenderUserId());
        response.setMessage(message.getBody());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}
