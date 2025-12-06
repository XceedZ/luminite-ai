"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { MagicCard } from "@/components/ui/magic-card";
import { useInView } from "@/hooks/use-in-view";
import { useTheme } from "next-themes";
import {
    Layers, Key, Sparkles, Bot, RefreshCw, X, ArrowUp, Wand2, Plus, Brain, Loader2, Check,
    MessageSquareText, GitBranch, Download, Code2, Workflow, Database
} from "lucide-react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import {
    ReactFlow,
    Background,
    type Node,
    type Edge,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// --- Node Components ---

// Demo Entity Node (ERD)
const DemoEntityNode = ({ data }: { data: { label: string; color: string; fields: { name: string; type: string; isPK?: boolean }[] } }) => {
    const colorConfig: Record<string, { border: string; bg: string }> = {
        emerald: { border: "border-emerald-500", bg: "bg-emerald-500/10" },
        blue: { border: "border-blue-500", bg: "bg-blue-500/10" },
        purple: { border: "border-purple-500", bg: "bg-purple-500/10" },
        orange: { border: "border-orange-500", bg: "bg-orange-500/10" },
    };
    const colors = colorConfig[data.color] || colorConfig.emerald;

    return (
        <div className={cn("min-w-[120px] rounded-md border bg-card/95 backdrop-blur-sm shadow-md overflow-hidden text-[9px]", colors.border)}>
            <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !bg-muted-foreground !border-background" />
            <div className={cn("px-2 py-1 border-b", colors.bg, "border-white/10")}>
                <div className="font-semibold text-foreground text-center">{data.label}</div>
            </div>
            <div className="px-1.5 py-0.5">
                {data.fields.map((field) => (
                    <div key={field.name} className="grid grid-cols-2 gap-0.5 px-0.5 py-px">
                        <div className="flex items-center gap-0.5">
                            {field.isPK && <Key className="h-2 w-2 text-amber-500" />}
                            <span className={cn("truncate", field.isPK ? "font-semibold text-foreground" : "text-muted-foreground")}>
                                {field.name}
                            </span>
                        </div>
                        <span className="text-muted-foreground/70 text-right font-mono">{field.type}</span>
                    </div>
                ))}
            </div>
            <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !bg-muted-foreground !border-background" />
            <Handle type="source" position={Position.Left} id="left" className="!w-1.5 !h-1.5 !bg-muted-foreground !border-background" />
            <Handle type="source" position={Position.Right} id="right" className="!w-1.5 !h-1.5 !bg-muted-foreground !border-background" />
        </div>
    );
};

// Demo Process Node (Flowchart) - Enhanced visual style
const DemoProcessNode = ({ data }: { data: { label: string; icon?: React.ElementType; type?: "start" | "process" | "decision" | "end" } }) => {
    const isStartEnd = data.type === "start" || data.type === "end";
    const isDecision = data.type === "decision";

    if (isDecision) {
        return (
            <div className="w-24 h-24 rotate-45 border-2 border-orange-500/50 bg-card/95 backdrop-blur-sm flex items-center justify-center shadow-sm relative">
                <div className="-rotate-45 text-[9px] font-medium text-center leading-tight px-1">
                    {data.label}
                </div>
                <Handle type="target" position={Position.Top} className="-rotate-45 !w-1.5 !h-1.5 !bg-muted-foreground !border-background -translate-y-1 -translate-x-1" />
                <Handle type="source" position={Position.Bottom} id="bottom" className="-rotate-45 !w-1.5 !h-1.5 !bg-muted-foreground !border-background translate-y-1 translate-x-1" />
                <Handle type="source" position={Position.Left} id="left" className="-rotate-45 !w-1.5 !h-1.5 !bg-muted-foreground !border-background -translate-x-1 translate-y-1" />
                <Handle type="source" position={Position.Right} id="right" className="-rotate-45 !w-1.5 !h-1.5 !bg-muted-foreground !border-background translate-x-1 -translate-y-1" />
            </div>
        );
    }

    return (
        <div className={cn(
            "min-w-[100px] px-3 py-2 border-2 bg-card/95 backdrop-blur-sm shadow-sm flex items-center gap-2 justify-center",
            isStartEnd ? "rounded-full border-primary/50" : "rounded-lg border-blue-500/30"
        )}>
            <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !bg-muted-foreground !border-background" />
            {data.icon && <data.icon className="h-3 w-3 text-muted-foreground" />}
            <span className="text-[10px] font-medium text-center">{data.label}</span>
            <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !bg-muted-foreground !border-background" />
        </div>
    );
};

