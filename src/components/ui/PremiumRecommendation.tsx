import { Box, LinearProgress, Typography } from "@mui/material";
import { COLORS } from "../../lib/constants";

interface PremiumRecommendationProps {
  min: number;
  max: number;
  current?: number;
}

export function PremiumRecommendation({ min, max, current }: PremiumRecommendationProps) {
  const normalizedCurrent = current ? Math.min(Math.max(current, min), max) : min;
  const percentage = ((normalizedCurrent - min) / (max - min)) * 100;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${COLORS.neutral.border}`,
        bgcolor: COLORS.neutral.lightGray,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, color: COLORS.text.primary }}>
        Empfohlene Spanne: {min} € - {max} €
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 1 }}>
        Angebote in dieser Spanne haben die höchste Erfolgschance.
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "#e6e5e5",
          "& .MuiLinearProgress-bar": { backgroundColor: COLORS.brand.primary },
        }}
      />
    </Box>
  );
}
