import { Box, Grid, Typography } from "@mui/material";

interface RiskInfoGridProps {
  coverageAmount: number;
  startDate: Date;
  duration: number;
}

export function RiskInfoGrid({ coverageAmount, startDate, duration }: RiskInfoGridProps) {
  const formattedDate = new Date(startDate).toLocaleDateString("de-DE");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <InfoTile label="Versicherungssumme" value={`${coverageAmount.toLocaleString("de-DE")} €`} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <InfoTile label="Start" value={formattedDate} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <InfoTile label="Dauer" value={`${duration} Tage`} />
      </Grid>
    </Grid>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        border: "1px solid #e6e5e5",
        borderRadius: 2,
        p: 2,
        bgcolor: "#fdfcfc",
      }}
    >
      <Typography sx={{ fontSize: 13, color: "#4f4a4a", mb: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#353131" }}>{value}</Typography>
    </Box>
  );
}
