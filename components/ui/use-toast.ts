"use client";

import { useState, useCallback } from "react";
import type { CustomToastProps, ToastType, ToastTheme } from "./custom-toast";
import { nanoid } from "nanoid";

export interface Toast extends CustomToastProps {
  id: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (props: Omit<CustomToastProps, "id">) => {
      const id = nanoid();
      const toast: Toast = {
        id,
        ...props,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto remove after duration + 1 second buffer
      if (props.duration && props.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, (props.duration + 1) * 1000);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (
      message: string,
      options?: Omit<CustomToastProps, "message" | "type" | "id">
    ) => {
      return showToast({ ...options, message, type: "success" });
    },
    [showToast]
  );

  const error = useCallback(
    (
      message: string,
      options?: Omit<CustomToastProps, "message" | "type" | "id">
    ) => {
      return showToast({ ...options, message, type: "error" });
    },
    [showToast]
  );

  const warning = useCallback(
    (
      message: string,
      options?: Omit<CustomToastProps, "message" | "type" | "id">
    ) => {
      return showToast({ ...options, message, type: "warning" });
    },
    [showToast]
  );

  const info = useCallback(
    (
      message: string,
      options?: Omit<CustomToastProps, "message" | "type" | "id">
    ) => {
      return showToast({ ...options, message, type: "info" });
    },
    [showToast]
  );

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clear,
  };
}
