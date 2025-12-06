"use client"

import { useEffect, useRef, useState, ReactNode } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import { Wand2, ArrowUp, Loader2, ArrowLeft, Save, Share, MoreHorizontal, Download, FileText, Check, Sparkles, Image as ImageIcon, Square, Pencil } from "lucide-react"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Separator } from "@/components/ui/separator"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image as TiptapImage } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Button as UiButton } from "@/components/ui/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"
import { PexelsImagePopover } from "@/components/tiptap-ui/pexels-image-popover"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import content from "@/components/tiptap-templates/simple/data/content.json"

// Custom AI handler type
export type AiRequestHandler = (selectedText: string, prompt: string) => Promise<string>;

// Document action handlers
export interface DocumentActions {
  onSave?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  isSaving?: boolean;
  backHref?: string;
}

interface MainToolbarContentProps {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  onAiRequest?: AiRequestHandler;
  documentActions?: DocumentActions;
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  onAiRequest,
  documentActions,
}: MainToolbarContentProps) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Document Actions - Left side */}
      {documentActions && (
        <>
          <ToolbarGroup>
            {documentActions.backHref && (
              <Link href={documentActions.backHref}>
                <Button data-style="ghost">
                  <ArrowLeft className="tiptap-button-icon" />
                </Button>
              </Link>
            )}
          </ToolbarGroup>
        </>
      )}

      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton />
        <PexelsImagePopover />
      </ToolbarGroup>

      <Spacer />

      {/* Document Actions - Right side (icon-only) */}
      {documentActions && (
        <>
          {documentActions.onShare && (
            <ToolbarGroup>
              <Button data-style="ghost" onClick={documentActions.onShare} title={t("share")}>
                <Share className="tiptap-button-icon" />
              </Button>
            </ToolbarGroup>
          )}
          {documentActions.onSave && (
            <ToolbarGroup>
              <Button
                data-style="ghost"
                onClick={documentActions.onSave}
                disabled={documentActions.isSaving}
                title={documentActions.isSaving ? t("saving") : t("save")}
              >
                {documentActions.isSaving ? (
                  <Loader2 className="tiptap-button-icon animate-spin" />
                ) : (
                  <Save className="tiptap-button-icon" />
                )}
              </Button>
            </ToolbarGroup>
          )}
        </>
      )}

      {isMobile && <ToolbarSeparator />}
    </>
  )
}

// Floating AI Input component with analyze → action buttons flow
type ActionMode = 'replace_all' | 'replace_selection';

interface FloatingAiInputProps {
  onAiRequest: AiRequestHandler;
  onContentGenerated?: (html: string, mode: ActionMode) => void;
}

// Step type for document AI
type DocumentStep = {
  id: 'search_images' | 'generate';
  status: 'pending' | 'loading' | 'done';
  text: string;
};

