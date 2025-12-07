package com.xrisk.backend.service;

import com.xrisk.backend.dto.SendMessageRequest;
import com.xrisk.backend.model.Message;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    private final Map<UUID, List<Message>> messagesByOffer = new ConcurrentHashMap<>();
    private final OfferService offerService;

    public MessageService(OfferService offerService) {
        this.offerService = offerService;
    }

    public Message addMessage(UUID offerId, SendMessageRequest request) {
        offerService.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found"));

        Message message = new Message(UUID.randomUUID(), offerId, request.getSenderUserId(), request.getMessage(), LocalDateTime.now());
        messagesByOffer.computeIfAbsent(offerId, id -> new ArrayList<>()).add(message);
        return message;
    }

    public List<Message> findByOffer(UUID offerId) {
        return new ArrayList<>(messagesByOffer.getOrDefault(offerId, List.of()));
    }
}
