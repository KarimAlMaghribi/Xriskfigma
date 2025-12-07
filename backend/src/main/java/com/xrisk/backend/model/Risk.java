package com.xrisk.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Risk {
    private final UUID id;
    private final String title;
    private final String category;
    private final String description;
    private final BigDecimal coverageAmount;
    private final BigDecimal premium;
    private final int durationDays;
    private final RiskStatus status;
    private final RiskLevel level;
    private final int riskScore;
    private final String createdByUserId;
    private final LocalDateTime createdAt;

    public Risk(UUID id,
                String title,
                String category,
                String description,
                BigDecimal coverageAmount,
                BigDecimal premium,
                int durationDays,
                RiskStatus status,
                RiskLevel level,
                int riskScore,
                String createdByUserId,
                LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.coverageAmount = coverageAmount;
        this.premium = premium;
        this.durationDays = durationDays;
        this.status = status;
        this.level = level;
        this.riskScore = riskScore;
        this.createdByUserId = createdByUserId;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getCoverageAmount() {
        return coverageAmount;
    }

    public BigDecimal getPremium() {
        return premium;
    }

    public int getDurationDays() {
        return durationDays;
    }

    public RiskStatus getStatus() {
        return status;
    }

    public RiskLevel getLevel() {
        return level;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public String getCreatedByUserId() {
        return createdByUserId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
