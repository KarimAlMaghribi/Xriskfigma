interface LandingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

export function LandingButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
}: LandingButtonProps) {
  const baseStyles =
    "px-6 py-3 rounded-[100px] cursor-pointer border-none whitespace-nowrap";
  const transitionStyles = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

  const variantStyles = {
    primary:
      "bg-brand text-white shadow-brand-sm hover:bg-brand-hover hover:shadow-brand-md hover:scale-105 active:scale-[0.98]",
    secondary:
      "bg-surface-frost backdrop-blur-lg text-primary shadow-sm hover:bg-surface-frost-hover hover:shadow-md",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`button-text ${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ transition: transitionStyles }}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
