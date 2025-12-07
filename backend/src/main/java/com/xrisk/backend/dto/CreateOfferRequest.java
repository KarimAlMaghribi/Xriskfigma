package com.xrisk.backend.dto;

import com.xrisk.backend.model.CoverageType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

public class CreateOfferRequest {
    @NotNull
    private UUID riskId;

    @NotNull
    @Positive
    private BigDecimal premium;

    @NotEmpty
    private Set<CoverageType> coverageTypes;

    @NotNull
    private String offeredByUserId;

    public UUID getRiskId() {
        return riskId;
    }

    public void setRiskId(UUID riskId) {
        this.riskId = riskId;
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

    public String getOfferedByUserId() {
        return offeredByUserId;
    }

    public void setOfferedByUserId(String offeredByUserId) {
        this.offeredByUserId = offeredByUserId;
    }
}
