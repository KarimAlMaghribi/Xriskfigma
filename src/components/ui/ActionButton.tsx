import { Button, ButtonProps } from "@mui/material";

interface ActionButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "primary" | "outline" | "danger";
  fullWidth?: boolean;
}

export function ActionButton({
  variant = "primary",
  fullWidth,
  sx,
  children,
  ...props
}: ActionButtonProps) {
  const baseStyles = {
    textTransform: "none",
    borderRadius: 2,
    fontWeight: 600,
  };

  const variantStyles: Record<typeof variant, ButtonProps> = {
    primary: {
      variant: "contained",
      sx: {
        bgcolor: "#ff671f",
        color: "#fff",
        "&:hover": { bgcolor: "#e65b1c" },
      },
    },
    outline: {
      variant: "outlined",
      sx: {
        borderColor: "#d7d4d4",
        color: "#4f4a4a",
        bgcolor: "#fff",
        "&:hover": { borderColor: "#ff671f", color: "#ff671f", bgcolor: "#fff7f2" },
      },
    },
    danger: {
      variant: "contained",
      sx: {
        bgcolor: "#f54900",
        color: "#fff",
        "&:hover": { bgcolor: "#d63d00" },
      },
    },
  } as const;

  const chosen = variantStyles[variant];

  return (
    <Button
      {...chosen}
      {...props}
      fullWidth={fullWidth}
      sx={{ ...baseStyles, ...chosen.sx, ...sx }}
    >
      {children}
    </Button>
  );
}
