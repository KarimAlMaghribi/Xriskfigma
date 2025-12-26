import { Avatar, Chip, Rating, Stack, Typography } from "@mui/material";
import { COLORS } from "../../lib/constants";

interface RiskHeaderSectionProps {
  riskScore: number;
  category?: string;
  title: string;
  description?: string;
  showUserInfo?: {
    avatar?: string;
    name?: string;
    rating?: number;
  };
}

export function RiskHeaderSection({
  riskScore,
  category,
  title,
  description,
  showUserInfo,
}: RiskHeaderSectionProps) {
  const riskLevel = Math.max(1, Math.min(5, Math.round(riskScore / 20)));

  return (
    <Stack spacing={2} mb={3}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {category ? (
          <Chip
            label={category}
            size="small"
            sx={{ bgcolor: COLORS.neutral.lightGray, color: COLORS.text.primary }}
          />
        ) : null}
        <Chip
          label={`Risikoscore: ${riskScore}`}
          size="small"
          sx={{ bgcolor: COLORS.brand.light, color: COLORS.brand.primary }}
        />
      </Stack>

      <div>
        <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            {description}
          </Typography>
        ) : null}
      </div>

      {showUserInfo ? (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={showUserInfo.avatar} alt={showUserInfo.name} />
          <div>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {showUserInfo.name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating value={showUserInfo.rating || 0} precision={0.5} readOnly size="small" />
              <Typography variant="caption" color="text.secondary">
                Niveau {riskLevel}
              </Typography>
            </Stack>
          </div>
        </Stack>
      ) : null}
    </Stack>
  );
}
