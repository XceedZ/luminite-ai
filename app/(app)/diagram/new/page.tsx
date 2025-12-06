"use client";

import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Trash2, X } from "lucide-react";
import { toPng, toSvg } from "html-to-image";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    reconnectEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
    MarkerType,
    ConnectionMode,
    useReactFlow,
    ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { DiagramSidebar } from "@/components/diagram/diagram-sidebar";
import { DiagramToolbar } from "@/components/diagram/diagram-toolbar";
import { DiagramAIPanel } from "@/components/diagram/diagram-ai-panel";
import { useLanguage } from "@/components/language-provider";
import { BasicNode } from "@/components/diagram/node-types/basic-node";
import { DiamondNode } from "@/components/diagram/node-types/diamond-node";
import { CircleNode } from "@/components/diagram/node-types/circle-node";
import { EntityNode } from "@/components/diagram/node-types/entity-node";
import { ParallelogramNode } from "@/components/diagram/node-types/parallelogram-node";
import { TextNode } from "@/components/diagram/node-types/text-node";
import { NoteNode } from "@/components/diagram/node-types/note-node";
import type { DiagramGenerationResult, DiagramNode, DiagramEdge } from "@/app/store/diagram-ai-store";
import { parseMermaidCode } from "@/lib/mermaid-parser";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Register custom node types
const nodeTypes = {
    basic: BasicNode,
    diamond: DiamondNode,
    circle: CircleNode,
    entity: EntityNode,
    "weak-entity": EntityNode,
    attribute: CircleNode,
    "primary-key": CircleNode,
    "foreign-key": CircleNode,
    relationship: DiamondNode,
    parallelogram: ParallelogramNode,
    text: TextNode,
    note: NoteNode,
};

// Initial demo nodes for flowchart - User Registration Flow
const flowchartNodes: Node[] = [
    // Start node - centered at top
    {
        id: "start",
        type: "circle",
        position: { x: 350, y: 50 },
        data: { label: "Start" },
    },
    // Input step - parallelogram for I/O
    {
        id: "input",
        type: "parallelogram",
        position: { x: 300, y: 170 },
        data: { label: "Input User Details" },
    },
    // Validation process
    {
        id: "validate",
        type: "basic",
        position: { x: 300, y: 290 },
        data: { label: "Validate Data" },
    },
    // Decision point - diamond shape
    {
        id: "check",
        type: "diamond",
        position: { x: 350, y: 410 },
        data: { label: "Is Valid?" },
    },
    // Success path - left side
    {
        id: "create_account",
        type: "basic",
        position: { x: 300, y: 560 },
        data: { label: "Create Account" },
    },
    {
        id: "send_email",
        type: "basic",
        position: { x: 300, y: 680 },
        data: { label: "Send Confirmation Email" },
    },
    // Error path - right side
    {
        id: "show_error",
        type: "basic",
        position: { x: 600, y: 440 },
        data: { label: "Show Error Message" },
    },
    // End node - centered at bottom
    {
        id: "end",
        type: "circle",
        position: { x: 350, y: 800 },
        data: { label: "End" },
    },
    // Annotations - sticky notes for context
    {
        id: "note1",
        type: "note",
        position: { x: 80, y: 160 },
        data: {
            label: "User enters:\n• Email\n• Password\n• Name",
            color: "yellow"
        },
    },
    {
        id: "note2",
        type: "note",
        position: { x: 80, y: 280 },
        data: {
            label: "Check:\n• Email format\n• Password strength\n• Required fields",
            color: "blue"
        },
    },
    {
        id: "note3",
        type: "note",
        position: { x: 600, y: 560 },
        data: {
            label: "Common errors:\n• Invalid email\n• Weak password\n• Missing fields",
            color: "pink"
        },
    },
];


