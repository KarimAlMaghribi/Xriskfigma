package com.xrisk.backend.dto;

import com.xrisk.backend.model.OfferStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateOfferStatusRequest {
    @NotNull
    private OfferStatus status;

    public OfferStatus getStatus() {
        return status;
    }

    public void setStatus(OfferStatus status) {
        this.status = status;
    }
}
