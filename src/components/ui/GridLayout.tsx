import { Box } from "@mui/material";

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: { xs?: number; sm?: number; md?: number; lg?: number };
  gap?: number;
}

export function GridLayout({ children, columns = { xs: 1, md: 2 }, gap = 2 }: GridLayoutProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(${columns.xs ?? 1}, minmax(0, 1fr))`,
          sm: columns.sm ? `repeat(${columns.sm}, minmax(0, 1fr))` : undefined,
          md: columns.md ? `repeat(${columns.md}, minmax(0, 1fr))` : undefined,
          lg: columns.lg ? `repeat(${columns.lg}, minmax(0, 1fr))` : undefined,
        },
        gap,
      }}
    >
      {children}
    </Box>
  );
}
