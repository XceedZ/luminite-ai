"use client";

import { useEffect, useRef, useState } from "react";
import {
    Sparkles,
    Send,
    X,
    Loader2,
    RefreshCw,
    Plus,
    Brain,
    Code2,
    Check,
    ChevronDown,
    Bot,
    Wand2,
    Square,
    ArrowUp
} from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";
import {
    useDiagramAIStore,
    type DiagramNode,
    type DiagramEdge,
    type DiagramGenerationResult,
    type AIStep
} from "@/app/store/diagram-ai-store";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/components/language-provider";
import { enhancePromptDiagram } from "@/lib/actions/ai";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group";

interface DiagramAIPanelProps {
    onClose: () => void;
    template: "flowchart" | "erd";
    currentNodes: DiagramNode[];
    currentEdges: DiagramEdge[];
    onDiagramGenerated: (result: DiagramGenerationResult) => void;
}

// Step indicator component with shiny animation
const StepIndicator = ({ step, t }: { step: AIStep; t: (key: string) => string }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusIcon = () => {
        if (step.status === 'loading') {
            return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />;
        }
        if (step.status === 'done') {
            return <Check className="h-3.5 w-3.5 text-emerald-500" />;
        }
        return <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/30" />;
    };

    const getStepIcon = () => {
        if (step.id === 'analyze') {
            return <Brain className="h-4 w-4" />;
        }
        if (step.id === 'generate') {
            return <Code2 className="h-4 w-4" />;
        }
        return <Bot className="h-4 w-4" />;
    };

    const getStepText = () => {
        if (step.id === 'analyze') {
            return step.status === 'done' ? t("understood") : t("thinking");
        }
        if (step.id === 'generate') {
            return step.status === 'done' ? 'Done!' : t("generatingDiagram");
        }
        return step.text;
    };

    return (
        <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
            <div
                className={cn(
                    "flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all",
                    step.status === 'loading' && "bg-primary/5 border border-primary/10",
                    step.status === 'done' && "bg-muted/30",
                    step.response && "cursor-pointer hover:bg-muted/50"
                )}
                onClick={() => step.response && setIsExpanded(!isExpanded)}
            >
                <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    step.status === 'loading'
                        ? "bg-gradient-to-br from-primary/20 to-primary/5"
                        : "bg-muted"
                )}>
                    {getStepIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    {step.status === 'loading' ? (
                        <AnimatedShinyText className="text-sm font-medium" shimmerWidth={120}>
                            {getStepText()}
                        </AnimatedShinyText>
                    ) : (
                        <span className={cn(
                            "text-sm font-medium",
                            step.status === 'done' ? "text-muted-foreground" : "text-foreground"
                        )}>
                            {getStepText()}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    {step.response && (
                        <ChevronDown className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform duration-200",
                            isExpanded && "rotate-180"
                        )} />
                    )}
                    {getStatusIcon()}
                </div>
            </div>

            {isExpanded && step.response && (
                <div className="ml-12 mt-1.5 p-3 rounded-lg bg-muted/20 border border-border/50 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.response}</p>
                </div>
            )}
        </div>
    );
};

