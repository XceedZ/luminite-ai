"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiAskButtonProps {
    /** Custom AI handler - receives selected text and returns AI response */
    onAiRequest?: (selectedText: string, prompt: string) => Promise<string>;
    /** Text to display on button */
    text?: string;
    /** Placeholder for the AI prompt input */
    placeholder?: string;
    /** Custom class name */
    className?: string;
}

/**
 * Custom AI Ask Button for Tiptap Editor
 * 
 * This component can be integrated with any AI backend.
 * Pass your own `onAiRequest` handler to connect with your AI service.
 * 
 * Example usage:
 * ```tsx
 * <AiAskButton 
 *   onAiRequest={async (text, prompt) => {
 *     const response = await fetch('/api/ai', {
 *       method: 'POST',
 *       body: JSON.stringify({ text, prompt })
 *     });
 *     const data = await response.json();
 *     return data.result;
 *   }}
 * />
 * ```
 */
export function AiAskButton({
    onAiRequest,
    text = "Ask AI",
    placeholder = "What would you like AI to do?",
    className,
}: AiAskButtonProps) {
    const { editor } = useCurrentEditor();
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Get selected text when popover opens
    useEffect(() => {
        if (isOpen && editor) {
            const { from, to } = editor.state.selection;
            const text = editor.state.doc.textBetween(from, to, " ");
            setSelectedText(text);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen, editor]);

    // Close popover on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSubmit = useCallback(async () => {
        if (!prompt.trim() || !onAiRequest || !editor) return;

        setIsLoading(true);
        try {
            const result = await onAiRequest(selectedText, prompt);

            // Replace selected text with AI response
            if (result && editor) {
                const { from, to } = editor.state.selection;
                editor.chain()
                    .focus()
                    .deleteRange({ from, to })
                    .insertContent(result)
                    .run();
            }

            setIsOpen(false);
            setPrompt("");
        } catch (error) {
            console.error("AI request failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, selectedText, onAiRequest, editor]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    }, [handleSubmit]);

    // Check if there's a selection
    const hasSelection = editor ? !editor.state.selection.empty : false;

    if (!hasSelection && !isOpen) {
        return null; // Hide button when no text is selected
    }

    return (
        <div className="relative inline-flex" ref={popoverRef}>
            {/* AI Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md",
                    "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
                    "hover:from-purple-600 hover:to-pink-600",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all shadow-sm",
                    className
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="h-4 w-4" />
                )}
                {text}
            </button>

            {/* AI Prompt Popover */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 w-80 p-3 rounded-lg border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95">
                    {/* Selected text preview */}
                    {selectedText && (
                        <div className="mb-3 p-2 text-xs bg-muted rounded-md max-h-20 overflow-auto">
                            <span className="text-muted-foreground">Selected: </span>
                            <span className="text-foreground">"{selectedText.slice(0, 100)}{selectedText.length > 100 ? '...' : ''}"</span>
                        </div>
                    )}

                    {/* Prompt input */}
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={isLoading}
                            className="flex-1 h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!prompt.trim() || isLoading}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {/* Quick actions */}
                    <div className="mt-3 flex flex-wrap gap-1">
                        {[
                            "Improve writing",
                            "Fix grammar",
                            "Make shorter",
                            "Make longer",
                            "Translate to English",
                        ].map((action) => (
                            <button
                                key={action}
                                onClick={() => setPrompt(action)}
                                className="px-2 py-1 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
