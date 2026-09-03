type BadgeVariant =
  | "draft"
  | "published"
  | "active"
  | "closed"
  | "correct"
  | "incorrect"
  | "blue"
  | "gray";

const styles: Record<BadgeVariant, string> = {
  draft: "bg-[#f1f5f9] text-[#64748b]",
  published: "bg-[#dbeafe] text-[#1d4ed8]",
  active: "bg-[#dcfce7] text-[#16a34a]",
  closed: "bg-[#fef2f2] text-[#dc2626]",
  correct: "bg-[#dcfce7] text-[#16a34a]",
  incorrect: "bg-[#fef2f2] text-[#dc2626]",
  blue: "bg-[#bfe3ff] text-[#1d4ed8]",
  gray: "bg-[#f1f5f9] text-[#64748b]",
};

export default function Badge({
  variant = "gray",
  children,
  className = "",
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