const FloatingAiInput = ({ onAiRequest, onContentGenerated }: FloatingAiInputProps) => {
  const { t, lang } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [analysisResponse, setAnalysisResponse] = useState("");
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [step, setStep] = useState<DocumentStep | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const isLoading = step?.status === 'loading';
  const isExpanded = isFocused || prompt.length > 0 || isLoading || step !== null;

  const updateStep = (id: DocumentStep['id'], status: DocumentStep['status']) => {
    setStep((prev) => {
      // If we're starting a new step that's different from current, replace it
      if (!prev || prev.id !== id) {
        let text = '';
        if (id === 'search_images') {
          text = lang === 'id' ? 'Mencari gambar...' : 'Searching images...';
        } else {
          text = lang === 'id' ? 'Menulis konten' : 'Writing content';
        }
        return { id, status, text };
      }
      // efficient update for same step
      return { ...prev, status };
    });
  };

  const clearStep = () => setStep(null);
  const handleCancel = () => clearStep();

  const handleSubmit = async () => {
    if (!prompt.trim() || step?.status === 'loading') return;
    await handleGenerate();
  };

  const handleGenerate = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) return;

    // Step 1: Search Images
    updateStep('search_images', 'loading');
    let images: string[] = [];

    try {
      const { searchPexelsImages } = await import("@/lib/actions/ai");
      console.log("[AI] Searching Pexels images for:", userPrompt, "Count: 3");
      const results = await searchPexelsImages(userPrompt, 3);
      console.log("[AI] Pexels results:", results);
      images = results.map(img => img.url);
      updateStep('search_images', 'done');
    } catch (error) {
      console.warn("[AI] Image search failed, proceeding without images:", error);
      // If search fails, we just proceed to generation without images
      // We can optionally mark it as done or just switch to next step
    }

    // Step 2: Generate Content
    console.log("[AI] Generating content with images:", images);
    updateStep('generate', 'loading');

    try {
      const { generateDocumentAIResponse } = await import("@/lib/actions/ai");
      // Pass the found images to generating function
      const html = await generateDocumentAIResponse(userPrompt, "", 'replace_all', lang, images);

      updateStep('generate', 'done');

      if (onContentGenerated) {
        onContentGenerated(html, 'replace_all');
      } else {
        await onAiRequest("", userPrompt);
      }

      // Clear after short delay to show completion
      setTimeout(() => {
        setPrompt("");
        clearStep();
      }, 800);
    } catch (error) {
      console.error("Generate error:", error);
      clearStep();
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const { enhancePromptDocument } = await import("@/lib/actions/ai");
      const enhanced = await enhancePromptDocument(prompt, lang);
      setPrompt(enhanced);
    } catch (error) {
      console.error("Failed to enhance prompt:", error);
    } finally {
      setIsEnhancing(false);
    }
  };





  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '0',
        right: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 24px',
        zIndex: 100,
        gap: '8px',
      }}
    >
      {/* Step Indicators - floating above input */}
      {/* Step Indicators - floating above input */}
      {step && (
        <div
          className="bg-background border rounded-xl animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '10px 14px',
            width: '100%',
            maxWidth: '640px',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 8px 32px -4px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="flex items-center gap-3 py-1">
            <div className={`p-2 rounded-lg transition-colors ${step.status === 'loading'
              ? 'bg-gradient-to-br from-primary/20 to-primary/5'
              : 'bg-muted'}`}>
              {step.id === 'search_images' ? (
                <ImageIcon className="h-4 w-4 text-primary" />
              ) : (
                <Pencil className="h-4 w-4 text-primary" />
              )}
            </div>
            <span className={`text-sm flex-1 ${step.status === 'done' ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
              <AnimatedShinyText className="inline-flex items-center justify-center transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>{step.text}</span>
              </AnimatedShinyText>
            </span>
            <div className="flex items-center">
              {step.status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : step.status === 'done' ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : null}
            </div>
          </div>
        </div>
      )}


      {/* Main Input Container */}
      <div
        className={`bg-background border border-input rounded-xl transition-all duration-200 ease-in-out ${isExpanded ? 'shadow-lg ring-1 ring-primary/20' : 'shadow-xs'}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '640px',
        }}
      >
        {/* Input Area */}
        <div className="px-3 pt-3">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t("aiInputPlaceholder")}
            disabled={isLoading}
            rows={1}
            className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground resize-none max-h-[200px]"
            style={{
              padding: '0',
              minHeight: isExpanded ? '60px' : '24px',
              transition: 'min-height 0.2s ease'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>

        {/* Footer Area with Buttons */}
        <div className="flex items-center justify-between px-3 pb-3">
          {/* Left: Enhance Button */}
          <UiButton
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => e.preventDefault()} // Prevent blur
            onClick={handleEnhancePrompt}
            disabled={!prompt.trim() || isEnhancing || isLoading}
            className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground"
            title={t("enhancePrompt")}
          >
            {isEnhancing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Wand2 className="h-3.5 w-3.5" />
            )}
          </UiButton>

          {/* Right: Send/Stop Button */}
          {isLoading ? (
            <UiButton
              type="button"
              variant="secondary"
              size="icon"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCancel}
              className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <Square className="h-3 w-3" />
            </UiButton>
          ) : (
            <UiButton
              type="button"
              variant="default"
              size="icon"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="w-6 h-6 rounded-full"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </UiButton>
          )}
        </div>
      </div>
    </div>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export interface SimpleEditorProps {
  /** Custom AI request handler */
  onAiRequest?: AiRequestHandler;
  /** Document action handlers */
  documentActions?: DocumentActions;
}

