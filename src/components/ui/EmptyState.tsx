import { Box, Typography } from "@mui/material";

export function EmptyState({ message }: { message: string }) {
  return (
    <Box
      sx={{
        border: "1px dashed #e6e5e5",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        color: "#4f4a4a",
        bgcolor: "#fdfcfc",
      }}
    >
      <Typography>{message}</Typography>
    </Box>
  );
}
