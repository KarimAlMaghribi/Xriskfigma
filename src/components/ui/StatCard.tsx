import { Box, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
}

export function StatCard({ label, value, icon, color = "#353131", bgColor = "#fdfcfc" }: StatCardProps) {
  return (
    <Box
      sx={{
        border: "1px solid #e6e5e5",
        borderRadius: 2,
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: bgColor,
      }}
    >
      {icon && <Box sx={{ color }}>{icon}</Box>}
      <Box>
        <Typography sx={{ color: "#4f4a4a", fontSize: 14 }}>{label}</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: 24, color }}>{value}</Typography>
      </Box>
    </Box>
  );
}
