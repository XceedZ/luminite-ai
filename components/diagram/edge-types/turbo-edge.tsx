"use client";

import { memo } from "react";
import {
    EdgeProps,
    getBezierPath,
    BaseEdge,
} from "@xyflow/react";

const TurboEdge = memo(({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
}: EdgeProps) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: "url(#turbo-edge-gradient)",
                    strokeWidth: 2,
                    filter: "drop-shadow(0 0 3px rgba(168, 85, 247, 0.5))",
                }}
            />
            {/* Animated glow effect */}
            <path
                d={edgePath}
                fill="none"
                strokeWidth={4}
                stroke="url(#turbo-edge-gradient)"
                strokeOpacity={0.3}
                className="animate-pulse"
            />
        </>
    );
});

TurboEdge.displayName = "TurboEdge";

export { TurboEdge };