const flowchartEdges: Edge[] = [
    // Main flow - gray/neutral color
    {
        id: "e-start-input",
        source: "start",
        target: "input",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#71717a", strokeWidth: 2 },
    },
    {
        id: "e-input-validate",
        source: "input",
        target: "validate",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#71717a", strokeWidth: 2 }
    },
    {
        id: "e-validate-check",
        source: "validate",
        target: "check",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#71717a", strokeWidth: 2 }
    },
    // Success path - green
    {
        id: "e-check-create",
        source: "check",
        target: "create_account",
        sourceHandle: "bottom",
        type: "smoothstep",
        label: "✓ Valid",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
        style: { stroke: "#10b981", strokeWidth: 2.5 }
    },
    {
        id: "e-create-email",
        source: "create_account",
        target: "send_email",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
        style: { stroke: "#10b981", strokeWidth: 2.5 }
    },
    {
        id: "e-email-end",
        source: "send_email",
        target: "end",
        type: "smoothstep",
        label: "Success",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
        style: { stroke: "#10b981", strokeWidth: 2.5 }
    },
    // Error path - red
    {
        id: "e-check-error",
        source: "check",
        target: "show_error",
        sourceHandle: "right",
        type: "smoothstep",
        label: "✗ Invalid",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
        style: { stroke: "#ef4444", strokeWidth: 2.5 }
    },
    // Retry loop - animated dashed red
    {
        id: "e-error-input",
        source: "show_error",
        target: "input",
        type: "default",
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
        style: { stroke: "#ef4444", strokeWidth: 2 },
        label: "Retry"
    },
];

// Initial demo nodes for ERD - E-commerce Schema
const erdNodes: Node[] = [
    // Users table
    {
        id: "users",
        type: "entity",
        position: { x: 50, y: 50 },
        data: {
            label: "Users",
            color: "blue",
            fields: [
                { name: "id", type: "UUID", isPK: true },
                { name: "name", type: "VARCHAR" },
                { name: "email", type: "VARCHAR" },
                { name: "password", type: "VARCHAR" },
                { name: "created_at", type: "TIMESTAMP" },
            ]
        },
    },
    // Orders table
    {
        id: "orders",
        type: "entity",
        position: { x: 350, y: 50 },
        data: {
            label: "Orders",
            color: "purple",
            fields: [
                { name: "id", type: "UUID", isPK: true },
                { name: "user_id", type: "UUID", isFK: true },
                { name: "status", type: "VARCHAR" },
                { name: "total", type: "DECIMAL" },
                { name: "created_at", type: "TIMESTAMP" },
            ]
        },
    },
    // Products table
    {
        id: "products",
        type: "entity",
        position: { x: 650, y: 50 },
        data: {
            label: "Products",
            color: "emerald",
            fields: [
                { name: "id", type: "UUID", isPK: true },
                { name: "name", type: "VARCHAR" },
                { name: "price", type: "DECIMAL" },
                { name: "stock", type: "INT" },
                { name: "category_id", type: "UUID", isFK: true },
            ]
        },
    },
    // Order Items table
    {
        id: "order_items",
        type: "entity",
        position: { x: 350, y: 320 },
        data: {
            label: "Order Items",
            color: "orange",
            fields: [
                { name: "id", type: "UUID", isPK: true },
                { name: "order_id", type: "UUID", isFK: true },
                { name: "product_id", type: "UUID", isFK: true },
                { name: "quantity", type: "INT" },
                { name: "price", type: "DECIMAL" },
            ]
        },
    },
    // Categories table
    {
        id: "categories",
        type: "entity",
        position: { x: 650, y: 320 },
        data: {
            label: "Categories",
            color: "teal",
            fields: [
                { name: "id", type: "UUID", isPK: true },
                { name: "name", type: "VARCHAR" },
                { name: "description", type: "TEXT" },
            ]
        },
    },
    // Payments table
    {
        id: "payments",
        type: "entity",
        position: { x: 50, y: 320 },
        data: {
            label: "Payments",
            color: "pink",
            fields: [
                { name: "id", type: "UUID", isPK: true },
                { name: "order_id", type: "UUID", isFK: true },
                { name: "amount", type: "DECIMAL" },
                { name: "method", type: "VARCHAR" },
                { name: "status", type: "VARCHAR" },
            ]
        },
    },
    // Notes for ERD context
    {
        id: "note-auth",
        type: "note",
        position: { x: 50, y: -80 },
        data: {
            label: "Auth managed via Supabase Auth.\nUsers table extends basic auth.",
            color: "#dbeafe" // light blue
        },
    },
    {
        id: "note-trans",
        type: "note",
        position: { x: 600, y: -80 },
        data: {
            label: "High-volume transaction data.\nConsider partitioning Orders.",
            color: "#f3e8ff" // light purple
        },
    },
    // Relationship labels
    {
        id: "label1",
        type: "text",
        position: { x: 255, y: 85 },
        data: { label: "1:N" },
    },
    {
        id: "label2",
        type: "text",
        position: { x: 555, y: 85 },
        data: { label: "N:1" },
    },
];

