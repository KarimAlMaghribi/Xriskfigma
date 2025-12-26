import { ReactNode } from "react";

interface GridLayoutProps {
  children: ReactNode;
  /** Number of columns for all breakpoints or responsive overrides */
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Tailwind gap scale value (defaults to 4) */
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10;
}

const COLUMN_CLASS_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

const GAP_CLASS_MAP: Record<GridLayoutProps['gap'], string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
};

const BREAKPOINT_PREFIX: Record<string, string> = {
  xs: "",
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
};

export function GridLayout({ children, columns = 1, gap = 4 }: GridLayoutProps) {
  const classNames = ["grid", GAP_CLASS_MAP[gap]];

  const addColumnClass = (prefix: string, count?: number) => {
    if (!count) return;
    const colClass = COLUMN_CLASS_MAP[count];
    if (colClass) {
      classNames.push(`${prefix}${colClass}`);
    }
  };

  if (typeof columns === "number") {
    addColumnClass("", columns);
  } else {
    Object.entries(columns).forEach(([key, value]) => {
      addColumnClass(BREAKPOINT_PREFIX[key] || "", value);
    });
  }

  return <div className={classNames.join(" ")}>{children}</div>;
}
