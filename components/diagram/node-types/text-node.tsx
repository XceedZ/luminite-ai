"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface TextNodeProps {
    id: string;
    data: { label?: string };
    selected?: boolean;
}

export const TextNode = memo(({ id, data, selected }: TextNodeProps) => {
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data?.label || "1:N");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = useCallback(() => {
        setIsEditing(true);
        setEditValue(data?.label || "1:N");
    }, [data?.label]);

    const handleSave = useCallback(() => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, label: editValue.trim() || "Text" } }
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
            setEditValue(data?.label || "1:N");
        }
    }, [handleSave, data?.label]);

    return (
        <div
            className={cn(
                "px-1 py-0.5 cursor-text select-none",
                selected && "outline outline-2 outline-primary/50 outline-offset-2 rounded"
            )}
            onDoubleClick={handleDoubleClick}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="!w-2 !h-2 !bg-muted-foreground !border-0 !opacity-0"
            />
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="text-sm bg-transparent border-none outline-none focus:ring-0 min-w-[30px] text-center"
                    style={{ width: `${Math.max(30, editValue.length * 8)}px` }}
                />
            ) : (
                <span className="text-sm text-foreground font-medium">
                    {data?.label ?? "1:N"}
                </span>
            )}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-2 !h-2 !bg-muted-foreground !border-0 !opacity-0"
            />
        </div>
    );
});

TextNode.displayName = "TextNode";