export function SimpleEditor({ onAiRequest, documentActions }: SimpleEditorProps = {}) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const toolbarRef = useRef<HTMLDivElement>(null)

  // AI Selection Bubble state
  const [showAiBubble, setShowAiBubble] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isAiProcessing, setIsAiProcessing] = useState(false)
  const { t, lang } = useLanguage()

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      TiptapImage,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content,
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  return (
    <div className="simple-editor-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            flexShrink: 0,
            ...(isMobile
              ? {
                bottom: `calc(100% - ${height - rect.y}px)`,
              }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              onAiRequest={onAiRequest}
              documentActions={documentActions}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: '100px' }}
        />

        {/* AI Selection Bubble - shows when text is selected */}
        {editor && (
          <BubbleMenu
            editor={editor}
            shouldShow={({ state }) => {
              const { from, to } = state.selection
              return from !== to && !isAiProcessing
            }}
          >
            <div className="flex items-center gap-2 bg-background border rounded-lg shadow-lg p-2">
              {showAiBubble ? (
                <>
                  <UiButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      if (!aiPrompt.trim()) return
                      setIsAiProcessing(true) // Reuse existing processing state for wand
                      try {
                        const { enhancePromptDocument } = await import("@/lib/actions/ai")
                        const enhanced = await enhancePromptDocument(aiPrompt, lang)
                        setAiPrompt(enhanced)
                      } catch (error) {
                        console.error("Failed to enhance prompt:", error)
                      } finally {
                        setIsAiProcessing(false)
                      }
                    }}
                    disabled={!aiPrompt.trim() || isAiProcessing}
                    className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
                    title={lang === 'id' ? 'Tingkatkan prompt' : 'Enhance prompt'}
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                  </UiButton>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={lang === 'id' ? 'Apa yang ingin diubah?' : 'What should I change?'}
                    className="flex-1 bg-transparent border-none outline-none text-sm min-w-[200px]"
                    autoFocus
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && aiPrompt.trim()) {
                        e.preventDefault()
                        setIsAiProcessing(true)
                        try {
                          const selectedText = editor.state.doc.textBetween(
                            editor.state.selection.from,
                            editor.state.selection.to,
                            ' '
                          )
                          const { generateDocumentAIResponse } = await import("@/lib/actions/ai")
                          const html = await generateDocumentAIResponse(
                            aiPrompt,
                            selectedText,
                            'replace_selection',
                            lang
                          )
                          editor.chain().focus().deleteSelection().insertContent(html).run()
                          setAiPrompt("")
                          setShowAiBubble(false)
                        } catch (error) {
                          console.error("AI selection error:", error)
                        } finally {
                          setIsAiProcessing(false)
                        }
                      }
                      if (e.key === 'Escape') {
                        setShowAiBubble(false)
                        setAiPrompt("")
                      }
                    }}
                  />
                  <UiButton
                    type="button"
                    variant="default"
                    size="icon"
                    onClick={async () => {
                      if (!aiPrompt.trim()) return
                      setIsAiProcessing(true)
                      try {
                        const selectedText = editor.state.doc.textBetween(
                          editor.state.selection.from,
                          editor.state.selection.to,
                          ' '
                        )
                        const { generateDocumentAIResponse } = await import("@/lib/actions/ai")
                        const html = await generateDocumentAIResponse(
                          aiPrompt,
                          selectedText,
                          'replace_selection',
                          lang
                        )
                        editor.chain().focus().deleteSelection().insertContent(html).run()
                        setAiPrompt("")
                        setShowAiBubble(false)
                      } catch (error) {
                        console.error("AI selection error:", error)
                      } finally {
                        setIsAiProcessing(false)
                      }
                    }}
                    disabled={!aiPrompt.trim() || isAiProcessing}
                    className="h-6 w-6 rounded-full"
                  >
                    {isAiProcessing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ArrowUp className="h-3.5 w-3.5" />
                    )}
                  </UiButton>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAiBubble(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{lang === 'id' ? 'Edit dengan AI' : 'Edit with AI'}</span>
                </button>
              )}
            </div>
          </BubbleMenu>
        )}

        {/* Always visible floating AI input */}
        {onAiRequest && (
          <FloatingAiInput
            onAiRequest={onAiRequest}
            onContentGenerated={(html, mode) => {
              if (!editor) return;

              if (mode === 'replace_all') {
                // Replace all content
                editor.commands.setContent(html);
              } else {
                // Insert at cursor or replace selection
                editor.commands.insertContent(html);
              }
              editor.commands.focus();
            }}
          />
        )}
      </EditorContext.Provider>
    </div>
  )
}
