"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow, NodeResizer } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface DiamondNodeProps {
    id: string;
    data: { label?: string };
    selected?: boolean;
}

export const DiamondNode = memo(({ id, data, selected }: DiamondNodeProps) => {
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
            className="relative flex items-center justify-center"
            style={{ width: "100%", height: "100%", minWidth: "80px", minHeight: "80px" }}
            onDoubleClick={handleDoubleClick}
        >
            <NodeResizer
                color="#f59e0b"
                isVisible={selected}
                minWidth={80}
                minHeight={80}
            />

            {/* Diamond shape using clip-path */}
            <div
                className={cn(
                    "absolute inset-0 bg-card",
                    "transition-all duration-200",
                    selected
                        ? "bg-amber-500/10"
                        : "hover:bg-amber-500/5"
                )}
                style={{
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
            />

            {/* Border (clip-path doesn't support border, so we simulate it or use SVG, but for now let's use a pseudo-element or just a div with background/border simulation) 
                Wait, standard border doesn't work with clip-path. 
                Better approach for borders with clip-path: use an outer div valid colored background and an inner div slightly smaller.
                OR: SVG.
                Let's stick to the current visual if possible.
                Actually, rotate is fine if we contain it properly.
                
                Let's try to keep the rotate-45 but make it responsive.
                If I have a w-full h-full container, and I put a square inside rotated 45deg?
                Ideally, width = height for a perfect diamond.
                
                Let's go back to rotate-45 but make the inner div responsive.
                But wait, a 100% width rotated 45 degrees will overflow the container.
                Formula: To fit a rotated square in a box of side L, the square side s must be L / sqrt(2).
                
                Simpler: Just use the SVG approach or clip-path with a "border" trick (gradient or stacked divs).
                Let's use stacked divs for border trick with clip-path.
            */}
            <div
                className={cn(
                    "absolute inset-0 bg-card",
                    selected
                        ? "bg-amber-500"
                        : "bg-amber-500/50"
                )}
                style={{
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
            >
                <div
                    className="absolute inset-[2px] bg-card"
                    style={{
                        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    }}
                />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="w-20 text-xs font-medium text-center bg-transparent border-none outline-none focus:ring-0 pointer-events-auto"
                    />
                ) : (
                    <span className="text-xs font-medium text-foreground text-center px-6 truncate max-w-full pointer-events-auto">
                        {data?.label ?? "Decision?"}
                    </span>
                )}
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3 !h-3 !bg-amber-500 !border-2 !border-background !top-0 !left-1/2 !-translate-x-1/2"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3 !h-3 !bg-amber-500 !border-2 !border-background !bottom-0 !left-1/2 !-translate-x-1/2"
            />
            <Handle
                type="source"
                position={Position.Left}
                id="left"
                className="!w-3 !h-3 !bg-amber-500 !border-2 !border-background !left-0 !top-1/2 !-translate-y-1/2"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                className="!w-3 !h-3 !bg-amber-500 !border-2 !border-background !right-0 !top-1/2 !-translate-y-1/2"
            />
        </div>
    );
});

DiamondNode.displayName = "DiamondNode";
