import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-[#1f1b1b]">{title}</h1>
        {description ? (
          <p className="text-sm text-[#4f4a4a]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-2 md:mt-0">{action}</div> : null}
    </div>
  );
}
