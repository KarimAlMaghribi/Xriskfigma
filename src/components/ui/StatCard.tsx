import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  bgColor?: string;
}

export function StatCard({ label, value, icon, color = "#1f1b1b", bgColor = "#f7f7f7" }: StatCardProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-4"
      style={{ backgroundColor: bgColor }}
    >
      {icon ? (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#ffffffcc", color }}
        >
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col">
        <span className="text-sm text-[#4f4a4a]">{label}</span>
        <span className="text-xl font-semibold" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  );
}
