package com.xrisk.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public class Offer {
    private final UUID id;
    private final UUID riskId;
    private final String offeredByUserId;
    private final BigDecimal premium;
    private final Set<CoverageType> coverageTypes;
    private final OfferStatus status;
    private final LocalDateTime createdAt;

    public Offer(UUID id,
                 UUID riskId,
                 String offeredByUserId,
                 BigDecimal premium,
                 Set<CoverageType> coverageTypes,
                 OfferStatus status,
                 LocalDateTime createdAt) {
        this.id = id;
        this.riskId = riskId;
        this.offeredByUserId = offeredByUserId;
        this.premium = premium;
        this.coverageTypes = coverageTypes;
        this.status = status;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getRiskId() {
        return riskId;
    }

    public String getOfferedByUserId() {
        return offeredByUserId;
    }

    public BigDecimal getPremium() {
        return premium;
    }

    public Set<CoverageType> getCoverageTypes() {
        return coverageTypes;
    }

    public OfferStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Offer withStatus(OfferStatus newStatus) {
        return new Offer(id, riskId, offeredByUserId, premium, coverageTypes, newStatus, createdAt);
    }
}
