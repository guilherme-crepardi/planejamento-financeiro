"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }} />
      <div
        className="relative w-full sm:max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-t-[28px] sm:rounded-[24px] animate-slide-up max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--border-default)" }} />
        </div>
        <div className="flex items-center justify-between px-7 pt-6 pb-4">
          <h2 className="text-[18px] font-extrabold text-[var(--text-primary)] tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-[var(--bg-inset)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all">
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>
        <div className="px-7 pb-7">{children}</div>
      </div>
    </div>
  );
}
