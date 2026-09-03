import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] shadow-sm",
  secondary:
    "bg-[#bfe3ff] text-[#1d4ed8] hover:bg-[#93c5fd] active:bg-[#60a5fa]",
  ghost:
    "bg-transparent text-[#2563eb] hover:bg-[#eff6ff] active:bg-[#dbeafe]",
  danger:
    "bg-[#dc2626] text-white hover:bg-[#b91c1c] active:bg-[#991b1b] shadow-sm",
  outline:
    "bg-white border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc] active:bg-[#f1f5f9]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-[10px] gap-2",
  lg: "px-6 py-3 text-base rounded-[10px] gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