const erdEdges: Edge[] = [
    // User -> Orders (1:N)
    {
        id: "e-users-orders",
        source: "users",
        sourceHandle: "right",
        target: "orders",
        targetHandle: "left",
        type: "smoothstep",
        style: { strokeWidth: 2, stroke: "#a1a1aa" }
    },
    // Order -> Order Items (1:N)
    {
        id: "e-orders-items",
        source: "orders",
        target: "order_items",
        type: "smoothstep",
        style: { strokeWidth: 2, stroke: "#a1a1aa" }
    },
    // Product -> Order Items (1:N)
    {
        id: "e-products-items",
        source: "products",
        target: "order_items",
        targetHandle: "right",
        type: "smoothstep",
        style: { strokeWidth: 2, stroke: "#a1a1aa" }
    },
    // Category -> Products (1:N)
    {
        id: "e-categories-products",
        source: "categories",
        target: "products",
        type: "smoothstep",
        style: { strokeWidth: 2, stroke: "#a1a1aa" }
    },
    // Order -> Payments (1:N)
    {
        id: "e-orders-payments",
        source: "orders",
        sourceHandle: "left",
        target: "payments",
        targetHandle: "right",
        type: "smoothstep",
        style: { strokeWidth: 2, stroke: "#a1a1aa" }
    },
];

