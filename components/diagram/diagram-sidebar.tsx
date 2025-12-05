"use client";

import {
    Square,
    Circle,
    Diamond,
    Table2,
    Key,
    Link2,
    StickyNote,
    Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface DiagramSidebarProps {
    template: "flowchart" | "erd";
}

const flowchartNodes = [
    {
        title: "Shapes",
        items: [
            { type: "basic", label: "Rectangle", icon: Square, description: "Process/Action" },
            { type: "circle", label: "Circle", icon: Circle, description: "Start/End" },
            { type: "diamond", label: "Diamond", icon: Diamond, description: "Decision" },
            { type: "parallelogram", label: "Parallelogram", icon: Square, description: "Input/Output" },
        ],
    },
    {
        title: "Annotations",
        items: [
            { type: "text", label: "Text", icon: Type, description: "Text label" },
            { type: "note", label: "Note", icon: StickyNote, description: "Sticky note" },
        ],
    },
];

const erdNodes = [
    {
        title: "Entities",
        items: [
            { type: "entity", label: "Entity", icon: Table2, description: "Database table" },
            { type: "weak-entity", label: "Weak Entity", icon: Table2, description: "Dependent entity" },
        ],
    },
    {
        title: "Attributes",
        items: [
            { type: "attribute", label: "Attribute", icon: Circle, description: "Column/Field" },
            { type: "primary-key", label: "Primary Key", icon: Key, description: "Unique identifier" },
            { type: "foreign-key", label: "Foreign Key", icon: Link2, description: "Reference key" },
        ],
    },
    {
        title: "Relationships",
        items: [
            { type: "relationship", label: "Relationship", icon: Diamond, description: "Entity relation" },
        ],
    },
    {
        title: "Annotations",
        items: [
            { type: "text", label: "Text", icon: Type, description: "Text label" },
            { type: "note", label: "Note", icon: StickyNote, description: "Sticky note" },
        ],
    },
];

export function DiagramSidebar({ template }: DiagramSidebarProps) {
    const categories = template === "erd" ? erdNodes : flowchartNodes;

    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.setData("application/reactflow-label", label);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside className="w-64 border-r bg-background flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-sm font-semibold text-foreground">
                    {template === "erd" ? "ERD Elements" : "Flowchart Elements"}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Drag elements to canvas
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {categories.map((category, idx) => (
                    <div key={category.title}>
                        {idx > 0 && <Separator className="mb-4" />}
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                            {category.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {category.items.map((item) => (
                                <div
                                    key={`${category.title}-${item.label}`}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, item.type, item.label)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-lg",
                                        "border border-border bg-card hover:bg-accent/50 hover:border-primary/50",
                                        "cursor-grab active:cursor-grabbing transition-all",
                                        "select-none group"
                                    )}
                                    title={item.description}
                                >
                                    <item.icon className="h-5 w-5 mb-1 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] text-muted-foreground text-center leading-tight">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* How to Connect */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs font-medium text-foreground mb-2">How to connect:</p>
                    <p className="text-xs text-muted-foreground">
                        Click and drag from the <strong>handles</strong> (dots) on a node to another node.
                    </p>
                </div>

                {/* Tips */}
                <div className="p-3 rounded-lg bg-muted/50 border border-dashed">
                    <p className="text-xs text-muted-foreground">
                        <strong>Tips:</strong>
                        <br />• Double-click node to edit text
                        <br />• Double-click canvas to add text
                        <br />• Right-click entity for menu
                    </p>
                </div>
            </div>
        </aside>
    );
}
