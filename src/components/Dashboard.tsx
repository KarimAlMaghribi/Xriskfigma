import { useState } from "react";
import {
  Box,
  IconButton,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  LocalOffer as OfferIcon,
  Shield as ShieldIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { communityRisks } from "../lib/community-mock-data";
import { offers as allOffers } from "../lib/offers-mock-data";
import { Risk } from "../types/risk";
import { RiskCard } from "./RiskCard";
import { CreateRiskCard } from "./CreateRiskCard";
import { DeleteRiskDialog } from "./DeleteRiskDialog";
import { StatusBadge, CustomBadge } from "./StatusBadge";
import { PageHeader } from "./ui/PageHeader";
import { Section } from "./ui/Section";
import { GridLayout } from "./ui/GridLayout";
import { StatCard } from "./ui/StatCard";
import { EmptyState } from "./ui/EmptyState";
import { toast } from "sonner@2.0.3";
import { CURRENT_USER_ID } from "../lib/current-user";

interface DashboardProps {
  newRisks?: Risk[];
  onCreateRiskClick?: () => void;
  onDeleteRisk?: (riskId: string) => void;
  onRiskDetails?: (risk: Risk, context: 'marketplace' | 'own' | 'taken') => void;
}

export function Dashboard({ 
  newRisks = [], 
  onCreateRiskClick, 
  onDeleteRisk, 
  onRiskDetails 
}: DashboardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [riskToDelete, setRiskToDelete] = useState<Risk | null>(null);

  // Angebotene Risiken vom aktuellen Nutzer
  const myOfferedRisks = [
    ...newRisks,
    ...communityRisks.filter(
      (r) =>
        (r.status === "pending" || r.status === "active" || r.status === "evaluating" || r.status === "draft") &&
        r.createdByUserId === CURRENT_USER_ID
    )
  ];

  // Abgesicherte Risiken (wo Nutzer als Taker agiert)
  const mySecuredRisks = communityRisks.filter(
    (r) => r.status === "active" && r.userRole === "taker"
  );

  const handleCreateRisk = () => {
    onCreateRiskClick?.();
  };

  const handleDeleteClick = (risk: Risk) => {
    setRiskToDelete(risk);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (riskToDelete) {
      onDeleteRisk?.(riskToDelete.id);
      toast.success(`"${riskToDelete.title}" wurde gelöscht`);
      setDeleteDialogOpen(false);
      setRiskToDelete(null);
    }
  };

  const handlePublishRisk = (risk: Risk) => {
    toast.success(`"${risk.title}" wurde veröffentlicht`, {
      description: "Dein Anliegen ist jetzt sichtbar. Menschen, die sich auskennen, können dir Angebote machen.",
      duration: 5000,
    });
    
    const riskIndex = communityRisks.findIndex(r => r.id === risk.id);
    if (riskIndex !== -1) {
      communityRisks[riskIndex].status = "evaluating";
    }
  };

  const getRiskOffers = (riskId: string) => {
    return allOffers.filter((o) => o.riskId === riskId && o.status === "pending");
  };

  // Statistiken berechnen
  const totalOffers = myOfferedRisks.reduce((sum, risk) => {
    return sum + getRiskOffers(risk.id).length;
  }, 0);

  const totalEarnings = mySecuredRisks.reduce((sum, risk) => {
    return sum + (risk.premium || 0);
  }, 0);

  const stats = [
    {
      label: "Deine Anliegen",
      value: myOfferedRisks.length,
      icon: <AssignmentIcon />,
      color: "#ff671f",
      bgColor: "#fef5f0",
    },
    {
      label: "Erhaltene Angebote",
      value: totalOffers,
      icon: <OfferIcon sx={{ fontSize: 24 }} />,
      color: "#4CAF50",
      bgColor: "#f1f8f4",
    },
    {
      label: "Du sicherst ab",
      value: mySecuredRisks.length,
      icon: <ShieldIcon />,
      color: "#2196F3",
      bgColor: "#f0f7ff",
    },
    {
      label: "Verdient",
      value: `${totalEarnings} €`,
      icon: <TrendingUpIcon />,
      color: "#9C27B0",
      bgColor: "#f8f0fa",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4, md: 6, lg: 10 } }}>
      {/* Header */}
      <PageHeader
        title="Dein Überblick"
        description="Deine Anliegen und aktive Absicherungen"
      />

      {/* Statistiken */}
      <GridLayout columns={{ xs: 2, md: 4 }} gap={3}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bgColor={stat.bgColor}
          />
        ))}
      </GridLayout>

      {/* Angebotene Risiken Section */}
      <Section title="Deine Anliegen">
        <GridLayout>
          {myOfferedRisks.map((risk) => {
            const riskOffers = getRiskOffers(risk.id);
            const cheapestOffer = riskOffers.length > 0 
              ? riskOffers.reduce((min, offer) => offer.premium < min.premium ? offer : min, riskOffers[0])
              : null;
            
            const customBadges = risk.status === "evaluating" ? (
              <StatusBadge status="evaluating" />
            ) : cheapestOffer ? (
              <CustomBadge 
                label={`Bestes Angebot: ${cheapestOffer.premium} €`}
                variant="success"
              />
            ) : riskOffers.length > 0 ? (
              <CustomBadge 
                label={`${riskOffers.length} ${riskOffers.length === 1 ? "Angebot" : "Angebote"}`}
                variant="warning"
              />
            ) : null;

            return (
              <RiskCard
                key={risk.id}
                risk={risk}
                variant="dashboard"
                onTakeRisk={() => {}}
                onDetailsClick={(r) => onRiskDetails?.(r, 'own')}
                onPublish={handlePublishRisk}
                customBadges={customBadges}
                hideUser={true}
                showDelete={true}
                onDelete={handleDeleteClick}
                showDescription={false}
                hidePrimaryAction={true}
              />
            );
          })}
          <CreateRiskCard onClick={handleCreateRisk} />
        </GridLayout>
      </Section>

      {/* Abgesicherte Risiken Section */}
      <Section title="Du sicherst ab">
        {mySecuredRisks.length === 0 ? (
          <EmptyState message="Du hast aktuell keine laufenden Absicherungen" />
        ) : (
          <GridLayout>
            {mySecuredRisks.map((risk) => {
              const daysRemaining = risk.expiresAt
                ? Math.ceil(
                    (risk.expiresAt.getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0;
              
              const customBadges = (
                <>
                  <CustomBadge 
                    label={`Noch ${daysRemaining} ${daysRemaining === 1 ? "Tag" : "Tage"}`}
                    variant="success"
                  />
                  <CustomBadge 
                    label={`+${risk.premium} € Prämie`}
                    variant="success"
                  />
                </>
              );

              return (
                <RiskCard
                  key={risk.id}
                  risk={risk}
                  variant="dashboard"
                  onTakeRisk={() => {}}
                  onDetailsClick={(r) => onRiskDetails?.(r, 'taken')}
                  customActionLabel="Laufend"
                  customActionDisabled={true}
                  customBadges={customBadges}
                  hideAction={true}
                  showDescription={false}
                />
              );
            })}
          </GridLayout>
        )}
      </Section>

      {/* Delete Risk Dialog */}
      <DeleteRiskDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        riskTitle={riskToDelete?.title || ""}
      />
    </Box>
  );
}
