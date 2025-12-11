import { Box } from "@mui/material";
import { Risk } from "../types/risk";
import { UserAvatarWithRating } from "./ui/UserAvatarWithRating";
import { users } from "../lib/user-mock-data";
import { COLORS } from "../lib/constants";

interface RiskCardListProps {
  risk: Risk;
  onTakeRisk: (risk: Risk) => void;
  onDetailsClick: (risk: Risk) => void;
}

/**
 * List view variant of RiskCard
 * Used in marketplace and design system
 */
export function RiskCardList({
  risk,
  onTakeRisk,
  onDetailsClick,
}: RiskCardListProps) {
  const user = users[risk.createdByUserId];

  return (
    <Box
      onClick={() => onDetailsClick(risk)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        bgcolor: COLORS.neutral.white,
        border: `1px solid ${COLORS.neutral.border}`,
        borderRadius: 1,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: COLORS.brand.primary,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      {/* Left: User Info + Title */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ mb: 1 }}>
          <UserAvatarWithRating
            avatar={user?.avatar}
            name={risk.createdBy}
            rating={user?.rating || 0}
            size="small"
          />
        </Box>
        <h4
          className="heading-4"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {risk.title}
        </h4>
      </Box>

      {/* Right: Premium */}
      <Box sx={{ textAlign: "right", ml: 2 }}>
        <span className="body-xs text-secondary">Prämie</span>
        <div>
          <span className="text-lg-semibold text-brand">{risk.premium} €</span>
        </div>
      </Box>
    </Box>
  );
}
