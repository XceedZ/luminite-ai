"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";
import {
    ArrowUp,
    ArrowDown,
    Trash2,
    Copy,
    Scissors,
    Clipboard,
    FileCode,
    FileImage,
    FileText,
    Palette,
    Plus,
    Key,
} from "lucide-react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
    ContextMenuLabel,
} from "@/components/ui/context-menu";

interface Field {
    name: string;
    type: string;
    isPK?: boolean;
    isFK?: boolean;
}

interface EntityNodeProps {
    id: string;
    data: { label?: string; fields?: Field[]; color?: string };
    selected?: boolean;
}

const colorConfig: Record<string, {
    border: string;
    ring: string;
    hover: string;
    bg: string;
    borderB: string;
    handle: string;
    dot: string;
}> = {
    emerald: {
        border: "border-emerald-500",
        ring: "ring-emerald-500/20",
        hover: "hover:border-emerald-500/50",
        bg: "bg-emerald-500/10",
        borderB: "border-emerald-500/20",
        handle: "!bg-emerald-500",
        dot: "bg-emerald-500",
    },
    blue: {
        border: "border-blue-500",
        ring: "ring-blue-500/20",
        hover: "hover:border-blue-500/50",
        bg: "bg-blue-500/10",
        borderB: "border-blue-500/20",
        handle: "!bg-blue-500",
        dot: "bg-blue-500",
    },
    purple: {
        border: "border-purple-500",
        ring: "ring-purple-500/20",
        hover: "hover:border-purple-500/50",
        bg: "bg-purple-500/10",
        borderB: "border-purple-500/20",
        handle: "!bg-purple-500",
        dot: "bg-purple-500",
    },
    pink: {
        border: "border-pink-500",
        ring: "ring-pink-500/20",
        hover: "hover:border-pink-500/50",
        bg: "bg-pink-500/10",
        borderB: "border-pink-500/20",
        handle: "!bg-pink-500",
        dot: "bg-pink-500",
    },
    orange: {
        border: "border-orange-500",
        ring: "ring-orange-500/20",
        hover: "hover:border-orange-500/50",
        bg: "bg-orange-500/10",
        borderB: "border-orange-500/20",
        handle: "!bg-orange-500",
        dot: "bg-orange-500",
    },
    rose: {
        border: "border-rose-500",
        ring: "ring-rose-500/20",
        hover: "hover:border-rose-500/50",
        bg: "bg-rose-500/10",
        borderB: "border-rose-500/20",
        handle: "!bg-rose-500",
        dot: "bg-rose-500",
    },
    amber: {
        border: "border-amber-500",
        ring: "ring-amber-500/20",
        hover: "hover:border-amber-500/50",
        bg: "bg-amber-500/10",
        borderB: "border-amber-500/20",
        handle: "!bg-amber-500",
        dot: "bg-amber-500",
    },
    cyan: {
        border: "border-cyan-500",
        ring: "ring-cyan-500/20",
        hover: "hover:border-cyan-500/50",
        bg: "bg-cyan-500/10",
        borderB: "border-cyan-500/20",
        handle: "!bg-cyan-500",
        dot: "bg-cyan-500",
    },
    indigo: {
        border: "border-indigo-500",
        ring: "ring-indigo-500/20",
        hover: "hover:border-indigo-500/50",
        bg: "bg-indigo-500/10",
        borderB: "border-indigo-500/20",
        handle: "!bg-indigo-500",
        dot: "bg-indigo-500",
    },
    teal: {
        border: "border-teal-500",
        ring: "ring-teal-500/20",
        hover: "hover:border-teal-500/50",
        bg: "bg-teal-500/10",
        borderB: "border-teal-500/20",
        handle: "!bg-teal-500",
        dot: "bg-teal-500",
    },
    slate: {
        border: "border-slate-500",
        ring: "ring-slate-500/20",
        hover: "hover:border-slate-500/50",
        bg: "bg-slate-500/10",
        borderB: "border-slate-500/20",
        handle: "!bg-slate-500",
        dot: "bg-slate-500",
    },
    red: {
        border: "border-red-500",
        ring: "ring-red-500/20",
        hover: "hover:border-red-500/50",
        bg: "bg-red-500/10",
        borderB: "border-red-500/20",
        handle: "!bg-red-500",
        dot: "bg-red-500",
    },
};

