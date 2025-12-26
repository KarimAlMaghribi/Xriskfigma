import { Box, IconButton, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface DrawerHeaderProps {
  title: string;
  onClose: () => void;
}

export function DrawerHeader({ title, onClose }: DrawerHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 3,
        borderBottom: "1px solid #e6e5e5",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <IconButton onClick={onClose} aria-label="Schließen">
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
