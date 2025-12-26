import { Box, IconButton, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface DrawerHeaderProps {
  title: string;
  onClose: () => void;
  subtitle?: string;
}

export function DrawerHeader({ title, subtitle, onClose }: DrawerHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        borderBottom: "1px solid #e6e5e5",
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#353131" }}>{title}</Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 14, color: "#4f4a4a", mt: 0.5 }}>{subtitle}</Typography>
        )}
      </Box>
      <IconButton onClick={onClose} aria-label="Drawer schließen">
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