const colorList = Object.keys(colorConfig);

export const EntityNode = memo(({ id, data, selected }: EntityNodeProps) => {
    const { setNodes } = useReactFlow();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState(data?.label || "Entity");
    const [editingField, setEditingField] = useState<{ index: number; column: "name" | "type" } | null>(null);
    const [fieldValue, setFieldValue] = useState("");
    const [clipboard, setClipboard] = useState<Field | null>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const fieldInputRef = useRef<HTMLInputElement>(null);
    const fields: Field[] = data?.fields || [];
    const color = (data?.color as keyof typeof colorConfig) || "emerald";
    const colors = colorConfig[color] || colorConfig.emerald;

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
            titleInputRef.current.select();
        }
    }, [isEditingTitle]);

    useEffect(() => {
        if (editingField !== null && fieldInputRef.current) {
            fieldInputRef.current.focus();
            fieldInputRef.current.select();
        }
    }, [editingField]);

    // Title editing
    const handleTitleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditingTitle(true);
        setTitleValue(data?.label || "Entity");
    }, [data?.label]);

    const saveTitle = useCallback(() => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, label: titleValue.trim() || "Entity" } }
                    : node
            )
        );
        setIsEditingTitle(false);
    }, [id, titleValue, setNodes]);

    const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveTitle();
        } else if (e.key === "Escape") {
            setIsEditingTitle(false);
            setTitleValue(data?.label || "Entity");
        }
    }, [saveTitle, data?.label]);

    // Field editing
    const handleFieldDoubleClick = useCallback((e: React.MouseEvent, index: number, column: "name" | "type") => {
        e.stopPropagation();
        setEditingField({ index, column });
        setFieldValue(fields[index]?.[column] || "");
    }, [fields]);

    const saveField = useCallback(() => {
        if (editingField === null) return;
        const newFields = [...fields];
        newFields[editingField.index] = {
            ...newFields[editingField.index],
            [editingField.column]: fieldValue.trim() || (editingField.column === "name" ? "field" : "VARCHAR"),
        };
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, fields: newFields } }
                    : node
            )
        );
        setEditingField(null);
        setFieldValue("");
    }, [id, editingField, fieldValue, fields, setNodes]);

    const handleFieldKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveField();
        } else if (e.key === "Escape") {
            setEditingField(null);
            setFieldValue("");
        } else if (e.key === "Tab" && editingField) {
            e.preventDefault();
            // Save current and move to next column
            saveField();
            const nextColumn = editingField.column === "name" ? "type" : "name";
            setTimeout(() => {
                setEditingField({ index: editingField.index, column: nextColumn });
                setFieldValue(fields[editingField.index]?.[nextColumn] || "");
            }, 50);
        }
    }, [saveField, editingField, fields]);

    // Context menu actions
    const addField = useCallback(() => {
        const newFields = [...fields, { name: "new_field", type: "VARCHAR" }];
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, fields: newFields } }
                    : node
            )
        );
        setTimeout(() => {
            setEditingField({ index: newFields.length - 1, column: "name" });
            setFieldValue("new_field");
        }, 50);
    }, [id, fields, setNodes]);

    const insertRowAbove = useCallback((index: number) => {
        const newFields = [...fields];
        newFields.splice(index, 0, { name: "new_field", type: "VARCHAR" });
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, fields: newFields } }
                    : node
            )
        );
        setTimeout(() => {
            setEditingField({ index, column: "name" });
            setFieldValue("new_field");
        }, 50);
    }, [id, fields, setNodes]);

    const insertRowBelow = useCallback((index: number) => {
        const newFields = [...fields];
        newFields.splice(index + 1, 0, { name: "new_field", type: "VARCHAR" });
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, fields: newFields } }
                    : node
            )
        );
        setTimeout(() => {
            setEditingField({ index: index + 1, column: "name" });
            setFieldValue("new_field");
        }, 50);
    }, [id, fields, setNodes]);

    const deleteRow = useCallback((index: number) => {
        const newFields = fields.filter((_, i) => i !== index);
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, fields: newFields } }
                    : node
            )
        );
    }, [id, fields, setNodes]);

    const togglePK = useCallback((index: number) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], isPK: !newFields[index].isPK };
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, fields: newFields } }
                    : node
            )
        );
    }, [id, fields, setNodes]);

    const copyRow = useCallback((index: number) => {
        setClipboard(fields[index]);
    }, [fields]);

    const cutRow = useCallback((index: number) => {
        setClipboard(fields[index]);
        deleteRow(index);
    }, [fields, deleteRow]);

    const pasteRow = useCallback((index: number) => {
        if (!clipboard) return;
        const newFields = [...fields];
        newFields.splice(index + 1, 0, { ...clipboard });
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, fields: newFields } }
                    : node
            )
        );
    }, [id, fields, clipboard, setNodes]);

    // Change color
    const changeColor = useCallback((newColor: string) => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, color: newColor } }
                    : node
            )
        );
    }, [id, setNodes]);

    // Export handlers
    const exportToMermaid = useCallback(() => {
        const mermaid = `erDiagram\n    ${(data?.label || "Entity").replace(/\s/g, "_")} {\n${fields.map(f => `        ${f.type} ${f.name}${f.isPK ? " PK" : ""}${f.isFK ? " FK" : ""}`).join("\n")}\n    }`;
        navigator.clipboard.writeText(mermaid);
        alert("Mermaid code copied!\n\n" + mermaid);
    }, [data?.label, fields]);

    // Unified context menu content
    const renderContextMenu = (fieldIndex?: number) => (
        <ContextMenuContent className="w-56">
            {/* Field operations - only show if right-clicked on a field */}
            {fieldIndex !== undefined && (
                <>
                    <ContextMenuLabel>Field Actions</ContextMenuLabel>
                    <ContextMenuItem onClick={() => togglePK(fieldIndex)}>
                        <Key className="h-4 w-4 mr-2" />
                        {fields[fieldIndex]?.isPK ? "Remove Primary Key" : "Set as Primary Key"}
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => insertRowAbove(fieldIndex)}>
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Insert Row Above
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertRowBelow(fieldIndex)}>
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Insert Row Below
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => copyRow(fieldIndex)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                        <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => cutRow(fieldIndex)}>
                        <Scissors className="h-4 w-4 mr-2" />
                        Cut
                        <ContextMenuShortcut>⌘X</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => pasteRow(fieldIndex)} disabled={!clipboard}>
                        <Clipboard className="h-4 w-4 mr-2" />
                        Paste
                        <ContextMenuShortcut>⌘V</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem variant="destructive" onClick={() => deleteRow(fieldIndex)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Row
                        <ContextMenuShortcut>⌫</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                </>
            )}

            {/* Entity operations - always show */}
            <ContextMenuItem onClick={addField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    <Palette className="h-4 w-4 mr-2" />
                    Change Color
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48 grid grid-cols-4 gap-1 p-2">
                    {colorList.map((c) => (
                        <button
                            key={c}
                            onClick={() => changeColor(c)}
                            className={cn(
                                "w-6 h-6 rounded-full transition-transform hover:scale-110",
                                colorConfig[c].dot,
                                color === c && "ring-2 ring-offset-2 ring-foreground"
                            )}
                            title={c.charAt(0).toUpperCase() + c.slice(1)}
                        />
                    ))}
                </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSeparator />

            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                    <ContextMenuItem onClick={exportToMermaid}>
                        <FileCode className="h-4 w-4 mr-2" />
                        Mermaid Code
                    </ContextMenuItem>
                    <ContextMenuItem disabled>
                        <FileImage className="h-4 w-4 mr-2" />
                        PNG Image
                    </ContextMenuItem>
                    <ContextMenuItem disabled>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF Document
                    </ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>
        </ContextMenuContent>
    );

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    className={cn(
                        "min-w-[220px] rounded-lg border-2 bg-card shadow-sm overflow-hidden",
                        "transition-all duration-200",
                        selected
                            ? `${colors.border} ring-2 ${colors.ring}`
                            : `border-border ${colors.hover}`
                    )}
                >
                    <Handle
                        type="target"
                        position={Position.Top}
                        className={cn("!w-3 !h-3 !border-2 !border-background", colors.handle)}
                    />

                    {/* Header */}
                    <div
                        className={cn("px-3 py-2 border-b cursor-text", colors.bg, colors.borderB)}
                        onDoubleClick={handleTitleDoubleClick}
                    >
                        {isEditingTitle ? (
                            <input
                                ref={titleInputRef}
                                type="text"
                                value={titleValue}
                                onChange={(e) => setTitleValue(e.target.value)}
                                onBlur={saveTitle}
                                onKeyDown={handleTitleKeyDown}
                                className="w-full text-sm font-semibold text-center bg-transparent border-none outline-none focus:ring-0"
                            />
                        ) : (
                            <div className="text-sm font-semibold text-foreground text-center">
                                {data?.label ?? "Entity"}
                            </div>
                        )}
                    </div>

                    {/* Fields Table */}
                    <div className="px-1 py-1">
                        {fields.map((field, idx) => (
                            <ContextMenu key={idx}>
                                <ContextMenuTrigger asChild>
                                    <div className="grid grid-cols-2 gap-1 px-1 py-0.5 rounded hover:bg-muted/50 transition-colors group">
                                        {/* Field Name */}
                                        <div className="flex items-center gap-1">
                                            {field.isPK && (
                                                <Key className="h-3 w-3 text-amber-500 flex-shrink-0" />
                                            )}
                                            {editingField?.index === idx && editingField?.column === "name" ? (
                                                <input
                                                    ref={fieldInputRef}
                                                    type="text"
                                                    value={fieldValue}
                                                    onChange={(e) => setFieldValue(e.target.value)}
                                                    onBlur={saveField}
                                                    onKeyDown={handleFieldKeyDown}
                                                    className="w-full text-xs bg-transparent border-none outline-none focus:ring-0"
                                                />
                                            ) : (
                                                <span
                                                    className={cn(
                                                        "text-xs cursor-text truncate",
                                                        field.isPK ? "font-semibold text-foreground" : "text-muted-foreground"
                                                    )}
                                                    onDoubleClick={(e) => handleFieldDoubleClick(e, idx, "name")}
                                                >
                                                    {field.name}
                                                </span>
                                            )}
                                        </div>
                                        {/* Field Type */}
                                        <div>
                                            {editingField?.index === idx && editingField?.column === "type" ? (
                                                <input
                                                    ref={fieldInputRef}
                                                    type="text"
                                                    value={fieldValue}
                                                    onChange={(e) => setFieldValue(e.target.value)}
                                                    onBlur={saveField}
                                                    onKeyDown={handleFieldKeyDown}
                                                    className="w-full text-xs bg-transparent border-none outline-none focus:ring-0 text-right"
                                                />
                                            ) : (
                                                <span
                                                    className="text-xs text-muted-foreground/70 cursor-text block text-right font-mono"
                                                    onDoubleClick={(e) => handleFieldDoubleClick(e, idx, "type")}
                                                >
                                                    {field.type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </ContextMenuTrigger>
                                {renderContextMenu(idx)}
                            </ContextMenu>
                        ))}

                        {fields.length === 0 && (
                            <div className="px-2 py-1 text-xs text-muted-foreground italic text-center">
                                Right-click to add field
                            </div>
                        )}
                    </div>

                    <Handle
                        type="source"
                        position={Position.Bottom}
                        className={cn("!w-3 !h-3 !border-2 !border-background", colors.handle)}
                    />
                    <Handle
                        type="source"
                        position={Position.Left}
                        id="left"
                        className={cn("!w-3 !h-3 !border-2 !border-background", colors.handle)}
                    />
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="right"
                        className={cn("!w-3 !h-3 !border-2 !border-background", colors.handle)}
                    />
                </div>
            </ContextMenuTrigger>
            {renderContextMenu()}
        </ContextMenu>
    );
});

EntityNode.displayName = "EntityNode";
