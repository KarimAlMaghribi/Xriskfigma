package com.xrisk.backend.service;

import com.xrisk.backend.dto.RiskRequest;
import com.xrisk.backend.model.Risk;
import com.xrisk.backend.model.RiskLevel;
import com.xrisk.backend.model.RiskStatus;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class RiskService {

    private final Map<UUID, Risk> risks = new ConcurrentHashMap<>();

    public Risk createRisk(RiskRequest request) {
        int score = calculateScore(request.getCoverageAmount(), request.getPremium());
        RiskLevel level = resolveRiskLevel(score);
        Risk risk = new Risk(UUID.randomUUID(),
                request.getTitle(),
                request.getCategory(),
                request.getDescription(),
                request.getCoverageAmount(),
                request.getPremium(),
                request.getDurationDays(),
                RiskStatus.OPEN,
                level,
                score,
                request.getCreatedByUserId(),
                LocalDateTime.now());
        risks.put(risk.getId(), risk);
        return risk;
    }

    public Optional<Risk> findById(UUID id) {
        return Optional.ofNullable(risks.get(id));
    }

    public List<Risk> findAll() {
        return new ArrayList<>(risks.values());
    }

    public void save(Risk risk) {
        risks.put(risk.getId(), risk);
    }

    public Risk updateStatus(UUID riskId, RiskStatus status) {
        Risk existing = risks.get(riskId);
        if (existing == null) {
            throw new IllegalArgumentException("Risk not found");
        }
        Risk updated = new Risk(
                existing.getId(),
                existing.getTitle(),
                existing.getCategory(),
                existing.getDescription(),
                existing.getCoverageAmount(),
                existing.getPremium(),
                existing.getDurationDays(),
                status,
                existing.getLevel(),
                existing.getRiskScore(),
                existing.getCreatedByUserId(),
                existing.getCreatedAt());
        risks.put(updated.getId(), updated);
        return updated;
    }

    private int calculateScore(BigDecimal coverageAmount, BigDecimal premium) {
        if (premium.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        BigDecimal ratio = coverageAmount.divide(premium, 2, RoundingMode.HALF_UP);
        int scaled = (int) Math.min(100, Math.round(ratio.doubleValue() * 10));
        return Math.max(0, scaled);
    }

    private RiskLevel resolveRiskLevel(int score) {
        if (score >= 70) {
            return RiskLevel.HIGH;
        }
        if (score >= 40) {
            return RiskLevel.MEDIUM;
        }
        return RiskLevel.LOW;
    }
}
