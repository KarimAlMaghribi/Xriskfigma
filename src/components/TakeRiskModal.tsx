import { useState } from "react";
import {
  Box,
  Drawer,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Risk, calculateRiskScore } from "../types/risk";
import { CURRENT_USER_ID } from "../lib/current-user";
import { users } from "../lib/user-mock-data";
import { DrawerHeader } from "./drawer/DrawerHeader";
import { RiskHeaderSection } from "./drawer/RiskHeaderSection";
import { RiskInfoGrid } from "./drawer/RiskInfoGrid";
import { ActionButton } from "./ui/ActionButton";
import { PremiumRecommendation } from "./ui/PremiumRecommendation";
import { COLORS } from "../lib/constants";

interface TakeRiskModalProps {
  open: boolean;
  onClose: () => void;
  risk: Risk | null;
  onSubmit?: (premium: number) => void;
}

export function TakeRiskModal({ open, onClose, risk, onSubmit }: TakeRiskModalProps) {
  const [premium, setPremium] = useState("");

  if (!risk) return null;

  // Prevent user from taking their own risk
  if (risk.createdByUserId === CURRENT_USER_ID) {
    return null;
  }

  const riskScore = calculateRiskScore(risk);
  const user = users[risk.createdByUserId];

  // Calculate recommended premium range (±15% of original premium)
  const recommendedMin = Math.round(risk.premium * 0.85);
  const recommendedMax = Math.round(risk.premium * 1.15);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(parseFloat(premium));
    }
    onClose();
    setPremium("");
  };

  const startDate = risk.startDate || new Date();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "500px", md: "600px" },
          bgcolor: COLORS.neutral.white,
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <DrawerHeader title="Angebot abgeben" onClose={onClose} />

        {/* Content - Scrollable */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          <RiskHeaderSection
            riskScore={riskScore}
            category={risk.category}
            title={risk.title}
            description={risk.description}
            showUserInfo={{
              avatar: user?.avatar,
              name: risk.createdBy,
              rating: user?.rating || 0,
            }}
          />

          <Box sx={{ mb: 4 }}>
            <RiskInfoGrid
              coverageAmount={risk.coverageAmount}
              startDate={startDate}
              duration={risk.duration}
            />
          </Box>

          {/* Premium Input */}
          <Box sx={{ mb: 3 }}>
            <span className="body-sm-medium" style={{ display: "block", marginBottom: "8px" }}>
              Deine gewünschte Prämie
            </span>
            <TextField
              fullWidth
              type="number"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
              placeholder="Prämie eingeben"
              InputProps={{
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
                sx: {
                  "& input": {
                    fontSize: "16px",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "&:hover fieldset": {
                    borderColor: COLORS.brand.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: COLORS.brand.primary,
                  },
                },
              }}
            />
          </Box>

          {/* Premium Recommendation */}
          <PremiumRecommendation
            minPremium={recommendedMin}
            maxPremium={recommendedMax}
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${COLORS.neutral.border}`,
            display: "flex",
            gap: 2,
          }}
        >
          <ActionButton onClick={onClose} variant="outline" fullWidth>
            Abbrechen
          </ActionButton>
          <ActionButton
            onClick={handleSubmit}
            variant="secondary"
            fullWidth
            disabled={!premium}
          >
            Angebot absenden
          </ActionButton>
        </Box>
      </Box>
    </Drawer>
  );
}
