import { Box, Typography } from "@mui/material";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      <Typography sx={{ fontWeight: 800, fontSize: 20, mb: 2, color: "#353131" }}>{title}</Typography>
      {children}
    </Box>
  );
}
