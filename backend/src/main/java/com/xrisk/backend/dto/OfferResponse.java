package com.xrisk.backend.dto;

import com.xrisk.backend.model.CoverageType;
import com.xrisk.backend.model.OfferStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public class OfferResponse {
    private UUID id;
    private UUID riskId;
    private String offeredByUserId;
    private BigDecimal premium;
    private Set<CoverageType> coverageTypes;
    private OfferStatus status;
    private LocalDateTime createdAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getRiskId() {
        return riskId;
    }

    public void setRiskId(UUID riskId) {
        this.riskId = riskId;
    }

    public String getOfferedByUserId() {
        return offeredByUserId;
    }

    public void setOfferedByUserId(String offeredByUserId) {
        this.offeredByUserId = offeredByUserId;
    }

    public BigDecimal getPremium() {
        return premium;
    }

    public void setPremium(BigDecimal premium) {
        this.premium = premium;
    }

    public Set<CoverageType> getCoverageTypes() {
        return coverageTypes;
    }

    public void setCoverageTypes(Set<CoverageType> coverageTypes) {
        this.coverageTypes = coverageTypes;
    }

    public OfferStatus getStatus() {
        return status;
    }

    public void setStatus(OfferStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
