import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-[#0f172a]">{title}</p>
        {description && (
          <p className="text-sm text-[#64748b] max-w-xs">{description}</p>
        )}
      </div>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
