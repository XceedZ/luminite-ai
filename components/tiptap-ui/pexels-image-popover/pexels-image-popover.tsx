"use client"

import { useState } from "react"
import { ImageIcon, Search, Loader2, X } from "lucide-react"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"

interface PexelsImage {
    url: string
    alt: string
    photographer: string
}

export function PexelsImagePopover() {
    const { editor } = useTiptapEditor()
    const { t, lang } = useLanguage()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [images, setImages] = useState<PexelsImage[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async () => {
        if (!query.trim() || isLoading) return

        setIsLoading(true)
        try {
            const { searchPexelsImages } = await import("@/lib/actions/ai")
            const results = await searchPexelsImages(query, 8)
            setImages(results)
        } catch (error) {
            console.error("Pexels search error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInsertImage = (image: PexelsImage) => {
        if (!editor) return

        // Use insertContent with HTML since setImage may not be available
        editor.chain().focus().insertContent(
            `<img src="${image.url}" alt="${image.alt}" />`
        ).run()

        setOpen(false)
        setQuery("")
        setImages([])
    }

    if (!editor) return null

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button data-style="ghost" title={t("searchImages")}>
                    <ImageIcon className="tiptap-button-icon" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="start">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input
                                placeholder={lang === 'id' ? "Cari gambar..." : "Search images..."}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pr-8"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => { setQuery(""); setImages([]); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={!query.trim() || isLoading}
                            className="flex items-center justify-center w-9 h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                            {images.map((image, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleInsertImage(image)}
                                    className="relative aspect-video rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all group"
                                >
                                    <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                                        <span className="text-xs text-white truncate">
                                            📷 {image.photographer}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {images.length === 0 && !isLoading && query && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            {lang === 'id' ? 'Tidak ada gambar ditemukan' : 'No images found'}
                        </p>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                        Photos by <a href="https://www.pexels.com" target="_blank" rel="noopener" className="underline">Pexels</a>
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    )
}
