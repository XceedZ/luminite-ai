"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/language-provider";
import { X, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastTheme = "light" | "dark" | "system";
export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";

export interface CustomToastProps {
  id?: string;
  message: string;
  description?: string;
  type?: ToastType;
  theme?: ToastTheme;
  expandable?: boolean;
  duration?: number; // in seconds, 0 = no auto close
  position?: ToastPosition;
  onClose?: () => void;
  onStopCountdown?: () => void;
  className?: string;
}

const typeConfig = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-500",
    iconBg: "bg-green-500",
    progressColor: "bg-green-500",
    borderColor: "border-green-500/20",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-red-500",
    iconBg: "bg-red-500",
    progressColor: "bg-red-500",
    borderColor: "border-red-500/20",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500",
    progressColor: "bg-yellow-500",
    borderColor: "border-yellow-500/20",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500",
    progressColor: "bg-blue-500",
    borderColor: "border-blue-500/20",
  },
};

export function CustomToast({
  id,
  message,
  description,
  type = "success",
  theme,
  expandable = false,
  duration = 5,
  onClose,
  onStopCountdown,
  className,
}: CustomToastProps) {
  const { theme: systemTheme, resolvedTheme: systemResolvedTheme } = useTheme();
  const { t } = useLanguage();
  
  // Get theme from localStorage first (next-themes stores it as "theme")
  const getStoredTheme = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('theme');
    } catch {
      return null;
    }
  };
  
  // Auto-detect theme: priority: prop theme > localStorage > system
  let resolvedTheme: "light" | "dark" = "dark"; // Default fallback
  
  if (theme) {
    // If theme is explicitly set via prop, use it (but resolve "system" to actual theme)
    if (theme === "system") {
      resolvedTheme = (systemResolvedTheme as "light" | "dark") || "dark";
    } else {
      resolvedTheme = theme as "light" | "dark";
    }
  } else {
    // If no theme prop, check localStorage first
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      // If theme exists in localStorage, use it
      if (storedTheme === "system") {
        // If stored theme is "system", resolve to actual system theme
        resolvedTheme = (systemResolvedTheme as "light" | "dark") || "dark";
      } else if (storedTheme === "dark" || storedTheme === "light") {
        resolvedTheme = storedTheme;
      } else {
        // Fallback to system resolved theme
        resolvedTheme = (systemResolvedTheme as "light" | "dark") || "dark";
      }
    } else {
      // No theme in localStorage, use system resolved theme
      resolvedTheme = (systemResolvedTheme as "light" | "dark") || "dark";
    }
  }
  
  // Ensure resolvedTheme is always "light" or "dark" (not "system")
  if (resolvedTheme === "system") {
    resolvedTheme = systemResolvedTheme === "dark" ? "dark" : "light";
  }
  
  const [isExpanded, setIsExpanded] = useState(expandable ? false : true);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const config = typeConfig[type];
  const Icon = config.icon;

  // Countdown timer
  useEffect(() => {
    if (duration === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onClose?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration, onClose]);

  // Update progress bar
  useEffect(() => {
    if (progressRef.current && duration > 0) {
      const progress = ((duration - timeRemaining) / duration) * 100;
      progressRef.current.style.width = `${progress}%`;
    }
  }, [timeRemaining, duration]);

  const toggleExpand = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
  };

  const themeClasses = {
    light: {
      container: "bg-card text-card-foreground shadow-lg border border-border",
      message: "text-card-foreground",
      description: "text-card-foreground/80",
      closeButton: "text-card-foreground/60 hover:text-card-foreground",
      chevron: "text-card-foreground/60 hover:text-card-foreground",
      progressBg: "bg-muted",
      footer: "bg-secondary/50 border-t border-border/50",
      footerText: "text-muted-foreground",
    },
    dark: {
      container: "bg-card text-card-foreground shadow-xl border border-border",
      message: "text-card-foreground",
      description: "text-card-foreground/80",
      closeButton: "text-card-foreground/60 hover:text-card-foreground",
      chevron: "text-card-foreground/60 hover:text-card-foreground",
      progressBg: "bg-muted",
      footer: "bg-secondary/30 border-t border-border/50",
      footerText: "text-muted-foreground",
    },
  };

  const currentTheme = themeClasses[resolvedTheme];

  return (
    <div
      id={id}
      className={cn(
        "relative rounded-lg overflow-hidden w-full",
        currentTheme.container,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Main Content */}
      <div className="flex gap-2.5 p-3">
        {/* Status Icon - Always aligned with title */}
        <div className={cn("flex-shrink-0 self-start", config.iconColor)}>
          <Icon className="w-5 h-5 mt-0.5" />
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Title Row - Icon aligned here */}
          <div className="flex items-center justify-between gap-2">
            <p className={cn("font-semibold text-sm leading-tight", currentTheme.message)}>
              {message}
            </p>

            <div className="flex items-center gap-1">
              {/* Expand/Collapse Button */}
              {expandable && (
                <button
                  type="button"
                  onClick={toggleExpand}
                  className={cn(
                    "p-1 rounded-md transition-colors",
                    currentTheme.chevron
                  )}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  currentTheme.closeButton
                )}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description - Only show if expandable and expanded with smooth animation */}
          {description && expandable && (
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isExpanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
              )}
            >
              <p className={cn("text-xs leading-relaxed", currentTheme.description)}>
                {description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Countdown message with different background */}
      {duration > 0 && (
        <div className={cn("px-3 py-2", currentTheme.footer)}>
          <p className={cn("text-xs leading-tight", currentTheme.footerText)}>
            {t("toastWillCloseIn")}{" "}
            <span className="font-semibold">{timeRemaining}</span>{" "}
            {t("toastSeconds")}.
          </p>
        </div>
      )}

      {/* Progress Bar - At the very bottom of toast */}
      {duration > 0 && (
        <div className={cn("h-1 w-full", currentTheme.progressBg)}>
          <div
            ref={progressRef}
            className={cn(
              "h-full transition-all duration-1000 ease-linear",
              config.progressColor
            )}
            style={{ width: "0%" }}
          />
        </div>
      )}
    </div>
  );
}
