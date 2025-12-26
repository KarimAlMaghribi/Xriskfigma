import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, description, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: 24, color: "#353131" }}>{title}</Typography>
        {(subtitle || description) && (
          <Typography sx={{ color: "#4f4a4a", mt: 0.5, fontSize: 14 }}>
            {subtitle || description}
          </Typography>
        )}
      </Box>
      {actions}
    </Box>
  );
}
