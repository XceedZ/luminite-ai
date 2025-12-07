"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import { Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useLanguage } from "@/components/language-provider"

interface ReleaseNotesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ReleaseNotesDialog({ open, onOpenChange }: ReleaseNotesDialogProps) {
    const { t } = useLanguage()
    const [content, setContent] = React.useState<string>("")
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        if (open && !content) {
            setLoading(true)
            fetch("/api/release-notes")
                .then((res) => res.json())
                .then((data) => {
                    setContent(data.content)
                })
                .catch((err) => {
                    console.error("Failed to fetch release notes:", err)
                    setContent("# Error\nFailed to load release notes.")
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [open, content])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("changelog")}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        content.split(/^## /m).slice(1).map((section, index) => (
                            <div key={index} className="rounded-lg border p-5 bg-muted/30">
                                <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:mb-2 prose-headings:mt-0 prose-h2:text-lg prose-h2:font-semibold prose-p:text-xs prose-p:text-muted-foreground prose-p:mt-1 prose-ul:mt-4 prose-ul:list-disc prose-ul:list-inside prose-ul:text-sm prose-li:my-0.5">
                                    <ReactMarkdown>{`## ${section}`}</ReactMarkdown>
                                </article>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
