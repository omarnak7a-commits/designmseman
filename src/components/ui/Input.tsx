import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#0f172a]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full px-3 py-2 text-sm border rounded-[10px] bg-white text-[#0f172a] placeholder-[#94a3b8]",
          "transition-colors duration-150",
          error
            ? "border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30"
            : "border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-[#dc2626]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#64748b]">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#0f172a]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          "w-full px-3 py-2 text-sm border rounded-[10px] bg-white text-[#0f172a] placeholder-[#94a3b8] resize-none",
          "transition-colors duration-150",
          error
            ? "border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30"
            : "border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-[#dc2626]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#64748b]">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({
  label,
  error,
  id,
  className = "",
  children,
  ...props
}: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#0f172a]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={[
          "w-full px-3 py-2 text-sm border rounded-[10px] bg-white text-[#0f172a]",
          "transition-colors duration-150",
          error
            ? "border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30"
            : "border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#dc2626]">{error}</p>}
    </div>
  );
}
