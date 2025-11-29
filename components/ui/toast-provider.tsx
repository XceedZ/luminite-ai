"use client";

import { createContext, useContext, ReactNode } from "react";
import { useToast, type Toast } from "./use-toast";
import { ToastContainer, type ToastContainerProps } from "./toast-container";
import type { ToastPosition } from "./custom-toast";

interface ToastContextValue {
  toasts: Toast[];
  showToast: (props: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  success: (
    message: string,
    options?: Omit<Toast, "message" | "type" | "id">
  ) => string;
  error: (
    message: string,
    options?: Omit<Toast, "message" | "type" | "id">
  ) => string;
  warning: (
    message: string,
    options?: Omit<Toast, "message" | "type" | "id">
  ) => string;
  info: (
    message: string,
    options?: Omit<Toast, "message" | "type" | "id">
  ) => string;
  clear: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
}

export function ToastProvider({ children, position = "top-right" }: ToastProviderProps) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer
        toasts={toast.toasts}
        position={position}
        onRemove={toast.removeToast}
      />
    </ToastContext.Provider>
  );
}
