"use client";

import { useState, useEffect } from "react";
import { CustomToast, type CustomToastProps, type ToastPosition } from "./custom-toast";
import { cn } from "@/lib/utils";

export interface ToastContainerProps {
  toasts: CustomToastProps[];
  position?: ToastPosition;
  onRemove?: (id?: string) => void;
}

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-0 sm:left-4",
  "top-right": "top-4 right-0 sm:right-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-0 sm:left-4",
  "bottom-right": "bottom-4 right-0 sm:right-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

const getSlideDirection = (position: ToastPosition) => {
  if (position.includes("top")) {
    return position.includes("left") 
      ? "toast-slide-in-left" 
      : position.includes("right")
      ? "toast-slide-in-right"
      : "toast-slide-in-down";
  } else {
    return position.includes("left")
      ? "toast-slide-in-left"
      : position.includes("right")
      ? "toast-slide-in-right"
      : "toast-slide-in-up";
  }
};

const getSlideOutDirection = (position: ToastPosition) => {
  if (position.includes("right")) {
    return "toast-slide-out-right";
  } else if (position.includes("left")) {
    return "toast-slide-out-left";
  } else if (position.includes("top")) {
    return "toast-slide-out-up";
  } else {
    return "toast-slide-out-down";
  }
};

export function ToastContainer({
  toasts,
  position = "top-right",
  onRemove,
}: ToastContainerProps) {
  const [exitingToasts, setExitingToasts] = useState<Set<string>>(new Set());
  const [visibleToasts, setVisibleToasts] = useState<CustomToastProps[]>([]);

  // Handle toast additions
  useEffect(() => {
    const newToasts = toasts.filter(
      (toast) => !visibleToasts.find((t) => t.id === toast.id)
    );
    if (newToasts.length > 0) {
      setVisibleToasts((prev) => [...prev, ...newToasts]);
    }
  }, [toasts, visibleToasts]);

  // Handle toast removals with animation
  useEffect(() => {
    const currentIds = new Set(toasts.map((t) => t.id));
    const toRemove = visibleToasts.filter((t) => !currentIds.has(t.id));
    
    if (toRemove.length > 0) {
      toRemove.forEach((toast) => {
        setExitingToasts((prev) => new Set([...prev, toast.id!]));
        setTimeout(() => {
          setVisibleToasts((prev) => prev.filter((t) => t.id !== toast.id));
          setExitingToasts((prev) => {
            const next = new Set(prev);
            next.delete(toast.id!);
            return next;
          });
        }, 300); // Match animation duration
      });
    }
  }, [toasts, visibleToasts]);

  if (visibleToasts.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-[9999] flex flex-col gap-2 w-full sm:max-w-sm pointer-events-none",
        // Padding for mobile: left/right positions get padding on one side only
        position.includes("left") && "pl-4 pr-0 sm:px-0",
        position.includes("right") && "pr-4 pl-0 sm:px-0",
        position.includes("center") && "px-4 sm:px-0",
        positionClasses[position]
      )}
    >
      {visibleToasts.map((toast) => {
        const isExiting = exitingToasts.has(toast.id!);
        const slideDirection = getSlideDirection(position);
        const slideOutDirection = getSlideOutDirection(position);
        
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto",
              !isExiting && slideDirection,
              isExiting && slideOutDirection
            )}
          >
            <CustomToast
              {...toast}
              onClose={() => {
                toast.onClose?.();
                onRemove?.(toast.id);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
