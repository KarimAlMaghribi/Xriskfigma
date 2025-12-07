package com.xrisk.backend.service;

import com.xrisk.backend.dto.CreateOfferRequest;
import com.xrisk.backend.model.Offer;
import com.xrisk.backend.model.OfferStatus;
import com.xrisk.backend.model.RiskStatus;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class OfferService {

    private final Map<UUID, Offer> offers = new ConcurrentHashMap<>();
    private final RiskService riskService;

    public OfferService(RiskService riskService) {
        this.riskService = riskService;
    }

    public Offer createOffer(CreateOfferRequest request) {
        riskService.findById(request.getRiskId())
                .orElseThrow(() -> new IllegalArgumentException("Risk not found"));

        Offer offer = new Offer(
                UUID.randomUUID(),
                request.getRiskId(),
                request.getOfferedByUserId(),
                request.getPremium(),
                request.getCoverageTypes(),
                OfferStatus.PENDING,
                LocalDateTime.now());
        offers.put(offer.getId(), offer);
        riskService.updateStatus(request.getRiskId(), RiskStatus.OFFERED);
        return offer;
    }

    public List<Offer> findByRisk(UUID riskId) {
        List<Offer> riskOffers = new ArrayList<>();
        for (Offer offer : offers.values()) {
            if (offer.getRiskId().equals(riskId)) {
                riskOffers.add(offer);
            }
        }
        return riskOffers;
    }

    public Optional<Offer> findById(UUID id) {
        return Optional.ofNullable(offers.get(id));
    }

    public Offer updateStatus(UUID offerId, OfferStatus status) {
        Offer existing = offers.get(offerId);
        if (existing == null) {
            throw new IllegalArgumentException("Offer not found");
        }
        Offer updated = existing.withStatus(status);
        offers.put(updated.getId(), updated);
        if (status == OfferStatus.ACCEPTED) {
            riskService.updateStatus(updated.getRiskId(), RiskStatus.CLOSED);
        }
        return updated;
    }
}