// Message bubble component
const MessageBubble = ({
    role,
    content,
    showOptions,
    recommendation,
    onSelectMode,
    isLoading,
    t
}: {
    role: 'user' | 'assistant';
    content: string;
    showOptions?: boolean;
    recommendation?: 'replace' | 'add';
    onSelectMode?: (mode: 'replace' | 'add') => void;
    isLoading?: boolean;
    t: (key: string) => string;
}) => {
    if (role === 'user') {
        return (
            <div className="flex justify-end animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-sm">
                    <p className="text-sm">{content}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
            <div className="flex gap-2.5">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="rounded-2xl rounded-tl-sm bg-muted/50 border px-4 py-3">
                        <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="text-sm text-foreground mb-2 last:mb-0">{children}</p>,
                                    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                    li: ({ children }) => <li className="text-sm text-foreground">{children}</li>,
                                    code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {showOptions && !isLoading && onSelectMode && (
                        <div className="flex gap-2 mt-2">
                            <Button
                                size="sm"
                                variant={recommendation === 'replace' ? 'default' : 'outline'}
                                className="flex-1 gap-1.5 h-9"
                                onClick={() => onSelectMode('replace')}
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                {t("replaceAll")}
                            </Button>
                            <Button
                                size="sm"
                                variant={recommendation === 'add' ? 'default' : 'outline'}
                                className="flex-1 gap-1.5 h-9"
                                onClick={() => onSelectMode('add')}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                {t("addImprove")}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export function DiagramAIPanel({
    onClose,
    template,
    currentNodes,
    currentEdges,
    onDiagramGenerated
}: DiagramAIPanelProps) {
    const [input, setInput] = useState("");
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useLanguage();

    const {
        messages,
        steps,
        isLoading,
        pendingPrompt,
        analyze,
        generate,
        clearMessages
    } = useDiagramAIStore();

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages, steps, isLoading]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userPrompt = input.trim();
        setInput("");
        setAttachedImage(null);

        const analysis = await analyze(
            userPrompt,
            template,
            currentNodes,
            currentEdges
        );

        if (analysis?.intent === 'chat') {
            return;
        }

        if (analysis && !analysis.suggestOptions) {
            const result = await generate(
                userPrompt,
                template,
                analysis.recommendation,
                analysis.recommendation === 'add' ? currentNodes : undefined,
                analysis.recommendation === 'add' ? currentEdges : undefined
            );
            if (result) {
                onDiagramGenerated(result);
            }
        }
    };

    const handleSelectMode = async (mode: 'replace' | 'add') => {
        if (!pendingPrompt) return;

        const result = await generate(
            pendingPrompt,
            template,
            mode,
            mode === 'add' ? currentNodes : undefined,
            mode === 'add' ? currentEdges : undefined
        );

        if (result) {
            onDiagramGenerated(result);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handlePlusClick = () => fileInputRef.current?.click();

    const handleEnhancePrompt = async () => {
        if (!input.trim() || isEnhancing) return;

        setIsEnhancing(true);
        try {
            const enhanced = await enhancePromptDiagram(input, template);
            setInput(enhanced);
        } catch (error) {
            console.error("Failed to enhance prompt:", error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const stopGeneration = () => {
        // Placeholder for stop functionality
    };

    const showGreeting = messages.length === 0;

    return (
        <div className="w-96 h-full border-l bg-gradient-to-b from-background via-background to-muted/20 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                        <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Lumi</h3>
                        <p className="text-xs text-muted-foreground">
                            {template === 'erd' ? 'ERD Designer' : 'Flowchart Designer'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => clearMessages()}
                        title={t("clearChat")}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content - scrollable */}
            <div
                ref={scrollContainerRef}
                className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
            >
                {showGreeting && (
                    <div className="text-center py-8 animate-in fade-in-0 duration-500">
                        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center mb-4 shadow-sm">
                            <Bot className="h-7 w-7 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-2">Hai! Aku Lumi 👋</h4>
                        <p className="text-sm text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
                            {t("diagramAIGreeting")}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2 justify-center">
                            {template === 'erd' ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs rounded-full"
                                        onClick={() => setInput(t("explainERD"))}
                                    >
                                        {t("explainERDBtn")}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs rounded-full"
                                        onClick={() => setInput(t("createEcommerce"))}
                                    >
                                        {t("ecommerceSchema")}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs rounded-full"
                                        onClick={() => setInput(t("explainFlow"))}
                                    >
                                        {t("explainFlowBtn")}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs rounded-full"
                                        onClick={() => setInput(t("createLoginFlow"))}
                                    >
                                        {t("loginFlowBtn")}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {messages.map((message, idx) => (
                    <MessageBubble
                        key={idx}
                        role={message.role}
                        content={message.content}
                        showOptions={message.showOptions}
                        recommendation={message.recommendation}
                        onSelectMode={handleSelectMode}
                        isLoading={isLoading}
                        t={t}
                    />
                ))}

                {steps.length > 0 && (
                    <div className="space-y-2">
                        {steps.map((step) => (
                            <StepIndicator key={step.id} step={step} t={t} />
                        ))}
                    </div>
                )}
            </div>

            {/* Input - matches quick-create design */}
            <div className="flex-shrink-0 px-4 pb-4">
                {/* Attached Image Preview */}
                {attachedImage && (
                    <div className="mb-2 relative inline-block">
                        <img src={attachedImage} alt="Attached" className="h-16 rounded-lg border" />
                        <Button
                            size="icon"
                            variant="destructive"
                            className="h-5 w-5 absolute -top-2 -right-2 rounded-full"
                            onClick={() => setAttachedImage(null)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />

                <form onSubmit={handleSubmit}>
                    <InputGroup className="rounded-xl">
                        <InputGroupTextarea
                            placeholder={t("diagramAIPlaceholder")}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            className="max-h-[8rem] resize-none rounded-xl"
                        />
                        <InputGroupAddon align="block-end">
                            <InputGroupButton
                                type="button"
                                variant="outline"
                                className="rounded-full"
                                size="icon-xs"
                                onClick={handlePlusClick}
                            >
                                <IconPlus />
                            </InputGroupButton>
                            <InputGroupButton
                                type="button"
                                variant="ghost"
                                className="rounded-full"
                                size="icon-xs"
                                onClick={handleEnhancePrompt}
                                disabled={!input.trim() || isEnhancing}
                                title={t("enhancePrompt")}
                            >
                                {isEnhancing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="h-4 w-4" />
                                )}
                            </InputGroupButton>
                            <div className="flex-1" />
                            {isLoading ? (
                                <InputGroupButton
                                    type="button"
                                    variant="secondary"
                                    className="rounded-full"
                                    size="icon-xs"
                                    onClick={stopGeneration}
                                    aria-label="Stop"
                                >
                                    <Square className="h-4 w-4" />
                                </InputGroupButton>
                            ) : (
                                <InputGroupButton
                                    type="submit"
                                    variant="default"
                                    className="rounded-full"
                                    size="icon-xs"
                                    disabled={!input.trim()}
                                    aria-label="Send"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </InputGroupButton>
                            )}
                        </InputGroupAddon>
                    </InputGroup>
                </form>
            </div>
        </div>
    );
}
