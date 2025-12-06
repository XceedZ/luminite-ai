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
import { useLanguage } from "@/components/language-provider";

interface DiagramSidebarProps {
    template: "flowchart" | "erd";
}

export function DiagramSidebar({ template }: DiagramSidebarProps) {
    const { t } = useLanguage();

    const flowchartNodes = [
        {
            title: t("shapes"),
            items: [
                { type: "basic", label: t("rectangle"), icon: Square, description: t("processAction") },
                { type: "circle", label: t("circle"), icon: Circle, description: t("startEnd") },
                { type: "diamond", label: t("diamond"), icon: Diamond, description: t("decision") },
                { type: "parallelogram", label: t("parallelogram"), icon: Square, description: t("inputOutput") },
            ],
        },
        {
            title: t("annotations"),
            items: [
                { type: "text", label: t("text"), icon: Type, description: t("textLabel") },
                { type: "note", label: t("note"), icon: StickyNote, description: t("stickyNote") },
            ],
        },
    ];

    const erdNodes = [
        {
            title: t("entities"),
            items: [
                { type: "entity", label: t("entity"), icon: Table2, description: t("dbTable") },
                { type: "weak-entity", label: t("weakEntity"), icon: Table2, description: t("dependentEntity") },
            ],
        },
        {
            title: t("attributes"),
            items: [
                { type: "attribute", label: t("attribute"), icon: Circle, description: t("columnField") },
                { type: "primary-key", label: t("primaryKey"), icon: Key, description: t("uniqueId") },
                { type: "foreign-key", label: t("foreignKey"), icon: Link2, description: t("refKey") },
            ],
        },
        {
            title: t("relationships"),
            items: [
                { type: "relationship", label: t("relationship"), icon: Diamond, description: t("entityRelation") },
            ],
        },
        {
            title: t("annotations"),
            items: [
                { type: "text", label: t("text"), icon: Type, description: t("textLabel") },
                { type: "note", label: t("note"), icon: StickyNote, description: t("stickyNote") },
            ],
        },
    ];

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
                    {template === "erd" ? t("erdElements") : t("flowchartElements")}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    {t("dragToCanvas")}
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
                <div className="p-3 rounded-lg bg-muted/50 border border-dashed">
                    <p className="text-xs font-medium text-foreground mb-2">{t("howToConnect")}</p>
                    <p className="text-xs text-muted-foreground">
                        {t("howToConnectDesc")}
                    </p>
                </div>

                {/* Tips */}
                <div className="p-3 rounded-lg bg-muted/50 border border-dashed">
                    <p className="text-xs text-muted-foreground">
                        <strong>{t("tips")}</strong>
                        <br />• {t("tipEditText")}
                        <br />• {t("tipAddText")}
                        <br />• {t("tipRightClick")}
                    </p>
                </div>
            </div>
        </aside>
    );
}
