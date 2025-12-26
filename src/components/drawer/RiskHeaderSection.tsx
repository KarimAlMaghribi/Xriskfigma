import { Box, Chip, Stack, Typography } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import { RiskCategory, categoryLabels } from "../../types/risk";

interface RiskHeaderSectionProps {
  riskScore: number;
  category: RiskCategory;
  title: string;
  description: string;
}

export function RiskHeaderSection({ riskScore, category, title, description }: RiskHeaderSectionProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Chip
          icon={<ShieldCheck size={16} />}
          label={`Score: ${riskScore}`}
          color="primary"
          variant="outlined"
          size="small"
        />
        <Chip label={categoryLabels[category]} size="small" />
      </Stack>
      <Typography sx={{ fontWeight: 700, fontSize: 20, color: "#353131", mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ color: "#4f4a4a", fontSize: 14 }}>{description}</Typography>
    </Box>
  );
}
