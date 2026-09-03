import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.4)" }}
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        className={[
          "relative w-full bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4",
          maxWidth,
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0f172a]">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f5f9] text-[#64748b] transition-colors"
              aria-label="Close"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  confirmVariant = "danger",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: "danger" | "primary";
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-[#64748b]">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-[#64748b] border border-[#e2e8f0] rounded-[10px] hover:bg-[#f8fafc] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={[
            "px-4 py-2 text-sm font-medium text-white rounded-[10px] transition-colors",
            confirmVariant === "danger"
              ? "bg-[#dc2626] hover:bg-[#b91c1c]"
              : "bg-[#2563eb] hover:bg-[#1d4ed8]",
          ].join(" ")}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
