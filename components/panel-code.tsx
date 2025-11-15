"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Code2, Eye, X, Copy, Share2, Maximize, Check, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Minimize2, Monitor, Tablet, Smartphone, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { togglePublishStatus, saveCodeToUpstash } from "@/lib/actions/ai"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLanguage } from "@/components/language-provider"
import ReactMarkdown from "react-markdown"

// Browser Header Component (reusable)
const BrowserHeader = ({ 
  onRefresh, 
  isRefreshing,
  deviceSize,
  onDeviceChange
}: { 
  onRefresh?: () => void
  isRefreshing?: boolean
  deviceSize?: "desktop" | "tablet" | "phone"
  onDeviceChange?: (size: "desktop" | "tablet" | "phone") => void
}) => {
  // Get icon based on device size
  const getDeviceIcon = () => {
    switch (deviceSize) {
      case "phone":
        return <Smartphone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
      case "tablet":
        return <Tablet className="h-3 w-3 text-muted-foreground flex-shrink-0" />
      case "desktop":
      default:
        return <Monitor className="h-3 w-3 text-muted-foreground flex-shrink-0" />
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
      {/* Left: Navigation buttons */}
      <div className="flex items-center gap-1">
        <button
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Forward"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
        </button>
      </div>
      
      {/* Center: Device selector */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-background/50 border border-border/50 flex-1 max-w-md mx-4">
        <Select value={deviceSize || "desktop"} onValueChange={(value) => onDeviceChange?.(value as "desktop" | "tablet" | "phone")}>
          <SelectTrigger className="h-auto p-0 border-0 bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 shadow-none gap-2 [&_[data-slot=select-value]]:hidden [&>svg:last-of-type]:hidden">
            {getDeviceIcon()}
            <span className="text-xs text-muted-foreground ml-3">/</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desktop">
              <div className="flex items-center gap-2">
                <Monitor className="h-3.5 w-3.5" />
                <span>Desktop</span>
              </div>
            </SelectItem>
            <SelectItem value="tablet">
              <div className="flex items-center gap-2">
                <Tablet className="h-3.5 w-3.5" />
                <span>Tablet</span>
              </div>
            </SelectItem>
            <SelectItem value="phone">
              <div className="flex items-center gap-2">
                <Smartphone className="h-3.5 w-3.5" />
                <span>Phone</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Right: Window controls */}
      <div className="flex items-center gap-1">
        <button
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Minimize"
        >
          <Minimize2 className="h-3.5 w-3.5" />
        </button>
        <button
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Maximize"
        >
          <Maximize className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// Code Block Component (reusable)
const CodeBlock = ({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode
  className?: string
  [key: string]: unknown
}) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""

  const handleCopy = () => {
    const text = typeof children === "string" ? children : String(children || "")
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const codeString = typeof children === "string" ? children : String(children || "")

  return (
    <div className="relative my-4 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
        <span className="font-medium">
          {language ? language.toUpperCase() : "CODE"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        >
          {isCopied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="bg-muted p-4 text-sm text-foreground overflow-x-auto">
        <code className={className} {...props}>
          {codeString.replace(/\n$/, "")}
        </code>
      </pre>
    </div>
  )
}

interface PanelCodeProps {
  code: string | undefined
  isOpen?: boolean
  onClose?: () => void
  projectName?: string
  sessionId?: string | null
  variant?: "overlay" | "inline" | "full" // "overlay" = slide from right, "inline" = fills space like attachment, "full" = direct preview without step wrapper
  defaultExpanded?: boolean // For inline variant, control initial expanded state
  onExpandChange?: (expanded: boolean) => void // Callback when expansion state changes
  showActions?: boolean // Show action buttons (Publish, Share, Fullscreen) - default true
  isLoading?: boolean // Is code being generated?
}

export function PanelCode({ 
  code, 
  isOpen = false, 
  onClose = () => {},
  projectName = "Preview",
  sessionId,
  variant = "overlay",
  defaultExpanded = false,
  onExpandChange,
  showActions = true,
  isLoading = false
}: PanelCodeProps) {
  const { t } = useLanguage()
  const [isPublished, setIsPublished] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const [isHovered, setIsHovered] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">("preview")
  const [refreshKey, setRefreshKey] = React.useState(0)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [deviceSize, setDeviceSize] = React.useState<"desktop" | "tablet" | "phone">("desktop")
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = React.useState(false)

  // Memoize code processing to prevent hydration mismatch
  const hasMarkdownBlocks = React.useMemo(() => {
    const result = code?.includes('```') || false
    console.log('[PanelCode] hasMarkdownBlocks check:', {
      hasCode: !!code,
      codeLength: code?.length || 0,
      hasBackticks: code?.includes('```'),
      result,
      codePreview: code?.substring(0, 100)
    })
    return result
  }, [code])

  // Extract HTML and CSS from code blocks or use code directly
  const htmlMatch = code?.match(/```html\s*\n?([\s\S]*?)```/);
  const cssMatch = code?.match(/```css\s*\n?([\s\S]*?)```/);
  let htmlCode = htmlMatch ? htmlMatch[1].trim() : '';
  const cssCode = cssMatch ? cssMatch[1].trim() : '';
  
  // If no markdown code blocks found, check if code is already HTML
  if (!htmlCode && !cssCode && code) {
    // Check if the entire code is HTML (might be stored as plain HTML)
    if (code.includes('<!DOCTYPE') || code.includes('<html') || code.includes('<HTML')) {
      htmlCode = code.trim();
    } else if (code.includes('<') && code.includes('>')) {
      // Might be HTML without DOCTYPE
      htmlCode = code.trim();
    }
  }
  
  // Check if HTML already contains inline CSS in <style> tag
  const hasInlineStyle = htmlCode.includes('<style>') || htmlCode.includes('<STYLE>');
  
  // Check if HTML is already a complete document
  const isCompleteHtml = htmlCode.includes('<!DOCTYPE') || htmlCode.includes('<html') || htmlCode.includes('<HTML');
  
  // Build fullHtml
  let fullHtml = '';
  if (isCompleteHtml && hasInlineStyle) {
    // HTML is complete with inline CSS, use as-is
    fullHtml = htmlCode;
  } else if (htmlCode && cssCode) {
    // Combine HTML and CSS
    fullHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${projectName}</title>\n<style>\n${cssCode}\n</style>\n</head>\n<body>\n${htmlCode}\n</body>\n</html>`;
  } else if (htmlCode && hasInlineStyle) {
    // HTML has inline CSS but not complete, wrap it
    if (isCompleteHtml) {
      fullHtml = htmlCode;
    } else {
      fullHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${projectName}</title>\n</head>\n${htmlCode}\n</html>`;
    }
  } else if (htmlCode) {
    // Only HTML, wrap it
    if (isCompleteHtml) {
      fullHtml = htmlCode;
    } else {
      fullHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${projectName}</title>\n</head>\n<body>\n${htmlCode}\n</body>\n</html>`;
    }
  }

  const shareUrl = React.useMemo(() => {
    if (!sessionId) return ""
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    return `${baseUrl}/playground/app-builder/share/${sessionId}`
  }, [sessionId])

  // Sync with defaultExpanded prop
  React.useEffect(() => {
    setIsExpanded(defaultExpanded)
  }, [defaultExpanded])

  // Sync expanded state with isOpen prop for overlay variant
  React.useEffect(() => {
    if (variant === "overlay") {
      setIsExpanded(isOpen)
    }
  }, [isOpen, variant])

  React.useEffect(() => {
    // Load publish status when panel opens (overlay) or when expanded (inline)
    const loadPublishStatus = async () => {
      if (sessionId && (variant === "overlay" ? isOpen : isExpanded)) {
        const { getPublishStatus } = await import("@/lib/actions/ai")
        const status = await getPublishStatus(sessionId)
        setIsPublished(status)
      }
    }
    loadPublishStatus()
  }, [isOpen, isExpanded, sessionId, variant])

  // Notify parent when expansion changes
  const handleToggleExpand = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpandChange?.(newExpanded)
  }

  const handlePublish = () => {
    if (!sessionId) return
    // If already published, unpublish directly
    if (isPublished) {
      handlePublishConfirm()
      return
    }
    // If not published, show confirm dialog
    setIsPublishConfirmOpen(true)
  }

  const handlePublishConfirm = async () => {
    if (!sessionId) return
    const newStatus = !isPublished
    
    // Save code to Upstash before publishing
    if (newStatus && code) {
      const result = await saveCodeToUpstash(sessionId, code)
      if (!result.success) {
        console.error("Failed to save code:", result.error)
        // Optionally show error toast/notification to user
        return
      }
    }
    
    await togglePublishStatus(sessionId, newStatus)
    setIsPublished(newStatus)
    setIsPublishConfirmOpen(false)
  }

  const handleShare = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleFullscreen = () => {
    if (!fullHtml) return
    // Create fullscreen window
    const fullscreenWindow = window.open("", "_blank", "width=1920,height=1080")
    if (fullscreenWindow) {
      fullscreenWindow.document.write(fullHtml)
      fullscreenWindow.document.close()
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setRefreshKey(prev => prev + 1)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  // Get iframe width based on device size
  const getIframeWidth = () => {
    switch (deviceSize) {
      case "phone":
        return "375px" // Standard phone width (iPhone)
      case "tablet":
        return "768px" // iPad standard width
      case "desktop":
      default:
        return "100%" // Full width of container for desktop
    }
  }

  if (!code) return null

  // AlertDialog component - reusable for all variants
  const PublishConfirmDialog = () => (
    <AlertDialog open={isPublishConfirmOpen} onOpenChange={setIsPublishConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("publishConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("publishConfirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handlePublishConfirm}
          >
            {t("publish")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  // Full variant - direct preview without step wrapper
  if (variant === "full") {
    return (
      <>
      <div className="h-full flex flex-col bg-background w-full max-w-full overflow-hidden">
        <div className="border border-border bg-card flex flex-col h-full w-full min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-3 sm:px-4 py-2.5 sm:py-3 flex-shrink-0 gap-1.5 flex-wrap">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-sm font-semibold text-foreground truncate">{projectName || "Code Preview"}</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 flex-wrap">
              {showActions && (
                <>
                  {/* Publish Button */}
                  {sessionId && (
                    <>
                      <Button
                        variant={isPublished ? "default" : "outline"}
                        size="sm"
                        onClick={handlePublish}
                        className="h-7 gap-1 text-xs flex-shrink-0 px-2"
                      >
                        {isPublished ? (
                          <>
                            <Check className="h-3 w-3" />
                            {t("unpublish")}
                          </>
                        ) : (
                          <>
                            <Globe className="h-3 w-3" />
                            {t("publish")}
                          </>
                        )}
                      </Button>
                      {/* Share Button */}
                      {isPublished && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          className="h-7 gap-1 text-xs flex-shrink-0 px-2"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Share
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-7 w-7 p-0 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
          {/* Content - Tabs for Preview and Code */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* Tabs */}
            <div className="border-b border-border px-4 pt-3 flex-shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2",
                    activeTab === "preview" ? "text-foreground border-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2",
                    activeTab === "code" ? "text-foreground border-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  Code
                </button>
              </div>
            </div>
            {/* Tab Content */}
            {activeTab === "preview" ? (
              <div className="flex flex-col flex-1 min-h-0 border-t border-border">
                <BrowserHeader 
                  onRefresh={handleRefresh} 
                  isRefreshing={isRefreshing}
                  deviceSize={deviceSize}
                  onDeviceChange={setDeviceSize}
                />
                <div className="flex-1 overflow-hidden bg-muted/20 flex items-center justify-center w-full transition-all duration-300">
                  {fullHtml ? (
                    <div className="h-full flex items-center justify-center w-full transition-all duration-300">
                      <iframe
                        key={refreshKey}
                        srcDoc={fullHtml}
                        className="h-full border-0 transition-all duration-300"
                        style={{ 
                          width: getIframeWidth(),
                          maxWidth: "100%"
                        }}
                        title="Code Preview"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Code2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No preview available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground py-12">
                    <div className="text-center">
                      <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      <p className="text-sm font-medium">{t("codeGenerating")}</p>
                      <p className="text-xs mt-1 opacity-70">{t("codeGeneratingDesc")}</p>
                    </div>
                  </div>
                ) : !code || code.trim() === "" ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground py-12">
                    <div className="text-center">
                      <Code2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">{t("noCodeYet")}</p>
                      <p className="text-xs mt-1 opacity-70">{t("noCodeYetDesc")}</p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-zinc max-w-none dark:prose-invert">
                    {(() => {
                      console.log('[PanelCode] Rendering code tab (full variant):', {
                        hasMarkdownBlocks,
                        codeLength: code?.length,
                        activeTab
                      })
                      return null
                    })()}
                    {hasMarkdownBlocks ? (
                      <ReactMarkdown
                        components={{
                          h1: ({ ...props }) => (
                            <h1 {...props} className="mt-5 mb-3 text-3xl font-bold text-foreground" />
                          ),
                          h2: ({ ...props }) => (
                            <h2 {...props} className="mt-4 mb-2 border-b pb-1 text-2xl font-bold text-foreground" />
                          ),
                          h3: ({ ...props }) => (
                            <h3 {...props} className="mt-3 mb-1 text-xl font-semibold text-foreground" />
                          ),
                          p: ({ ...props }) => (
                            <p {...props} className="mb-3 leading-relaxed text-foreground" />
                          ),
                          ul: ({ ...props }) => (
                            <ul {...props} className="my-3 list-inside list-disc space-y-1 text-foreground" />
                          ),
                          ol: ({ ...props }) => (
                            <ol {...props} className="my-3 list-inside list-decimal space-y-1 text-foreground" />
                          ),
                          li: ({ ...props }) => <li {...props} className="pl-2" />,
                          strong: ({ ...props }) => (
                            <strong {...props} className="font-semibold text-foreground" />
                          ),
                          code: ({ className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || "")
                            return match ? (
                              <CodeBlock className={className} {...props}>
                                {String(children).replace(/\n$/, "")}
                              </CodeBlock>
                            ) : (
                              <code className="rounded-md bg-muted px-1.5 py-1 font-mono text-sm text-foreground" {...props}>
                                {children}
                              </code>
                            )
                          },
                          pre: () => null,
                        }}
                      >
                        {code}
                      </ReactMarkdown>
                    ) : (
                      <div className="relative my-4 overflow-hidden rounded-lg border border-border">
                        <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
                          <span className="font-medium">HTML</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(code);
                              alert('Code copied!');
                            }}
                            className="h-6 w-6 p-0 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <pre className="bg-muted p-4 text-sm text-foreground overflow-x-auto">
                          <code className="language-html">{code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <PublishConfirmDialog />
      </>
    )
  }

  // Inline variant - fills space like attachment
  if (variant === "inline") {
  return (
      <>
      <div 
        className="w-full max-w-full self-start animate-in fade-in-0 slide-in-from-bottom-1 duration-200 mb-3 group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Clickable row - toggle expansion */}
        <div 
          className={cn(
            "flex items-center gap-2.5 text-sm transition-colors group cursor-pointer hover:text-foreground"
          )}
          onClick={handleToggleExpand}
        >
          {/* Icon - show Code2 by default, show ChevronDown on hover */}
          <div className="w-4 flex-shrink-0">
            {isHovered ? (
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-all", isExpanded && "rotate-180")} />
            ) : (
              <Code2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
          <span 
            className={cn(
              "transition-colors text-sm flex-1",
              isHovered ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {projectName || "Created Luminite AI landing page v1"}
          </span>
        </div>
        {/* Expanded content - show as divider line with content beside it */}
        {isExpanded && (
          <div className="mt-2 flex items-stretch gap-2.5 animate-in fade-in-0 slide-in-from-top-1 duration-200">
            {/* Spacer untuk sejajar dengan icon (w-4 = 16px) */}
            <div className="w-4 flex-shrink-0 flex items-center justify-center">
              {/* Vertical divider line */}
              <div className="w-px bg-border h-full" />
            </div>
            {/* Content beside the line */}
            <div className="flex-1 min-w-0 max-w-full overflow-hidden">
              <div className="rounded-lg border border-border bg-card min-w-0 w-full">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-3 sm:px-4 py-2.5 sm:py-3 gap-1.5 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm font-semibold text-foreground truncate">{projectName || "Code Preview"}</span>
                  </div>
                  {showActions && (
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 flex-wrap">
                      {/* Publish Button */}
                      {sessionId && (
                        <>
                          <Button
                            variant={isPublished ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePublish()
                            }}
                            className="h-7 gap-1 text-xs flex-shrink-0 px-2"
                          >
                            {isPublished ? (
                              <>
                                <Check className="h-3 w-3" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Share2 className="h-3 w-3" />
                                Publish
                              </>
                            )}
                          </Button>
                          {/* Share Button */}
                          {isPublished && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShare()
                              }}
                              className="h-7 gap-1 text-xs flex-shrink-0 px-2"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Share
                                </>
                              )}
                            </Button>
                          )}
                        </>
                      )}
                      {/* Fullscreen Button */}
                      {fullHtml && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFullscreen()
                          }}
                          className="h-7 gap-1 text-xs flex-shrink-0 px-2"
                        >
                          <Maximize className="h-3 w-3" />
                          Fullscreen
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {/* Content - Tabs for Preview and Code */}
                <div className="flex flex-col">
                  {/* Tabs */}
                  <div className="border-b border-border px-4 pt-3">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveTab("preview")
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2",
                          activeTab === "preview" ? "text-foreground border-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveTab("code")
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2",
                          activeTab === "code" ? "text-foreground border-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        Code
                      </button>
                    </div>
                  </div>
                  {/* Tab Content */}
                  {activeTab === "preview" ? (
                    <div className="flex flex-col h-[400px] border-t border-border">
                      <BrowserHeader 
                        onRefresh={handleRefresh} 
                        isRefreshing={isRefreshing}
                        deviceSize={deviceSize}
                        onDeviceChange={setDeviceSize}
                      />
                      <div className="flex-1 overflow-hidden bg-muted/20 flex items-center justify-center w-full transition-all duration-300">
                        {fullHtml ? (
                          <div className="h-full flex items-center justify-center w-full transition-all duration-300">
                            <iframe
                              key={refreshKey}
                              srcDoc={fullHtml}
                              className="h-full border-0 transition-all duration-300"
                              style={{ 
                                width: getIframeWidth(),
                                maxWidth: "100%"
                              }}
                              title="Code Preview"
                            />
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <div className="text-center">
                              <Code2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-xs">No preview available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-[400px] overflow-y-auto px-4 py-4">
                      {!code || code.trim() === "" ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground py-12">
                          <div className="text-center">
                            <Code2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">{t("noCodeYet")}</p>
                            <p className="text-xs mt-1 opacity-70">{t("noCodeYetDesc")}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-zinc max-w-none dark:prose-invert">
                          {hasMarkdownBlocks ? (
                            <ReactMarkdown
                              components={{
                                h1: ({ ...props }) => (
                                  <h1 {...props} className="mt-5 mb-3 text-3xl font-bold text-foreground" />
                                ),
                                h2: ({ ...props }) => (
                                  <h2 {...props} className="mt-4 mb-2 border-b pb-1 text-2xl font-bold text-foreground" />
                                ),
                                h3: ({ ...props }) => (
                                  <h3 {...props} className="mt-3 mb-1 text-xl font-semibold text-foreground" />
                                ),
                                p: ({ ...props }) => (
                                  <p {...props} className="mb-3 leading-relaxed text-foreground" />
                                ),
                                ul: ({ ...props }) => (
                                  <ul {...props} className="my-3 list-inside list-disc space-y-1 text-foreground" />
                                ),
                                ol: ({ ...props }) => (
                                  <ol {...props} className="my-3 list-inside list-decimal space-y-1 text-foreground" />
                                ),
                                li: ({ ...props }) => <li {...props} className="pl-2" />,
                                strong: ({ ...props }) => (
                                  <strong {...props} className="font-semibold text-foreground" />
                                ),
                                code: ({ className, children, ...props }) => {
                                  const match = /language-(\w+)/.exec(className || "")
                                  return match ? (
                                    <CodeBlock className={className} {...props}>
                                      {String(children).replace(/\n$/, "")}
                                    </CodeBlock>
                                  ) : (
                                    <code className="rounded-md bg-muted px-1.5 py-1 font-mono text-sm text-foreground" {...props}>
                                      {children}
                                    </code>
                                  )
                                },
                                pre: () => null,
                              }}
                            >
                              {code}
                            </ReactMarkdown>
                          ) : (
                            <div className="relative my-4 overflow-hidden rounded-lg border border-border">
                              <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
                                <span className="font-medium">HTML</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(code);
                                    alert('Code copied!');
                                  }}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <pre className="bg-muted p-4 text-sm text-foreground overflow-x-auto">
                                <code className="language-html">{code}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <PublishConfirmDialog />
      </>
    )
  }

  // Overlay variant - now uses attachment style (fills space, not slide from right)
  // When isOpen is true, show as expanded attachment
  // For overlay variant, if not open, don't render
  if (variant === "overlay" && !isOpen) return null

  // For overlay variant, always show expanded when open
  const shouldShowExpanded = variant === "overlay" ? isOpen : isExpanded

  return (
    <>
    <div 
      className="w-full max-w-full self-start animate-in fade-in-0 slide-in-from-bottom-1 duration-200 mb-3 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable row - toggle expansion */}
      <div
        className={cn(
          "flex items-center gap-2.5 text-sm transition-colors group cursor-pointer hover:text-foreground"
        )}
        onClick={handleToggleExpand}
      >
        {/* Icon - show Code2 by default, show ChevronDown on hover */}
        <div className="w-4 flex-shrink-0">
          {isHovered ? (
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-all", shouldShowExpanded && "rotate-180")} />
          ) : (
            <Code2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        <span 
          className={cn(
            "transition-colors text-sm flex-1",
            isHovered ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {projectName || "Code Preview"}
        </span>
      </div>
      {/* Expanded content - show as divider line with content beside it */}
      {shouldShowExpanded && (
        <div className="mt-2 flex items-stretch gap-2.5 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          {/* Spacer untuk sejajar dengan icon (w-4 = 16px) */}
          <div className="w-4 flex-shrink-0 flex items-center justify-center">
            {/* Vertical divider line */}
            <div className="w-px bg-border h-full" />
          </div>
          {/* Content beside the line */}
          <div className="flex-1 min-w-0 max-h-[600px] relative max-w-full overflow-hidden">
            {/* Gradient fade di bawah */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
            {/* Scroll container */}
            <div className="overflow-y-auto pr-2 h-full scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="rounded-lg border border-border bg-card min-w-0 w-full">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-3 sm:px-4 py-2.5 sm:py-3 gap-1.5 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm font-semibold text-foreground truncate">{projectName || "Code Preview"}</span>
            </div>
                  {showActions && (
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 flex-wrap">
                      {/* Publish Button */}
              {sessionId && (
                <>
                  <Button
                    variant={isPublished ? "default" : "outline"}
                    size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePublish()
                            }}
                            className="h-7 gap-1 text-xs flex-shrink-0 px-2"
                  >
                    {isPublished ? (
                      <>
                                <Check className="h-3 w-3" />
                        Unpublish
                      </>
                    ) : (
                      <>
                                <Share2 className="h-3 w-3" />
                        Publish
                      </>
                    )}
                  </Button>
                          {/* Share Button */}
                          {isPublished && (
                    <Button
                      variant="outline"
                      size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShare()
                              }}
                              className="h-7 gap-1 text-xs flex-shrink-0 px-2"
                    >
                      {isCopied ? (
                        <>
                                  <Check className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                                  <Copy className="h-3 w-3" />
                          Share
                        </>
                      )}
                    </Button>
                          )}
                </>
              )}
              {/* Fullscreen Button */}
              {fullHtml && (
                <Button
                  variant="outline"
                  size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFullscreen()
                          }}
                          className="h-7 gap-1 text-xs flex-shrink-0 px-2"
                        >
                          <Maximize className="h-3 w-3" />
                  Fullscreen
                </Button>
              )}
              {/* Close Button */}
              <Button
                variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onClose()
                        }}
                        className="h-7 w-7 p-0 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
            </div>
                  )}
          </div>
                {/* Content - Tabs for Preview and Code */}
                <div className="flex flex-col">
                  {/* Tabs */}
                  <div className="border-b border-border px-4 pt-3">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveTab("preview")
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2",
                          activeTab === "preview" ? "text-foreground border-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Eye className="h-3.5 w-3.5" />
                    Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveTab("code")
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2",
                          activeTab === "code" ? "text-foreground border-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        Code
                      </button>
                    </div>
              </div>
                  {/* Tab Content */}
                  {activeTab === "preview" ? (
                    <div className="flex flex-col h-[400px] border-t border-border">
                      <BrowserHeader 
                        onRefresh={handleRefresh} 
                        isRefreshing={isRefreshing}
                        deviceSize={deviceSize}
                        onDeviceChange={setDeviceSize}
                      />
                      <div className="flex-1 overflow-hidden bg-muted/20 flex items-center justify-center w-full transition-all duration-300">
                        {fullHtml ? (
                          <div className="h-full flex items-center justify-center w-full transition-all duration-300">
                            <iframe
                              key={refreshKey}
                              srcDoc={fullHtml}
                              className="h-full border-0 transition-all duration-300"
                              style={{ 
                                width: getIframeWidth(),
                                maxWidth: "100%"
                              }}
                              title="Code Preview"
                            />
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <div className="text-center">
                              <Code2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-xs">No preview available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-[400px] overflow-y-auto px-4 py-4">
                      {isLoading ? (
                        // Loading state
                        <div className="flex h-full items-center justify-center text-muted-foreground py-12">
                          <div className="text-center">
                            <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="text-sm font-medium">{t("codeGenerating")}</p>
                            <p className="text-xs mt-1 opacity-70">{t("codeGeneratingDesc")}</p>
                          </div>
                        </div>
                      ) : !code || code.trim() === "" ? (
                        // Empty state
                        <div className="flex h-full items-center justify-center text-muted-foreground py-12">
                          <div className="text-center">
                            <Code2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">{t("noCodeYet")}</p>
                            <p className="text-xs mt-1 opacity-70">{t("noCodeYetDesc")}</p>
                          </div>
                        </div>
                      ) : (
                        // Code content - Check if code contains markdown code blocks or is raw HTML
                        <div className="prose prose-zinc max-w-none dark:prose-invert">
                          {hasMarkdownBlocks ? (
                            // Code has markdown blocks, use ReactMarkdown
                            <ReactMarkdown
                              components={{
                                h1: ({ ...props }) => (
                                  <h1 {...props} className="mt-5 mb-3 text-3xl font-bold text-foreground" />
                                ),
                                h2: ({ ...props }) => (
                                  <h2 {...props} className="mt-4 mb-2 border-b pb-1 text-2xl font-bold text-foreground" />
                                ),
                                h3: ({ ...props }) => (
                                  <h3 {...props} className="mt-3 mb-1 text-xl font-semibold text-foreground" />
                                ),
                                p: ({ ...props }) => (
                                  <p {...props} className="mb-3 leading-relaxed text-foreground" />
                                ),
                                ul: ({ ...props }) => (
                                  <ul {...props} className="my-3 list-inside list-disc space-y-1 text-foreground" />
                                ),
                                ol: ({ ...props }) => (
                                  <ol {...props} className="my-3 list-inside list-decimal space-y-1 text-foreground" />
                                ),
                                li: ({ ...props }) => <li {...props} className="pl-2" />,
                                strong: ({ ...props }) => (
                                  <strong {...props} className="font-semibold text-foreground" />
                                ),
                                code: ({ className, children, ...props }) => {
                                  const match = /language-(\w+)/.exec(className || "")
                                  return match ? (
                                    <CodeBlock className={className} {...props}>
                                      {String(children).replace(/\n$/, "")}
                                    </CodeBlock>
                                  ) : (
                                    <code className="rounded-md bg-muted px-1.5 py-1 font-mono text-sm text-foreground" {...props}>
                                      {children}
                                    </code>
                                  )
                                },
                                pre: () => null,
                              }}
                            >
                              {code}
                            </ReactMarkdown>
                          ) : (
                            // Raw HTML code, display with syntax highlighting
                            <div className="relative my-4 overflow-hidden rounded-lg border border-border">
                              <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
                                <span className="font-medium">HTML</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(code);
                                    alert('Code copied!');
                                  }}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <pre className="bg-muted p-4 text-sm text-foreground overflow-x-auto">
                                <code className="language-html">{code}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <PublishConfirmDialog />
    </div>
    </>
  )
}

