"use client";

/**
 * Contoh penggunaan CustomToast
 * 
 * Import dan gunakan di komponen:
 * ```tsx
 * import { useToastContext } from '@/components/ui/toast-provider';
 * 
 * const { success, error, warning, info } = useToastContext();
 * 
 * // Success toast dengan expandable
 * success("Changes saved", {
 *   description: "Your changes have been saved successfully",
 *   expandable: true,
 *   duration: 13,
 *   theme: "light"
 * });
 * ```
 */

import { Button } from "./button";
import { useToastContext } from "./toast-provider";

export function ToastExamples() {
  const { success, error, warning, info } = useToastContext();

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Examples</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Success Examples */}
        <div className="space-y-2">
          <h3 className="font-semibold">Success</h3>
          <Button
            onClick={() =>
              success("Changes saved", {
                expandable: true,
                duration: 13,
                theme: "light",
                description: "Your changes have been saved successfully",
              })
            }
          >
            Success (Expandable, Light)
          </Button>
          <Button
            onClick={() =>
              success("Changes saved", {
                expandable: false,
                duration: 5,
                theme: "dark",
              })
            }
          >
            Success (Non-expandable, Dark)
          </Button>
        </div>

        {/* Error Examples */}
        <div className="space-y-2">
          <h3 className="font-semibold">Error</h3>
          <Button
            variant="destructive"
            onClick={() =>
              error("Failed to save", {
                expandable: true,
                duration: 10,
                theme: "light",
                description: "Please try again later",
              })
            }
          >
            Error (Expandable)
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              error("Failed to save", {
                expandable: false,
                duration: 5,
                theme: "dark",
              })
            }
          >
            Error (Non-expandable)
          </Button>
        </div>

        {/* Warning Examples */}
        <div className="space-y-2">
          <h3 className="font-semibold">Warning</h3>
          <Button
            variant="outline"
            onClick={() =>
              warning("Warning message", {
                expandable: true,
                duration: 8,
                theme: "light",
                description: "This action cannot be undone",
              })
            }
          >
            Warning (Expandable)
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              warning("Warning message", {
                expandable: false,
                duration: 5,
                theme: "dark",
              })
            }
          >
            Warning (Non-expandable)
          </Button>
        </div>

        {/* Info Examples */}
        <div className="space-y-2">
          <h3 className="font-semibold">Info</h3>
          <Button
            variant="outline"
            onClick={() =>
              info("Information", {
                expandable: true,
                duration: 7,
                theme: "light",
                description: "New features are available",
              })
            }
          >
            Info (Expandable)
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              info("Information", {
                expandable: false,
                duration: 0, // No auto close
                theme: "dark",
              })
            }
          >
            Info (No auto close)
          </Button>
        </div>
      </div>
    </div>
  );
}
