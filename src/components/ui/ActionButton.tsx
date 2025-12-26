import { Button, ButtonProps } from "@mui/material";

interface ActionButtonProps extends ButtonProps {
  fullWidth?: boolean;
}

export function ActionButton({ children, variant = "contained", fullWidth = false, ...rest }: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      sx={{
        textTransform: "none",
        borderRadius: 1,
        fontWeight: 600,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
