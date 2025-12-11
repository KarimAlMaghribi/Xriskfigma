import { Box, Drawer, Stack } from "@mui/material";
import { Risk, calculateRiskScore } from "../types/risk";
import { offers as allOffers } from "../lib/offers-mock-data";
import { users } from "../lib/user-mock-data";
import { DrawerHeader } from "./drawer/DrawerHeader";
import { RiskHeaderSection } from "./drawer/RiskHeaderSection";
import { RiskInfoGrid } from "./drawer/RiskInfoGrid";
import { ActionButton } from "./ui/ActionButton";
import { OfferCard } from "./ui/OfferCard";
import { COLORS } from "../lib/constants";

interface RiskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  risk: Risk | null;
  onTakeRisk: (risk: Risk) => void;
  onUserClick: (userId: string) => void;
  context?: 'marketplace' | 'own' | 'taken';
}

export function RiskDetailDialog({
  open,
  onClose,
  risk,
  context = 'own',
}: RiskDetailDialogProps) {
  if (!risk) return null;

  const riskScore = calculateRiskScore(risk);
  const riskOffers = allOffers.filter((o) => o.riskId === risk.id);
  const startDate = risk.startDate || new Date();

  const handleEdit = () => {
    console.log("Edit risk:", risk.id);
    // TODO: Implement edit functionality
  };

  const handleDelete = () => {
    console.log("Delete risk:", risk.id);
    // TODO: Implement delete functionality
  };

  const handleAcceptOffer = (offerId: string) => {
    console.log("Accept offer:", offerId);
    // TODO: Implement accept offer functionality
  };

  const handleMaybeOffer = (offerId: string) => {
    console.log("Maybe offer:", offerId);
    // TODO: Implement maybe offer functionality
  };

  const handleRejectOffer = (offerId: string) => {
    console.log("Reject offer:", offerId);
    // TODO: Implement reject offer functionality
  };

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
        <DrawerHeader title="Dein Anliegen" onClose={onClose} />

        {/* Content - Scrollable */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          <RiskHeaderSection
            riskScore={riskScore}
            category={risk.category}
            title={risk.title}
            description={risk.description}
          />

          <Box sx={{ mb: 4 }}>
            <RiskInfoGrid
              coverageAmount={risk.coverageAmount}
              startDate={startDate}
              duration={risk.duration}
            />
          </Box>

          {/* Offers Section */}
          {riskOffers.length > 0 && (
            <Stack spacing={2}>
              {riskOffers.map((offer) => {
                const offerUser = users[offer.offeredByUserId];
                return (
                  <OfferCard
                    key={offer.id}
                    offerId={offer.id}
                    userName={offer.offeredBy}
                    userAvatar={offerUser?.avatar}
                    userRating={offerUser?.rating || 0}
                    premium={offer.premium}
                    message={offer.message}
                    onAccept={handleAcceptOffer}
                    onMaybe={handleMaybeOffer}
                    onReject={handleRejectOffer}
                  />
                );
              })}
            </Stack>
          )}
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
          <ActionButton
            onClick={handleEdit}
            variant="outline"
            fullWidth
            startIcon={<span>✏️</span>}
          >
            Bearbeiten
          </ActionButton>
          <ActionButton
            onClick={handleDelete}
            variant="danger"
            fullWidth
            startIcon={<span>🗑️</span>}
          >
            Löschen
          </ActionButton>
        </Box>
      </Box>
    </Drawer>
  );
}
