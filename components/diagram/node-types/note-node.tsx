"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface NoteNodeProps {
    id: string;
    data: { label?: string; color?: string };
    selected?: boolean;
}

const noteColors = {
    yellow: "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700",
    blue: "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
    green: "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700",
    pink: "bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-700",
    purple: "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700",
};

export const NoteNode = memo(({ id, data, selected }: NoteNodeProps) => {
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data?.label || "Note");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const color = (data?.color as keyof typeof noteColors) || "yellow";

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = useCallback(() => {
        setIsEditing(true);
        setEditValue(data?.label || "Note");
    }, [data?.label]);

    const handleSave = useCallback(() => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, label: editValue.trim() || "Note" } }
                    : node
            )
        );
        setIsEditing(false);
    }, [id, editValue, setNodes]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsEditing(false);
            setEditValue(data?.label || "Note");
        }
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
    }, [handleSave, data?.label]);

    return (
        <div
            className={cn(
                "min-w-[150px] min-h-[80px] p-3 rounded-sm border-2 shadow-md",
                "transition-all duration-200",
                noteColors[color],
                selected && "ring-2 ring-primary/30"
            )}
            style={{
                transform: "rotate(-1deg)",
            }}
            onDoubleClick={handleDoubleClick}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="!w-2 !h-2 !bg-amber-500 !border-2 !border-background !opacity-0 hover:!opacity-100"
            />
            {isEditing ? (
                <textarea
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full min-h-[60px] text-sm bg-transparent border-none outline-none focus:ring-0 resize-none"
                    placeholder="Enter note..."
                />
            ) : (
                <div className="text-sm text-foreground whitespace-pre-wrap font-handwriting">
                    {data?.label ?? "Double-click to edit"}
                </div>
            )}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-2 !h-2 !bg-amber-500 !border-2 !border-background !opacity-0 hover:!opacity-100"
            />
        </div>
    );
});

NoteNode.displayName = "NoteNode";
