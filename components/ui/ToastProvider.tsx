"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastItem = { id: string; title?: string; description?: string; variant?: "default" | "destructive" };
type AddToastFn = (t: Omit<ToastItem, "id">) => void;

const ToastContext = createContext<{ toast: AddToastFn } | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = (t: Omit<ToastItem, "id">) => {
    const id = Date.now().toString();
    setToasts((s) => [...s, { id, ...t }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4500);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-xs p-3 rounded-lg shadow-lg ${
              t.variant === "destructive" ? "bg-red-600 text-white" : "bg-white text-black"
            }`}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm opacity-90 mt-1">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
