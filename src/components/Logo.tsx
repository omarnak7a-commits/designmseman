import logoSrc from "@/imports/Max_a_____________________.png";

type LogoVariant = "full" | "compact" | "icon";

export default function Logo({
  variant = "compact",
  className = "",
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  if (variant === "icon") {
    return (
      <img
        src={logoSrc}
        alt="Test Yourself logo"
        className={`object-contain ${className}`}
        style={{ width: 40, height: 40 }}
      />
    );
  }

  if (variant === "full") {
    return (
      <img
        src={logoSrc}
        alt="Test Yourself — Ms Eman Zahy"
        className={`object-contain ${className}`}
        style={{ maxHeight: 80 }}
      />
    );
  }

  // compact: icon + text
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoSrc}
        alt="Test Yourself logo"
        className="object-contain flex-shrink-0"
        style={{ width: 36, height: 36 }}
      />
      <div className="flex flex-col leading-tight">
        <span
          className="text-[15px] font-bold tracking-tight"
          style={{ color: "#1d4ed8", fontFamily: "var(--font-display)" }}
        >
          Test Yourself
        </span>
        <span className="text-[11px] text-[#64748b]">Ms Eman Zahy</span>
      </div>
    </div>
  );
}
