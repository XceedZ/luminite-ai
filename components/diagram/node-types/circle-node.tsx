"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow, NodeResizer } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface CircleNodeProps {
    id: string;
    data: { label?: string };
    selected?: boolean;
}

export const CircleNode = memo(({ id, data, selected }: CircleNodeProps) => {
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
                "rounded-full border-2 bg-card shadow-sm flex items-center justify-center",
                "transition-all duration-200",
                selected
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : "border-emerald-500/50 hover:border-emerald-500"
            )}
            style={{ width: "100%", height: "100%", minWidth: "50px", minHeight: "50px" }}
            onDoubleClick={handleDoubleClick}
        >
            <NodeResizer
                color="#10b981"
                isVisible={selected}
                minWidth={50}
                minHeight={50}
                keepAspectRatio
            />
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-background"
            />
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-16 text-xs font-medium text-center bg-transparent border-none outline-none focus:ring-0"
                />
            ) : (
                <span className="text-xs font-medium text-foreground text-center px-1">
                    {data?.label ?? "Node"}
                </span>
            )}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-background"
            />
        </div>
    );
});

CircleNode.displayName = "CircleNode";
