interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-[#d7d4d4] bg-white p-6 text-center text-[#4f4a4a]">
      {message}
    </div>
  );
}
