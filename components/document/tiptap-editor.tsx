"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Undo,
    Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

interface TiptapEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    editable?: boolean;
}

export function TiptapEditor({
    content = "",
    onChange,
    placeholder = "Start writing, or press '/' for commands...",
    editable = true,
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                codeBlock: false, // Use CodeBlockLowlight instead
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: "is-editor-empty",
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content,
        editable,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-4 py-3",
            },
        },
    });

    if (!editor) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-muted-foreground">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full">
            {/* Toolbar */}
            <div className="sticky top-0 z-10 flex items-center gap-1 p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                {/* Undo/Redo */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8"
                >
                    <Redo className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Headings */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn("h-8 w-8", editor.isActive("heading", { level: 1 }) && "bg-muted")}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn("h-8 w-8", editor.isActive("heading", { level: 2 }) && "bg-muted")}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn("h-8 w-8", editor.isActive("heading", { level: 3 }) && "bg-muted")}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Text formatting */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn("h-8 w-8", editor.isActive("bold") && "bg-muted")}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn("h-8 w-8", editor.isActive("italic") && "bg-muted")}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn("h-8 w-8", editor.isActive("strike") && "bg-muted")}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={cn("h-8 w-8", editor.isActive("code") && "bg-muted")}
                >
                    <Code className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn("h-8 w-8", editor.isActive("bulletList") && "bg-muted")}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn("h-8 w-8", editor.isActive("orderedList") && "bg-muted")}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={cn("h-8 w-8", editor.isActive("taskList") && "bg-muted")}
                >
                    <CheckSquare className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Blockquote & Code block */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn("h-8 w-8", editor.isActive("blockquote") && "bg-muted")}
                >
                    <Quote className="h-4 w-4" />
                </Button>
            </div>

            {/* Bubble Menu - appears on text selection */}
            {editor && (
                <BubbleMenu
                    editor={editor}

                    className="flex items-center gap-1 p-1 rounded-lg border bg-background shadow-lg"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn("h-7 w-7", editor.isActive("bold") && "bg-muted")}
                    >
                        <Bold className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn("h-7 w-7", editor.isActive("italic") && "bg-muted")}
                    >
                        <Italic className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={cn("h-7 w-7", editor.isActive("strike") && "bg-muted")}
                    >
                        <Strikethrough className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={cn("h-7 w-7", editor.isActive("code") && "bg-muted")}
                    >
                        <Code className="h-3.5 w-3.5" />
                    </Button>
                </BubbleMenu>
            )}

            {/* Editor Content */}
            <EditorContent editor={editor} className="min-h-[500px]" />

            {/* Editor Styles */}
            <style jsx global>{`
                .ProseMirror {
                    outline: none;
                }
                
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: var(--muted-foreground);
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }

                .ProseMirror h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                }

                .ProseMirror h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                }

                .ProseMirror h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }

                .ProseMirror ul[data-type="taskList"] {
                    list-style: none;
                    padding: 0;
                }

                .ProseMirror ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                }

                .ProseMirror ul[data-type="taskList"] li > label {
                    flex-shrink: 0;
                    margin-top: 0.25rem;
                }

                .ProseMirror ul[data-type="taskList"] li > label input[type="checkbox"] {
                    width: 1rem;
                    height: 1rem;
                    cursor: pointer;
                    accent-color: hsl(var(--primary));
                }

                .ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div > p {
                    text-decoration: line-through;
                    color: var(--muted-foreground);
                }

                .ProseMirror blockquote {
                    border-left: 3px solid hsl(var(--border));
                    margin: 1rem 0;
                    padding-left: 1rem;
                    color: var(--muted-foreground);
                }

                .ProseMirror pre {
                    background: hsl(var(--muted));
                    border-radius: 0.5rem;
                    font-family: 'JetBrains Mono', monospace;
                    padding: 1rem;
                    margin: 1rem 0;
                    overflow-x: auto;
                }

                .ProseMirror pre code {
                    color: inherit;
                    padding: 0;
                    background: none;
                    font-size: 0.875rem;
                }

                .ProseMirror code {
                    background: hsl(var(--muted));
                    border-radius: 0.25rem;
                    padding: 0.2rem 0.4rem;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.875rem;
                }

                /* Syntax highlighting */
                .hljs-comment,
                .hljs-quote { color: #6a737d; }
                .hljs-keyword,
                .hljs-selector-tag { color: #d73a49; }
                .hljs-string,
                .hljs-attr { color: #032f62; }
                .hljs-number,
                .hljs-literal { color: #005cc5; }
                .hljs-title,
                .hljs-section { color: #6f42c1; }
                
                .dark .hljs-comment,
                .dark .hljs-quote { color: #8b949e; }
                .dark .hljs-keyword,
                .dark .hljs-selector-tag { color: #ff7b72; }
                .dark .hljs-string,
                .dark .hljs-attr { color: #a5d6ff; }
                .dark .hljs-number,
                .dark .hljs-literal { color: #79c0ff; }
                .dark .hljs-title,
                .dark .hljs-section { color: #d2a8ff; }
            `}</style>
        </div>
    );
}
