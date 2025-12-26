import { Grid, Paper, Typography } from "@mui/material";
import { COLORS } from "../../lib/constants";

interface RiskInfoGridProps {
  coverageAmount?: number;
  startDate?: Date;
  duration?: number;
}

export function RiskInfoGrid({ coverageAmount, startDate, duration }: RiskInfoGridProps) {
  const formatDate = (date?: Date) => (date ? date.toLocaleDateString() : "-");

  const items = [
    {
      label: "Absicherung",
      value: coverageAmount ? `${coverageAmount.toLocaleString()} €` : "-",
    },
    {
      label: "Start",
      value: formatDate(startDate),
    },
    {
      label: "Laufzeit",
      value: duration ? `${duration} Tage` : "-",
    },
  ];

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={4} key={item.label}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: COLORS.neutral.lightGray,
              borderRadius: 2,
              border: `1px solid ${COLORS.neutral.gray}`,
            }}
          >
            <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>
              {item.label}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
              {item.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
