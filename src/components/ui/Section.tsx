import { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function Section({ title, children, action }: SectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[#1f1b1b]">{title}</h2>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
