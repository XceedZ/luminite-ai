"use client";

import { Node, Edge, MarkerType } from "@xyflow/react";

interface ParsedNode {
    id: string;
    type: string;
    label: string;
}

interface ParsedEdge {
    source: string;
    target: string;
    label?: string;
    animated?: boolean;
}

interface MermaidParseResult {
    nodes: Node[];
    edges: Edge[];
    type: "flowchart" | "erd" | "unknown";
}

/**
 * Parse Mermaid flowchart code to ReactFlow nodes and edges
 */
export function parseMermaidCode(code: string): MermaidParseResult {
    const lines = code.trim().split("\n").map(l => l.trim()).filter(l => l);

    if (lines.length === 0) {
        return { nodes: [], edges: [], type: "unknown" };
    }

    const firstLine = lines[0].toLowerCase();

    if (firstLine.startsWith("flowchart") || firstLine.startsWith("graph")) {
        return parseFlowchart(lines);
    } else if (firstLine.startsWith("erdiagram")) {
        return parseERD(lines);
    }

    // Try flowchart as default
    return parseFlowchart(lines);
}

function parseFlowchart(lines: string[]): MermaidParseResult {
    const parsedNodes: Map<string, ParsedNode> = new Map();
    const parsedEdges: ParsedEdge[] = [];

    // Skip the first line (flowchart TD/LR etc)
    const contentLines = lines.slice(1);

    for (const line of contentLines) {
        // Skip comments and empty lines
        if (line.startsWith("%%") || !line) continue;

        // Parse edges: A --> B, A -->|label| B, A -.-> B (dotted)
        const edgeMatch = line.match(
            /^(\w+)(?:\[([^\]]*)\]|\{([^}]*)\}|\(\(([^)]*)\)\)|\[\/([^/]*)\/\])?[\s]*(-{1,2}>|\.{1,2}>|={1,2}>|---)(?:\|([^|]*)\|)?[\s]*(\w+)(?:\[([^\]]*)\]|\{([^}]*)\}|\(\(([^)]*)\)\)|\[\/([^/]*)\/\])?/
        );

        if (edgeMatch) {
            const sourceId = edgeMatch[1];
            const sourceLabel = edgeMatch[2] || edgeMatch[3] || edgeMatch[4] || edgeMatch[5];
            const edgeType = edgeMatch[6];
            const edgeLabel = edgeMatch[7];
            const targetId = edgeMatch[8];
            const targetLabel = edgeMatch[9] || edgeMatch[10] || edgeMatch[11] || edgeMatch[12];

            // Determine source node type
            if (!parsedNodes.has(sourceId)) {
                parsedNodes.set(sourceId, {
                    id: sourceId,
                    type: getNodeType(edgeMatch[2], edgeMatch[3], edgeMatch[4], edgeMatch[5]),
                    label: sourceLabel || sourceId,
                });
            } else if (sourceLabel) {
                const node = parsedNodes.get(sourceId)!;
                node.label = sourceLabel;
                node.type = getNodeType(edgeMatch[2], edgeMatch[3], edgeMatch[4], edgeMatch[5]);
            }

            // Determine target node type
            if (!parsedNodes.has(targetId)) {
                parsedNodes.set(targetId, {
                    id: targetId,
                    type: getNodeType(edgeMatch[9], edgeMatch[10], edgeMatch[11], edgeMatch[12]),
                    label: targetLabel || targetId,
                });
            } else if (targetLabel) {
                const node = parsedNodes.get(targetId)!;
                node.label = targetLabel;
                node.type = getNodeType(edgeMatch[9], edgeMatch[10], edgeMatch[11], edgeMatch[12]);
            }

            parsedEdges.push({
                source: sourceId,
                target: targetId,
                label: edgeLabel,
                animated: edgeType.includes("."), // dotted lines are animated
            });
            continue;
        }

        // Parse standalone node definitions: A[Label], B{Label}, C((Label)), D[/Label/]
        const nodeMatch = line.match(/^(\w+)(?:\[([^\]]*)\]|\{([^}]*)\}|\(\(([^)]*)\)\)|\[\/([^/]*)\/\])$/);
        if (nodeMatch) {
            const id = nodeMatch[1];
            const label = nodeMatch[2] || nodeMatch[3] || nodeMatch[4] || nodeMatch[5];
            parsedNodes.set(id, {
                id,
                type: getNodeType(nodeMatch[2], nodeMatch[3], nodeMatch[4], nodeMatch[5]),
                label: label || id,
            });
        }
    }

    // Convert to ReactFlow format with auto-layout
    const nodes = layoutNodes(Array.from(parsedNodes.values()));
    const edges = parsedEdges.map((e, i) => ({
        id: `e-${e.source}-${e.target}-${i}`,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        animated: e.animated,
        label: e.label,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#71717a", strokeWidth: 2 },
    }));

    return { nodes, edges, type: "flowchart" };
}

