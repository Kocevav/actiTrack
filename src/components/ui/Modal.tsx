// components/ui/Modal.tsx
"use client";
import React from "react";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-neutral-900/90 border border-orange-400/20 rounded-2xl shadow-2xl p-6 max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-orange-400 hover:text-orange-200 font-bold text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