const nodeTypes = { entity: DemoEntityNode, process: DemoProcessNode };

// --- Scenario Data ---

// Scenario 1: ERD (E-commerce)
const getInitialERD = (): { nodes: Node[], edges: Edge[] } => ({
    nodes: [
        {
            id: "users",
            type: "entity",
            position: { x: 30, y: 30 },
            data: {
                label: "Users",
                color: "emerald",
                fields: [
                    { name: "id", type: "UUID", isPK: true },
                    { name: "email", type: "VARCHAR" },
                    { name: "name", type: "VARCHAR" },
                ],
            },
        },
        {
            id: "orders",
            type: "entity",
            position: { x: 200, y: 30 },
            data: {
                label: "Orders",
                color: "blue",
                fields: [
                    { name: "id", type: "UUID", isPK: true },
                    { name: "user_id", type: "UUID" },
                    { name: "total", type: "DECIMAL" },
                ],
            },
        },
        {
            id: "products",
            type: "entity",
            position: { x: 115, y: 150 },
            data: {
                label: "Products",
                color: "purple",
                fields: [
                    { name: "id", type: "UUID", isPK: true },
                    { name: "name", type: "VARCHAR" },
                    { name: "price", type: "DECIMAL" },
                ],
            },
        },
    ],
    edges: [
        { id: "e1", source: "users", target: "orders", sourceHandle: "right", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280" } },
        { id: "e2", source: "users", target: "products", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280" } },
        { id: "e3", source: "orders", target: "products", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280" } },
    ]
});

const generatedERDNode: Node = {
    id: "reviews",
    type: "entity",
    position: { x: 300, y: 150 },
    data: {
        label: "Reviews",
        color: "orange",
        fields: [
            { name: "id", type: "UUID", isPK: true },
            { name: "product_id", type: "UUID" },
            { name: "rating", type: "INT" },
            { name: "comment", type: "TEXT" },
        ],
    },
};

const generatedERDEdges: Edge[] = [
    { id: "e4", source: "products", target: "reviews", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280" } },
    { id: "e5", source: "users", target: "reviews", sourceHandle: "right", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280" } },
];

// Scenario 2: Flowchart (Login Flow)
const getInitialFlowchart = (): { nodes: Node[], edges: Edge[] } => ({
    nodes: [
        { id: "start", type: "process", position: { x: 180, y: 0 }, data: { label: "Start", type: "start", icon: ArrowUp } },
        { id: "input", type: "process", position: { x: 150, y: 80 }, data: { label: "Input Credentials", type: "process", icon: Key } },
        { id: "validate", type: "process", position: { x: 150, y: 160 }, data: { label: "Validate?", type: "decision" } },
    ],
    edges: [
        { id: "f1", source: "start", target: "input", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280" } },
        { id: "f2", source: "input", target: "validate", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280" } },
    ]
});

const generatedFlowchartNodes: Node[] = [
    { id: "dashboard", type: "process", position: { x: 300, y: 240 }, data: { label: "Dashboard", type: "process", icon: Layers } },
    { id: "error", type: "process", position: { x: 0, y: 240 }, data: { label: "Show Error", type: "process", icon: X } },
];

const generatedFlowchartEdges: Edge[] = [
    { id: "f3", source: "validate", target: "dashboard", sourceHandle: "right", type: "smoothstep", label: "Valid", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280" } },
    { id: "f4", source: "validate", target: "error", sourceHandle: "left", type: "smoothstep", label: "Invalid", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280" } },
    { id: "f5", source: "error", target: "input", type: "smoothstep", className: "opacity-50 dashed", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6b7280", strokeDasharray: "5,5" } },
];


// Step indicator component
const DemoStepIndicator = ({
    stepId,
    status,
    text
}: {
    stepId: "analyze" | "generate";
    status: "loading" | "done" | "idle";
    text: string;
}) => {
    const getStepIcon = () => {
        if (stepId === "analyze") return <Brain className="h-3.5 w-3.5" />;
        return <Code2 className="h-3.5 w-3.5" />;
    };

    const getStatusIcon = () => {
        if (status === "loading") return <Loader2 className="h-3 w-3 animate-spin text-primary" />;
        if (status === "done") return <Check className="h-3 w-3 text-emerald-500" />;
        return null;
    };

    if (status === "idle") return null;

    return (
        <motion.div
            className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
        >
            <div
                className={cn(
                    "flex items-center gap-2 py-2 px-2.5 rounded-lg transition-all",
                    status === "loading" && "bg-primary/5 border border-primary/10",
                    status === "done" && "bg-muted/30"
                )}
            >
                <div className={cn(
                    "p-1.5 rounded-md transition-colors",
                    status === "loading"
                        ? "bg-gradient-to-br from-primary/20 to-primary/5"
                        : "bg-muted"
                )}>
                    {getStepIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    {status === "loading" ? (
                        <AnimatedShinyText className="text-[11px] font-medium" shimmerWidth={100}>
                            {text}
                        </AnimatedShinyText>
                    ) : (
                        <span className="text-[11px] font-medium text-muted-foreground">
                            {text}
                        </span>
                    )}
                </div>

                <div className="flex items-center">
                    {getStatusIcon()}
                </div>
            </div>
        </motion.div>
    );
};

// Auto-playing AI Panel Demo
const AutoPlayAIPanel = ({
    demoStep,
    hasMessages,
    scenario = "erd",
}: {
    demoStep: number;
    hasMessages: boolean;
    scenario: "erd" | "flowchart";
}) => {
    const promptText = scenario === "erd"
        ? "Add a Reviews table connected to Products"
        : "Complete the login flow with success/error paths";

    const responseText = scenario === "erd"
        ? "Done! I've added Reviews table with connections."
        : "Flowchart updated with validation paths.";

    // Demo states based on step
    const isTyping = demoStep === 0;
    const showUserMessage = demoStep >= 1;
    const analyzeStatus = demoStep === 1 ? "loading" : demoStep >= 2 ? "done" : "idle";
    const generateStatus = demoStep === 2 ? "loading" : demoStep >= 3 ? "done" : "idle";
    const showResponse = demoStep >= 4;

    // Typing animation
    const [typedText, setTypedText] = useState("");
    useEffect(() => {
        if (!isTyping) {
            setTypedText("");
            return;
        }
        let idx = 0;
        const interval = setInterval(() => {
            if (idx <= promptText.length) {
                setTypedText(promptText.slice(0, idx));
                idx++;
            } else {
                clearInterval(interval);
            }
        }, 40);
        return () => clearInterval(interval);
    }, [isTyping, promptText]);

    return (
        <motion.div
            className="flex flex-col overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 border-border/50 w-full md:w-72 h-[40%] md:h-auto border-t border-l-0 md:border-t-0 md:border-l"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Header */}
            <div className="flex-shrink-0 p-2.5 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[11px]">Lumi</h3>
                        <p className="text-[9px] text-muted-foreground">
                            {scenario === "erd" ? "ERD Designer" : "Flow Architect"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-0.5">
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                        <RefreshCw className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                        <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-2.5 space-y-2 overflow-y-auto min-h-0">
                {/* Greeting - hide when has messages */}
                <AnimatePresence>
                    {!hasMessages && (
                        <motion.div
                            className="text-center py-3"
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center mb-1.5">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <h4 className="font-semibold text-[11px] mb-0.5">Hai! Aku Lumi 👋</h4>
                            <p className="text-[9px] text-muted-foreground max-w-[180px] mx-auto">
                                Describe what you want to build and I&#39;ll create it for you.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* User message */}
                <AnimatePresence>
                    {showUserMessage && (
                        <motion.div
                            className="flex justify-end"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="max-w-[90%] rounded-xl rounded-br-sm bg-primary px-2.5 py-1.5 text-primary-foreground">
                                <p className="text-[10px]">{promptText}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Step indicators */}
                <div className="space-y-1.5">
                    <AnimatePresence>
                        {analyzeStatus !== "idle" && (
                            <DemoStepIndicator
                                stepId="analyze"
                                status={analyzeStatus as "loading" | "done"}
                                text={analyzeStatus === "done" ? "Understood!" : "Thinking..."}
                            />
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {generateStatus !== "idle" && (
                            <DemoStepIndicator
                                stepId="generate"
                                status={generateStatus as "loading" | "done"}
                                text={generateStatus === "done" ? "Done!" : "Generating diagram..."}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Response */}
                <AnimatePresence>
                    {showResponse && (
                        <motion.div
                            className="flex gap-2"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <Bot className="h-2.5 w-2.5 text-primary" />
                            </div>
                            <div className="rounded-xl rounded-tl-sm bg-muted/50 border px-2.5 py-1.5">
                                <p className="text-[10px] text-foreground">
                                    {responseText}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 rounded-lg border border-border bg-background overflow-hidden m-2.5">
                <div className="relative min-h-[32px] px-2 py-1.5">
                    {isTyping ? (
                        <div className="text-[10px] text-foreground">
                            {typedText}
                            <span className="animate-pulse text-primary">|</span>
                        </div>
                    ) : (
                        <div className="text-[10px] text-muted-foreground/50">Describe your diagram...</div>
                    )}
                </div>
                <div className="flex items-center gap-1 justify-between px-1.5 pb-1.5">
                    <div className="flex items-center gap-0.5">
                        <button className="p-1 rounded-full border border-border hover:bg-muted transition-colors">
                            <Plus className="h-2.5 w-2.5 text-muted-foreground" />
                        </button>
                        <button className="p-1 rounded-full border border-border hover:bg-muted transition-colors">
                            <Wand2 className="h-2.5 w-2.5 text-muted-foreground" />
                        </button>
                    </div>
                    <motion.button
                        className={cn(
                            "p-1 rounded-full transition-colors",
                            (typedText.length === promptText.length || demoStep > 0) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}
                        animate={typedText.length === promptText.length && demoStep === 0 ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ duration: 0.25 }}
                    >
                        <ArrowUp className="h-2.5 w-2.5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// Feature cards data with MagicCard gradient colors
const features = [
    {
        icon: MessageSquareText,
        title: "Natural Language",
        description: "Describe your diagram in plain English - no technical knowledge needed",
        iconColor: "text-blue-500",
        gradientFrom: "#3b82f6",
        gradientTo: "#06b6d4",
    },
    {
        icon: GitBranch,
        title: "Smart Connections",
        description: "AI automatically creates relationships and optimizes your schema",
        iconColor: "text-purple-500",
        gradientFrom: "#a855f7",
        gradientTo: "#ec4899",
    },
    {
        icon: Download,
        title: "Export Anywhere",
        description: "Export to PNG, SVG, or generate Mermaid code instantly",
        iconColor: "text-emerald-500",
        gradientFrom: "#10b981",
        gradientTo: "#14b8a6",
    },
];

export function CanvasShowcaseSection() {
    const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.2 });
    const { resolvedTheme } = useTheme(); // Use next-themes to sync with dark/light mode
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [demoStep, setDemoStep] = useState(-1);
    const [scenario, setScenario] = useState<"erd" | "flowchart">("erd");

    // Initialize with ERD nodes first
    const [nodes, setNodes, onNodesChange] = useNodesState(getInitialERD().nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialERD().edges);
    const [rfInstance, setRfInstance] = useState<any>(null);

    // Reset function for looping
    const resetDemo = useCallback((nextScenario: "erd" | "flowchart") => {
        setShowAIPanel(false);
        setDemoStep(-1);
        setScenario(nextScenario);

        // Load initial state for the next scenario
        const data = nextScenario === "erd" ? getInitialERD() : getInitialFlowchart();
        setNodes(data.nodes);
        setEdges(data.edges);
    }, [setNodes, setEdges]);

    // Force re-center when AI panel toggles or nodes change significantly
    useEffect(() => {
        if (rfInstance) {
            // Include a small delay to allow layout transitions to complete
            const timer = setTimeout(() => {
                rfInstance.fitView({ padding: 0.15, duration: 800 });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [rfInstance, showAIPanel, nodes.length, scenario]);

    // Auto-play demo sequence - DUAL MODE LOOP
    useEffect(() => {
        if (!isInView) return;

        const runDemoLoop = () => {
            const timers: NodeJS.Timeout[] = [];

            // Determine current scenario config
            const isERD = scenario === "erd";

            // Step 0: Show AI panel
            timers.push(setTimeout(() => {
                setShowAIPanel(true);
            }, 800));

            // Step 1: Start typing
            timers.push(setTimeout(() => {
                setDemoStep(0);
            }, 1200));

            // Step 2: User message sent, show analyze
            timers.push(setTimeout(() => {
                setDemoStep(1);
            }, 3500));

            // Step 3: Show generate
            timers.push(setTimeout(() => {
                setDemoStep(2);
            }, 4800));

            // Step 4: Done + add node
            timers.push(setTimeout(() => {
                setDemoStep(3);

                if (isERD) {
                    setNodes((nds) => [...nds, generatedERDNode]);
                    setEdges((eds) => [...eds, ...generatedERDEdges]);
                } else {
                    setNodes((nds) => [...nds, ...generatedFlowchartNodes]);
                    setEdges((eds) => [...eds, ...generatedFlowchartEdges]);
                }
            }, 6500));

            // Step 5: Show response
            timers.push(setTimeout(() => {
                setDemoStep(4);
            }, 7500));

            // Loop: Switch scenario and restart
            timers.push(setTimeout(() => {
                const nextScenario = isERD ? "flowchart" : "erd";
                resetDemo(nextScenario);
                runDemoLoop(); // Recursive call for next loop
            }, 12000));

            return timers;
        };

        const timers = runDemoLoop();

        return () => timers.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView, scenario]); // Only re-run if view changes or manual reset

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden px-4 py-32 md:px-8">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 blur-3xl rounded-full" />
            </div>

            <div className="relative mx-auto max-w-7xl z-10">
                {/* Section Header */}
                <div className="mb-16 flex flex-col items-center text-center">
                    <div
                        className={`scroll-animate pop-in mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary ${isInView ? "in-view" : ""}`}
                    >
                        <Layers className="mr-2 size-4" />
                        Canvas Editor
                    </div>
                    <h2
                        className={`scroll-animate slide-fade-up anim-delay-100 mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl ${isInView ? "in-view" : ""}`}
                    >
                        AI-Powered
                        <br />
                        <span className="text-primary">Diagram Builder</span>
                    </h2>
                    <p
                        className={`scroll-animate slide-fade-up-small anim-delay-200 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed ${isInView ? "in-view" : ""}`}
                    >
                        Design database schemas, flowcharts, and system architectures with intelligent AI assistance. Just describe what you need.
                    </p>
                </div>

                {/* Interactive Canvas Demo */}
                <div className={`scroll-animate card-fade-scale anim-delay-300 ${isInView ? "in-view" : ""}`}>
                    <div className="relative w-full h-[600px] md:h-auto md:aspect-[16/9] max-h-[800px] rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                        {/* Main Canvas Area */}
                        <div className="flex-1 relative">
                            {/* Toolbar */}
                            <div className="absolute top-0 left-0 right-0 h-10 bg-background/80 backdrop-blur-sm border-b border-border/50 flex items-center px-3 gap-2 z-10">
                                <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>
                                <div className="h-5 w-px bg-border/50 mx-1.5" />
                                <div className="flex items-center gap-2">
                                    {scenario === "erd" ? (
                                        <>
                                            <Database className="h-3.5 w-3.5 text-blue-500" />
                                            <span className="text-[10px] text-muted-foreground hidden sm:inline">E-commerce Schema</span>
                                            <span className="text-[10px] text-muted-foreground sm:hidden">ERD</span>
                                        </>
                                    ) : (
                                        <>
                                            <Workflow className="h-3.5 w-3.5 text-orange-500" />
                                            <span className="text-[10px] text-muted-foreground hidden sm:inline">Login Process Flow</span>
                                            <span className="text-[10px] text-muted-foreground sm:hidden">Flow</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex-1" />
                                <RainbowButton size="sm" className="gap-1 h-7 text-[11px] px-2.5">
                                    <Sparkles className="h-3 w-3" />
                                    <span className="hidden sm:inline">Ask AI</span>
                                    <span className="sm:hidden">AI</span>
                                </RainbowButton>
                            </div>

                            {/* React Flow Canvas */}
                            <div className="absolute inset-0 pt-10">
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onInit={setRfInstance}
                                    nodeTypes={nodeTypes}
                                    // Use next-themes resolvedTheme for dynamic dark/light mode sync
                                    colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
                                    fitView
                                    fitViewOptions={{ padding: 0.15 }}
                                    proOptions={{ hideAttribution: true }}
                                    className="bg-transparent"
                                    minZoom={0.5}
                                    maxZoom={1.5}
                                    // Disable interactions for showcase
                                    nodesDraggable={false}
                                    nodesConnectable={false}
                                    elementsSelectable={false}
                                    zoomOnScroll={false}
                                    panOnScroll={false}
                                    zoomOnPinch={false}
                                    panOnDrag={false}
                                >
                                    <Background gap={20} size={1} color="hsl(var(--muted-foreground)/0.15)" />
                                </ReactFlow>
                            </div>
                        </div>

                        {/* AI Panel - Auto-play */}
                        <AnimatePresence>
                            {showAIPanel && (
                                <AutoPlayAIPanel
                                    demoStep={demoStep}
                                    hasMessages={demoStep >= 1}
                                    scenario={scenario}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Feature highlights with MagicCard */}

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * idx }}
                            viewport={{ once: true }}
                        >
                            <MagicCard
                                className="rounded-2xl h-full"
                                gradientFrom={feature.gradientFrom}
                                gradientTo={feature.gradientTo}
                                gradientSize={250}
                                gradientOpacity={0.15}
                            >
                                <div className="p-6">
                                    {/* Icon */}
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4",
                                        "border border-border/50"
                                    )}>
                                        <feature.icon className={cn("h-6 w-6", feature.iconColor)} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            </MagicCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
