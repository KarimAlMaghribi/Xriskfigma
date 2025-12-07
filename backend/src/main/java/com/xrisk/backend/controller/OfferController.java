package com.xrisk.backend.controller;

import com.xrisk.backend.dto.CreateOfferRequest;
import com.xrisk.backend.dto.OfferResponse;
import com.xrisk.backend.dto.UpdateOfferStatusRequest;
import com.xrisk.backend.model.Offer;
import com.xrisk.backend.service.OfferService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping("/offers")
    public ResponseEntity<OfferResponse> createOffer(@Valid @RequestBody CreateOfferRequest request) {
        Offer offer = offerService.createOffer(request);
        return ResponseEntity.ok(toResponse(offer));
    }

    @GetMapping("/risks/{riskId}/offers")
    public ResponseEntity<List<OfferResponse>> getOffersForRisk(@PathVariable UUID riskId) {
        List<OfferResponse> offers = offerService.findByRisk(riskId).stream().map(this::toResponse).toList();
        return ResponseEntity.ok(offers);
    }

    @PatchMapping("/offers/{offerId}/status")
    public ResponseEntity<OfferResponse> updateOfferStatus(@PathVariable UUID offerId,
                                                           @Valid @RequestBody UpdateOfferStatusRequest request) {
        try {
            Offer updated = offerService.updateStatus(offerId, request.getStatus());
            return ResponseEntity.ok(toResponse(updated));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    private OfferResponse toResponse(Offer offer) {
        OfferResponse response = new OfferResponse();
        response.setId(offer.getId());
        response.setRiskId(offer.getRiskId());
        response.setOfferedByUserId(offer.getOfferedByUserId());
        response.setPremium(offer.getPremium());
        response.setCoverageTypes(offer.getCoverageTypes());
        response.setStatus(offer.getStatus());
        response.setCreatedAt(offer.getCreatedAt());
        return response;
    }
}
