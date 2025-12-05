"use client";

import { useState } from "react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DiagramAIPanelProps {
    initialPrompt?: string;
    onClose: () => void;
    template: "flowchart" | "erd";
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function DiagramAIPanel({ initialPrompt, onClose, template }: DiagramAIPanelProps) {
    const [input, setInput] = useState(initialPrompt || "");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: `Hi! I'm your AI diagram assistant. I can help you create and modify ${template === "erd" ? "ERD diagrams" : "flowcharts"}.\n\nTry asking me to:\n• "Add a user authentication flow"\n• "Create tables for User, Order, and Product"\n• "Add a decision node for payment validation"`,
        },
    ]);

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        // Simulate AI response (placeholder - will be implemented later)
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `I understand you want to: "${userMessage}"\n\n🚧 AI diagram generation is coming soon! For now, you can:\n\n1. Drag nodes from the sidebar\n2. Double-click nodes to edit text\n3. Connect nodes by dragging from handles\n\nThis feature will automatically create and modify your diagram based on your description.`,
                },
            ]);
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-80 border-l bg-background flex flex-col">
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">AI Assistant</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-4">
                    {messages.map((message, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "text-sm p-3 rounded-lg whitespace-pre-wrap",
                                message.role === "user"
                                    ? "bg-primary text-primary-foreground ml-6"
                                    : "bg-muted mr-6"
                            )}
                        >
                            {message.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="bg-muted text-sm p-3 rounded-lg mr-6 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Thinking...
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t">
                <div className="flex gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe what you want to add or change..."
                        className="min-h-[60px] max-h-[120px] resize-none text-sm"
                    />
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                        Press Enter to send
                    </span>
                    <Button size="sm" onClick={handleSubmit} disabled={!input.trim() || isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
