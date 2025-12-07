package com.xrisk.backend.config;

import com.xrisk.backend.dto.CreateOfferRequest;
import com.xrisk.backend.dto.RiskRequest;
import com.xrisk.backend.dto.SendMessageRequest;
import com.xrisk.backend.model.CoverageType;
import com.xrisk.backend.model.OfferStatus;
import com.xrisk.backend.model.Risk;
import com.xrisk.backend.service.MessageService;
import com.xrisk.backend.service.OfferService;
import com.xrisk.backend.service.RiskService;
import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.EnumSet;
import org.springframework.stereotype.Component;

@Component
public class DemoDataInitializer {

    private final RiskService riskService;
    private final OfferService offerService;
    private final MessageService messageService;

    public DemoDataInitializer(RiskService riskService, OfferService offerService, MessageService messageService) {
        this.riskService = riskService;
        this.offerService = offerService;
        this.messageService = messageService;
    }

    @PostConstruct
    public void seed() {
        RiskRequest bikeRisk = new RiskRequest();
        bikeRisk.setTitle("E-Bike Diebstahl");
        bikeRisk.setCategory("Mobility");
        bikeRisk.setDescription("Schutz für ein neues E-Bike inklusive Diebstahl und Vandalismus.");
        bikeRisk.setCoverageAmount(new BigDecimal("3200"));
        bikeRisk.setPremium(new BigDecimal("22.50"));
        bikeRisk.setDurationDays(365);
        bikeRisk.setCreatedByUserId("owner-1");
        Risk createdRisk = riskService.createRisk(bikeRisk);

        CreateOfferRequest offerRequest = new CreateOfferRequest();
        offerRequest.setRiskId(createdRisk.getId());
        offerRequest.setPremium(new BigDecimal("25.00"));
        offerRequest.setCoverageTypes(EnumSet.of(CoverageType.DAMAGE, CoverageType.LOSS_OR_THEFT));
        offerRequest.setOfferedByUserId("broker-1");
        var offer = offerService.createOffer(offerRequest);
        offerService.updateStatus(offer.getId(), OfferStatus.PENDING);

        SendMessageRequest message = new SendMessageRequest();
        message.setSenderUserId("broker-1");
        message.setMessage("Wir empfehlen dieses Angebot wegen höherer Diebstahlquote in Ihrer Region.");
        messageService.addMessage(offer.getId(), message);
    }
}
