package com.xrisk.backend.controller;

import com.xrisk.backend.dto.RiskRequest;
import com.xrisk.backend.dto.RiskResponse;
import com.xrisk.backend.model.Risk;
import com.xrisk.backend.service.RiskService;
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
@RequestMapping("/api/risks")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @PostMapping
    public ResponseEntity<RiskResponse> createRisk(@Valid @RequestBody RiskRequest request) {
        Risk risk = riskService.createRisk(request);
        return ResponseEntity.ok(toResponse(risk));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiskResponse> getRisk(@PathVariable UUID id) {
        return riskService.findById(id)
                .map(risk -> ResponseEntity.ok(toResponse(risk)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<RiskResponse> listRisks() {
        return riskService.findAll().stream().map(this::toResponse).toList();
    }

    private RiskResponse toResponse(Risk risk) {
        RiskResponse response = new RiskResponse();
        response.setId(risk.getId());
        response.setTitle(risk.getTitle());
        response.setCategory(risk.getCategory());
        response.setDescription(risk.getDescription());
        response.setCoverageAmount(risk.getCoverageAmount());
        response.setPremium(risk.getPremium());
        response.setDurationDays(risk.getDurationDays());
        response.setStatus(risk.getStatus());
        response.setLevel(risk.getLevel());
        response.setRiskScore(risk.getRiskScore());
        response.setCreatedByUserId(risk.getCreatedByUserId());
        response.setCreatedAt(risk.getCreatedAt());
        return response;
    }
}
