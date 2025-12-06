"use client";

import { Undo, Redo, Trash2, Download, Save, Code, Image, FileText, RotateCcw, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

interface DiagramToolbarProps {
    diagramName?: string;
    onExportMermaid: () => void;
    onExportPNG: () => void;
    onExportSVG: () => void;
    onDelete: () => void;
    onClear: () => void;
    onToggleAI: () => void;
    showAI: boolean;
}

export function DiagramToolbar({
    diagramName = "Untitled",
    onExportMermaid,
    onExportPNG,
    onExportSVG,
    onDelete,
    onClear,
    onToggleAI,
    showAI,
}: DiagramToolbarProps) {
    const { t } = useLanguage();

    return (
        <div className="h-12 border-b bg-background flex items-center px-4 gap-2">
            {/* Back to list */}
            <Button variant="ghost" size="sm" asChild>
                <Link href="/diagram">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t("back")}
                </Link>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Undo/Redo */}
            <Button variant="ghost" size="icon" title="Undo (coming soon)" disabled>
                <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Redo (coming soon)" disabled>
                <Redo className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Delete & Clear */}
            <Button variant="ghost" size="icon" onClick={onDelete} title="Delete selected">
                <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClear} title="Clear canvas">
                <RotateCcw className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Export Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={onExportMermaid}>
                        <Code className="h-4 w-4 mr-2" />
                        Mermaid Code
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onExportPNG}>
                        <Image className="h-4 w-4 mr-2" />
                        PNG Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onExportSVG}>
                        <FileText className="h-4 w-4 mr-2" />
                        SVG Vector
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1" />

            {/* AI Toggle */}
            <RainbowButton
                size="sm"
                onClick={onToggleAI}
            >
                <Sparkles className="h-4 w-4" />
                {t("askAI")}
            </RainbowButton>

            {/* Save */}
            <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
            </Button>
        </div>
    );
}
