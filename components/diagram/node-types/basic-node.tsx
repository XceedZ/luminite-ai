"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow, NodeResizer } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface BasicNodeProps {
    id: string;
    data: { label?: string };
    selected?: boolean;
}

export const BasicNode = memo(({ id, data, selected }: BasicNodeProps) => {
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data?.label || "Node");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = useCallback(() => {
        setIsEditing(true);
        setEditValue(data?.label || "Node");
    }, [data?.label]);

    const handleSave = useCallback(() => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, label: editValue.trim() || "Node" } }
                    : node
            )
        );
        setIsEditing(false);
    }, [id, editValue, setNodes]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            setIsEditing(false);
            setEditValue(data?.label || "Node");
        }
    }, [handleSave, data?.label]);

    return (
        <div
            className={cn(
                "px-4 py-2 rounded-lg border-2 bg-card shadow-sm text-center flex items-center justify-center",
                "transition-all duration-200",
                selected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
            )}
            style={{ width: "100%", height: "100%", minWidth: "100px", minHeight: "50px" }}
            onDoubleClick={handleDoubleClick}
        >
            <NodeResizer
                color="#3b82f6"
                isVisible={selected}
                minWidth={100}
                minHeight={50}
            />
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3 !h-3 !bg-primary !border-2 !border-background"
            />
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full text-sm font-medium text-center bg-transparent border-none outline-none focus:ring-0"
                    style={{ minWidth: "80px" }}
                />
            ) : (
                <div className="text-sm font-medium text-foreground">
                    {data?.label ?? "Node"}
                </div>
            )}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3 !h-3 !bg-primary !border-2 !border-background"
            />
        </div>
    );
});

BasicNode.displayName = "BasicNode";