function parseERD(lines: string[]): MermaidParseResult {
    const parsedNodes: Map<string, ParsedNode> = new Map();
    const parsedEdges: ParsedEdge[] = [];

    // Skip erDiagram line
    const contentLines = lines.slice(1);

    let currentEntity: string | null = null;
    const entityFields: Map<string, string[]> = new Map();

    for (const line of contentLines) {
        if (line.startsWith("%%") || !line) continue;

        // Parse relationship: Entity1 ||--o{ Entity2 : "relationship"
        const relMatch = line.match(/^(\w+)\s*(\|{1,2}|o{1,2})?(-{1,2})(o{1,2}|\|{1,2})?\{?\s*(\w+)\s*:\s*"?([^"]*)"?$/);
        if (relMatch) {
            const source = relMatch[1];
            const target = relMatch[5];
            const label = relMatch[6];

            if (!parsedNodes.has(source)) {
                parsedNodes.set(source, { id: source, type: "entity", label: source });
            }
            if (!parsedNodes.has(target)) {
                parsedNodes.set(target, { id: target, type: "entity", label: target });
            }

            parsedEdges.push({ source, target, label });
            continue;
        }

        // Parse entity block start: Entity {
        const entityStart = line.match(/^(\w+)\s*\{$/);
        if (entityStart) {
            currentEntity = entityStart[1];
            if (!parsedNodes.has(currentEntity)) {
                parsedNodes.set(currentEntity, { id: currentEntity, type: "entity", label: currentEntity });
            }
            entityFields.set(currentEntity, []);
            continue;
        }

        // Parse entity block end
        if (line === "}") {
            currentEntity = null;
            continue;
        }

        // Parse field inside entity: type name PK/FK
        if (currentEntity) {
            const fieldMatch = line.match(/^\s*(\w+)\s+(\w+)(?:\s+(PK|FK))?/);
            if (fieldMatch) {
                const fields = entityFields.get(currentEntity) || [];
                fields.push(`${fieldMatch[2]} (${fieldMatch[1]})${fieldMatch[3] ? ` ${fieldMatch[3]}` : ""}`);
                entityFields.set(currentEntity, fields);
            }
        }
    }

    // Update node data with fields
    parsedNodes.forEach((node, id) => {
        const fields = entityFields.get(id);
        if (fields && fields.length > 0) {
            (node as unknown as { fields: string[] }).fields = fields;
        }
    });

    const nodes = layoutNodes(Array.from(parsedNodes.values()), true);
    const edges = parsedEdges.map((e, i) => ({
        id: `e-${e.source}-${e.target}-${i}`,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        label: e.label,
        style: { stroke: "#71717a", strokeWidth: 2 },
    }));

    return { nodes, edges, type: "erd" };
}

function getNodeType(rect?: string, diamond?: string, circle?: string, parallelogram?: string): string {
    if (circle !== undefined) return "circle";
    if (diamond !== undefined) return "diamond";
    if (parallelogram !== undefined) return "parallelogram";
    return "basic"; // default rectangle
}

function layoutNodes(parsedNodes: ParsedNode[], isGrid = false): Node[] {
    const SPACING_X = 200;
    const SPACING_Y = 150;
    const COLS = 3;

    return parsedNodes.map((node, index) => {
        let x: number, y: number;

        if (isGrid) {
            // Grid layout for ERD
            x = (index % COLS) * (SPACING_X + 100) + 100;
            y = Math.floor(index / COLS) * (SPACING_Y + 100) + 100;
        } else {
            // Vertical flow for flowchart
            x = 300;
            y = index * SPACING_Y + 100;
        }

        return {
            id: node.id,
            type: node.type,
            position: { x, y },
            data: {
                label: node.label,
                ...((node as unknown as { fields?: string[] }).fields && {
                    fields: (node as unknown as { fields: string[] }).fields
                })
            },
        };
    });
}