export default function DiagramNewPage() {
    const searchParams = useSearchParams();
    const { resolvedTheme } = useTheme();
    const { t } = useLanguage();
    const template = (searchParams.get("template") as "flowchart" | "erd") || "flowchart";
    const diagramName = searchParams.get("name") || "Untitled Diagram";

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [edgeMenu, setEdgeMenu] = useState<{ id: string; x: number; y: number } | null>(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [mermaidInput, setMermaidInput] = useState("");

    // Initialize with template-specific nodes
    const initialNodes = template === "erd" ? erdNodes : flowchartNodes;
    const initialEdges = template === "erd" ? erdEdges : flowchartEdges;

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Determine ReactFlow color mode based on theme
    const colorMode = resolvedTheme === "dark" ? "dark" : "light";

    const onConnect = useCallback(
        (params: Connection) => {
            const edge = {
                ...params,
                type: "smoothstep",
                markerEnd: { type: MarkerType.ArrowClosed },
                style: {
                    stroke: colorMode === "dark" ? "#a1a1aa" : "#71717a",
                    strokeWidth: 2,
                },
            };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges, colorMode]
    );

    // Edge reconnection handler
    const onReconnect = useCallback(
        (oldEdge: Edge, newConnection: Connection) => {
            setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
        },
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData("application/reactflow");
            const label = event.dataTransfer.getData("application/reactflow-label");

            if (!type || type.startsWith("edge-")) return;

            const bounds = reactFlowWrapper.current?.getBoundingClientRect();
            if (!bounds) return;

            const position = {
                x: event.clientX - bounds.left - 60,
                y: event.clientY - bounds.top - 20,
            };

            const newNode: Node = {
                id: `node-${Date.now()}`,
                type,
                position,
                data: {
                    label: label || "New Node",
                    fields: type === "entity" ? ["id (PK)", "field1", "field2"] : undefined,
                },
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [setNodes]
    );

    // Double-click on pane (background) to add text node
    const onPaneDoubleClick = useCallback(
        (event: React.MouseEvent) => {
            // Get position relative to the wrapper
            const bounds = reactFlowWrapper.current?.getBoundingClientRect();
            if (!bounds) return;

            const position = {
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
            };

            const newNode: Node = {
                id: `text-${Date.now()}`,
                type: "text",
                position,
                data: { label: "1:N" },
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [setNodes]
    );

    // Edge context menu handler
    const onEdgeContextMenu = useCallback(
        (event: React.MouseEvent, edge: Edge) => {
            event.preventDefault();
            setEdgeMenu({
                id: edge.id,
                x: event.clientX,
                y: event.clientY,
            });
        },
        []
    );

    // Delete edge from context menu
    const deleteEdge = useCallback(() => {
        if (edgeMenu) {
            setEdges((eds) => eds.filter((e) => e.id !== edgeMenu.id));
            setEdgeMenu(null);
        }
    }, [edgeMenu, setEdges]);

    // Close context menu on pane click
    const onPaneClick = useCallback(() => {
        setEdgeMenu(null);
    }, []);

    const handleExportMermaid = useCallback(() => {
        const mermaidCode = generateMermaidCode(nodes, edges, template);
        navigator.clipboard.writeText(mermaidCode);
        alert("Mermaid code copied!\n\n" + mermaidCode);
    }, [nodes, edges, template]);

    const handleDeleteSelected = useCallback(() => {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
    }, [setNodes, setEdges]);

    const handleClear = useCallback(() => {
        if (confirm("Clear all nodes and edges?")) {
            setNodes([]);
            setEdges([]);
        }
    }, [setNodes, setEdges]);

    // Export as PNG
    const handleExportPNG = useCallback(() => {
        const viewport = document.querySelector(".react-flow__viewport") as HTMLElement;
        if (!viewport) return;

        toPng(viewport, {
            backgroundColor: colorMode === "dark" ? "#0a0a0a" : "#ffffff",
            quality: 1,
            pixelRatio: 2,
        }).then((dataUrl) => {
            const link = document.createElement("a");
            link.download = `${diagramName.replace(/\s+/g, "_")}.png`;
            link.href = dataUrl;
            link.click();
        }).catch((err) => {
            console.error("Failed to export PNG:", err);
            alert("Failed to export as PNG. Please try again.");
        });
    }, [colorMode, diagramName]);

    // Export as SVG
    const handleExportSVG = useCallback(() => {
        const viewport = document.querySelector(".react-flow__viewport") as HTMLElement;
        if (!viewport) return;

        toSvg(viewport, {
            backgroundColor: colorMode === "dark" ? "#0a0a0a" : "#ffffff",
        }).then((dataUrl) => {
            const link = document.createElement("a");
            link.download = `${diagramName.replace(/\s+/g, "_")}.svg`;
            link.href = dataUrl;
            link.click();
        }).catch((err) => {
            console.error("Failed to export SVG:", err);
            alert("Failed to export as SVG. Please try again.");
        });
    }, [colorMode, diagramName]);

    // Import Mermaid code
    const handleImportMermaid = useCallback(() => {
        if (!mermaidInput.trim()) return;

        const result = parseMermaidCode(mermaidInput);
        if (result.nodes.length === 0) {
            alert("Could not parse Mermaid code. Please check the syntax.");
            return;
        }

        setNodes(result.nodes);
        setEdges(result.edges);
        setShowImportModal(false);
        setMermaidInput("");
    }, [mermaidInput, setNodes, setEdges]);

    return (
        <div className="h-[calc(100vh-4rem)] w-full flex">
            {/* Sidebar with node palette */}
            <DiagramSidebar template={template} />

            {/* Main canvas area */}
            <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <DiagramToolbar
                    diagramName={diagramName}
                    onExportMermaid={handleExportMermaid}
                    onExportPNG={handleExportPNG}
                    onExportSVG={handleExportSVG}
                    onImportMermaid={() => setShowImportModal(true)}
                    onDelete={handleDeleteSelected}
                    onClear={handleClear}
                    onToggleAI={() => setShowAIPanel(!showAIPanel)}
                    showAI={showAIPanel}
                />

                <div className="flex-1 flex relative overflow-hidden">
                    {/* ReactFlow Canvas */}
                    <div ref={reactFlowWrapper} className="flex-1">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onReconnect={onReconnect}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onEdgeContextMenu={onEdgeContextMenu}
                            onPaneClick={onPaneClick}
                            nodeTypes={nodeTypes}
                            connectionMode={ConnectionMode.Loose}
                            colorMode={colorMode}
                            edgesReconnectable
                            fitView
                            snapToGrid
                            snapGrid={[15, 15]}
                            deleteKeyCode={["Backspace", "Delete"]}
                            defaultEdgeOptions={{
                                type: "smoothstep",
                                markerEnd: { type: MarkerType.ArrowClosed },
                                style: { stroke: colorMode === "dark" ? "#a1a1aa" : "#71717a" },
                            }}
                            proOptions={{ hideAttribution: true }}
                        >
                            <Controls />
                            <MiniMap
                                nodeColor={(node) => {
                                    const nodeData = node.data as { color?: string };
                                    if (nodeData?.color) {
                                        const colors: Record<string, string> = {
                                            emerald: "#10b981",
                                            blue: "#3b82f6",
                                            purple: "#8b5cf6",
                                            pink: "#ec4899",
                                            orange: "#f97316",
                                        };
                                        return colors[nodeData.color] || "#10b981";
                                    }
                                    if (node.type === "entity") return "#10b981";
                                    if (node.type === "diamond" || node.type === "relationship") return "#f59e0b";
                                    if (node.type === "circle") return "#10b981";
                                    return "#6366f1";
                                }}
                            />
                            <Background
                                variant={BackgroundVariant.Dots}
                                gap={20}
                                size={1.5}
                                color={colorMode === "dark" ? "#525252" : "#d4d4d4"}
                            />
                        </ReactFlow>

                        {/* Edge Context Menu */}
                        {edgeMenu && (
                            <div
                                className="fixed z-50 min-w-[180px] rounded-md border bg-popover p-1 shadow-md"
                                style={{ left: edgeMenu.x, top: edgeMenu.y }}
                            >
                                {/* Color Options */}
                                <div className="px-2 py-1.5 text-xs text-muted-foreground">{t("changeColor")}</div>
                                <div className="flex gap-1 px-2 pb-2">
                                    {[
                                        { name: "default", color: colorMode === "dark" ? "#a1a1aa" : "#71717a" },
                                        { name: "emerald", color: "#10b981" },
                                        { name: "blue", color: "#3b82f6" },
                                        { name: "purple", color: "#8b5cf6" },
                                        { name: "pink", color: "#ec4899" },
                                        { name: "orange", color: "#f97316" },
                                        { name: "red", color: "#ef4444" },
                                    ].map((c) => (
                                        <button
                                            key={c.name}
                                            onClick={() => {
                                                setEdges((eds) =>
                                                    eds.map((e) =>
                                                        e.id === edgeMenu.id
                                                            ? {
                                                                ...e,
                                                                style: {
                                                                    ...e.style,
                                                                    stroke: c.color,
                                                                    strokeWidth: e.style?.strokeWidth || 2,
                                                                },
                                                                markerEnd: {
                                                                    type: MarkerType.ArrowClosed,
                                                                    color: c.color,
                                                                    width: 20,
                                                                    height: 20,
                                                                },
                                                            }
                                                            : e
                                                    )
                                                );
                                                setEdgeMenu(null);
                                            }}
                                            className="w-5 h-5 rounded-full border border-border hover:scale-110 transition-transform"
                                            style={{ backgroundColor: c.color }}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                                <div className="h-px bg-border my-1" />
                                <button
                                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent text-destructive"
                                    onClick={deleteEdge}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {t("deleteConnection")}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* AI Panel */}
                    {showAIPanel && (
                        <DiagramAIPanel
                            onClose={() => setShowAIPanel(false)}
                            template={template}
                            currentNodes={nodes as unknown as DiagramNode[]}
                            currentEdges={edges as unknown as DiagramEdge[]}
                            onDiagramGenerated={(result: DiagramGenerationResult) => {
                                // Apply the AI-generated diagram
                                setNodes(result.nodes as unknown as Node[]);
                                setEdges(result.edges as unknown as Edge[]);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Import Mermaid Modal */}
            <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Import Mermaid Code</DialogTitle>
                        <DialogDescription>
                            Paste your Mermaid flowchart or ERD code below. Supported formats: flowchart, graph, erDiagram
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <textarea
                            value={mermaidInput}
                            onChange={(e) => setMermaidInput(e.target.value)}
                            placeholder={`flowchart TD
    A[Start] --> B{Is Valid?}
    B -->|Yes| C[Process]
    B -->|No| D[Error]
    C --> E((End))`}
                            className="w-full h-64 p-3 font-mono text-sm rounded-md border bg-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowImportModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleImportMermaid} disabled={!mermaidInput.trim()}>
                            Import
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Generate Mermaid flowchart code from nodes and edges
function generateMermaidCode(nodes: Node[], edges: Edge[], template: string): string {
    if (template === "erd") {
        const lines: string[] = ["erDiagram"];

        nodes.filter(n => n.type === "entity").forEach((node) => {
            const nodeData = node.data as { label?: string; fields?: string[] };
            const label = nodeData?.label || "Entity";
            const fields = nodeData?.fields || [];
            lines.push(`    ${label.replace(/\s/g, "_")} {`);
            fields.forEach((field: string) => {
                lines.push(`        string ${field.replace(/\s/g, "_")}`);
            });
            lines.push(`    }`);
        });

        edges.forEach((edge) => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (source?.type === "entity" && target?.type === "entity") {
                const sourceData = source.data as { label?: string };
                const targetData = target.data as { label?: string };
                const sourceLabel = (sourceData?.label || "Entity").replace(/\s/g, "_");
                const targetLabel = (targetData?.label || "Entity").replace(/\s/g, "_");
                lines.push(`    ${sourceLabel} ||--o{ ${targetLabel} : "has"`);
            }
        });

        return lines.join("\n");
    }

    // Flowchart
    const lines: string[] = ["flowchart TD"];

    nodes.forEach((node) => {
        const label = node.data?.label || "Node";
        const id = node.id.replace(/-/g, "_");
        switch (node.type) {
            case "diamond":
            case "relationship":
                lines.push(`    ${id}{${label}}`);
                break;
            case "circle":
                lines.push(`    ${id}((${label}))`);
                break;
            case "parallelogram":
                lines.push(`    ${id}[/${label}/]`);
                break;
            default:
                lines.push(`    ${id}[${label}]`);
        }
    });

    edges.forEach((edge) => {
        const sourceId = edge.source.replace(/-/g, "_");
        const targetId = edge.target.replace(/-/g, "_");
        const label = edge.label ? `|${edge.label}|` : "";
        lines.push(`    ${sourceId} -->${label} ${targetId}`);
    });

    return lines.join("\n");
}
