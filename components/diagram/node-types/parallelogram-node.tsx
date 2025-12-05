"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow, NodeResizer } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface ParallelogramNodeProps {
    id: string;
    data: { label?: string };
    selected?: boolean;
}

export const ParallelogramNode = memo(({ id, data, selected }: ParallelogramNodeProps) => {
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data?.label || "Input");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = useCallback(() => {
        setIsEditing(true);
        setEditValue(data?.label || "Input");
    }, [data?.label]);

    const handleSave = useCallback(() => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, label: editValue.trim() || "Input" } }
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
            setEditValue(data?.label || "Input");
        }
    }, [handleSave, data?.label]);

    return (
        <div
            className={cn(
                "relative flex items-center justify-center",
                "transition-all duration-200"
            )}
            style={{
                width: "100%",
                height: "100%",
                minWidth: "100px",
                minHeight: "50px",
                clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)",
            }}
            onDoubleClick={handleDoubleClick}
        >
            <NodeResizer
                color="#8b5cf6"
                isVisible={selected}
                minWidth={100}
                minHeight={50}
            />
            <div
                className={cn(
                    "absolute inset-0 bg-card border-2",
                    selected
                        ? "border-violet-500"
                        : "border-violet-500/50 hover:border-violet-500"
                )}
                style={{
                    clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)",
                }}
            />
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3 !h-3 !bg-violet-500 !border-2 !border-background"
            />
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="relative z-10 w-20 text-xs font-medium text-center bg-transparent border-none outline-none focus:ring-0"
                />
            ) : (
                <span className="relative z-10 text-xs font-medium text-foreground">
                    {data?.label ?? "Input"}
                </span>
            )}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3 !h-3 !bg-violet-500 !border-2 !border-background"
            />
        </div>
    );
});

ParallelogramNode.displayName = "ParallelogramNode";
