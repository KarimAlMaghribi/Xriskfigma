import { Box, LinearProgress, TextField, Typography } from "@mui/material";

interface PremiumRecommendationProps {
  recommendedMin: number;
  recommendedMax: number;
  premium: string;
  onPremiumChange: (value: string) => void;
}

export function PremiumRecommendation({ recommendedMin, recommendedMax, premium, onPremiumChange }: PremiumRecommendationProps) {
  const percent = (() => {
    const value = Number(premium);
    if (!value) return 0;
    const range = recommendedMax - recommendedMin;
    if (range <= 0) return 0;
    return Math.min(100, Math.max(0, ((value - recommendedMin) / range) * 100));
  })();

  return (
    <Box sx={{ border: "1px solid #e6e5e5", borderRadius: 2, p: 2, bgcolor: "#fdfcfc" }}>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Empfohlene Prämie</Typography>
      <Typography sx={{ color: "#4f4a4a", mb: 1 }}>
        Empfehlung: {recommendedMin.toLocaleString("de-DE")} € - {recommendedMax.toLocaleString("de-DE")} €
      </Typography>
      <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 1, mb: 2 }} />
      <TextField
        label="Deine Prämie"
        fullWidth
        value={premium}
        onChange={(e) => onPremiumChange(e.target.value)}
        type="number"
        inputProps={{ min: 0, step: 10 }}
      />
    </Box>
  );
}
