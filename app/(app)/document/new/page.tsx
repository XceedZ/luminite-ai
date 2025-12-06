"use client";

import { useState, useCallback } from "react";
import { SimpleEditor, type DocumentActions } from "@/components/tiptap-templates/simple/simple-editor";

export default function NewDocumentPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Saving document");
        setIsSaving(false);
    }, []);

    const handleShare = useCallback(() => {
        alert("Share feature coming soon!");
    }, []);

    const handleExport = useCallback(() => {
        alert("Export feature coming soon!");
    }, []);

    // AI handler using generateDocumentAIResponse
    const handleAiRequest = useCallback(async (selectedText: string, prompt: string): Promise<string> => {
        console.log("AI Request:", { selectedText, prompt });

        // Dynamic import to avoid server action issues
        const { generateDocumentAIResponse } = await import("@/lib/actions/ai");
        const response = await generateDocumentAIResponse(prompt, selectedText);
        return response;
    }, []);

    const documentActions: DocumentActions = {
        onSave: handleSave,
        onShare: handleShare,
        onExport: handleExport,
        isSaving,
        backHref: "/document",
    };

    return (
        <div className="h-[calc(100vh-4rem)] overflow-hidden">
            <SimpleEditor
                onAiRequest={handleAiRequest}
                documentActions={documentActions}
            />
        </div>
    );
}
