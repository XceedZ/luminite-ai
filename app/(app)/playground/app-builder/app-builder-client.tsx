"use client"

import * as React from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Square, X, Loader2, Zap, AlertTriangle, ChevronDown, ArrowUpIcon, ShieldAlertIcon, User, Check as IconCheck, Plus as IconPlus, Brain, Search, Code2, FileCode, FileText, Bolt as IconBolt, Wand2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useAIStore } from "@/app/store/ai-store"
import { cn } from "@/lib/utils"
import { generateAppBuilderSuggestions, AIGeneratedChart, ImagePart, enhancePrompt } from "@/lib/actions/ai"
import type { StoredMessage } from "@/lib/actions/ai"
import { ChartDisplay } from "@/components/ChartDisplay"
import { TableDisplay } from "@/components/TableDisplay"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { PanelCode } from "@/components/panel-code"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"

// NEW: Imports for Item component
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconDeviceLaptop, IconChartBar, IconBriefcase, IconShoppingCart, IconBulb, IconFileText } from "@tabler/icons-react"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
// END NEW


// --- Helper Components ---

const getSuggestionIcon = (iconName: string) => {
  switch (iconName) {
    case "IconDeviceLaptop":
      return <IconDeviceLaptop className="mr-2 h-4 w-4" />
    case "IconChartBar":
      return <IconChartBar className="mr-2 h-4 w-4" />
    case "IconBriefcase":
      return <IconBriefcase className="mr-2 h-4 w-4" />
    case "IconShoppingCart":
      return <IconShoppingCart className="mr-2 h-4 w-4" />
    case "IconFileText":
      return <IconFileText className="mr-2 h-4 w-4" />
    default:
      return <IconBolt className="mr-2 h-4 w-4" />
  }
}

type ChatMessage = {
  role: "user" | "model"
  content?: string
  images?: string[]
  table?: unknown
  chart?: unknown
  thinkingResult?: {
    duration: number
    classification?: { summary?: string; rawResponse?: string }
  } | null
  actionResult?: {
    title: string
    description?: string
  } | null
}

const CodeBlock = ({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode
  className?: string
  [key: string]: any
}) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""

  const handleCopy = () => {
    const text = typeof children === "string" ? children : ""
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

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
            <IconCheck className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="bg-muted p-4 text-sm text-foreground">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
}

const AIMessage = ({ msg, compact = false }: { msg: ChatMessage; compact?: boolean }) => (
  <div className={cn("w-full max-w-prose animate-in fade-in-0 duration-500", compact && "-my-1")}>
    <div className={cn("prose prose-zinc max-w-none dark:prose-invert", compact && "[&>p:first-child]:!mt-0 [&>p:last-child]:!mb-0")}>
      <ReactMarkdown
        components={{
          h1: (props: any) => (
            <h1
              {...props}
              className="mt-5 mb-3 text-3xl font-bold text-foreground"
            />
          ),
          h2: (props: any) => (
            <h2
              {...props}
              className="mt-4 mb-2 border-b pb-1 text-2xl font-bold text-foreground"
            />
          ),
          h3: (props: any) => (
            <h3
              {...props}
              className="mt-3 mb-1 text-xl font-semibold text-foreground"
            />
          ),
          ul: (props: any) => (
            <ul
              {...props}
              className="my-3 list-inside list-disc space-y-1"
            />
          ),
          ol: (props: any) => (
            <ol
              {...props}
              className="my-3 list-inside list-decimal space-y-1"
            />
          ),
          li: (props: any) => <li {...props} className="pl-2" />,
          a: (props: any) => (
            <a
              {...props}
              className="text-primary underline hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          strong: (props: any) => (
            <strong
              {...props}
              className="font-semibold text-foreground"
            />
          ),
          code: (props: any) => (
            <code
              {...props}
              className="rounded-md bg-muted px-1.5 py-1 font-mono text-sm text-muted-foreground"
            />
          ),
          pre: (props: any) => <CodeBlock {...props} />,
          p: (props: any) => (
            <p {...props} className={cn("mb-3 leading-relaxed", compact && "first:!mt-0 last:!mb-0")} />
          ),
        }}
      >
        {msg.content}
      </ReactMarkdown>
    </div>
  </div>
)

const UserMessageActions = ({
  content,
  t,
}: {
  content: string
  t: (key: string) => string
}) => {
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="absolute -bottom-8 right-0 mt-1 flex items-center gap-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="h-7 w-7 hover:text-foreground"
      >
        <Copy className="h-4 w-4" />
      </Button>
      {isCopied && (
        <span className="ml-1 animate-in fade-in-0 text-xs">
          {t("copied")}
        </span>
      )}
    </div>
  )
}

const MessageActions = ({
  msg,
  onRegenerate,
  t,
}: {
  msg: ChatMessage
  onRegenerate: () => void
  t: (key: string) => string
}) => {
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(
    null,
  )
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopy = () => {
    const textToCopy =
      msg.content ||
      ((msg.table as unknown as { description?: string } | null)
        ?.description) ||
      ((msg.chart as unknown as { description?: string } | null)
        ?.description) ||
      ""

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="mt-2 flex items-center gap-1 text-muted-foreground transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="h-7 w-7 hover:text-foreground"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setFeedback("like")}
        className={cn(
          "h-7 w-7 hover:text-foreground",
          feedback === "like" && "text-primary",
        )}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setFeedback("dislike")}
        className={cn(
          "h-7 w-7 hover:text-foreground",
          feedback === "dislike" && "text-destructive",
        )}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRegenerate}
        className="h-7 w-7 hover:text-foreground"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      {isCopied && (
        <span className="ml-2 animate-in fade-in-0 text-xs">
          {t("copied")}
        </span>
      )}
    </div>
  )
}

/**
 * ⚠️ InputSection **TIDAK DIUBAH** sesuai permintaan.
 */
const InputSection = ({
  inputValue,
  setInputValue,
  handleSubmit,
  handlePlusClick,
  handleEnhancePrompt,
  isLoading,
  isEnhancingPrompt,
  stopGeneration,
  suggestions,
  isLoadingSuggestions,
  t,
  isSubmitDisabled,
  usageText,
  usagePercentage,
  isLimitReached,
}: any) => {

  const handleKeyDown = (e: any) => {
    // Check if device is mobile
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768

    if (e.key === "Enter") {
      // On mobile, Enter always creates new line
      if (isMobile) {
        // Allow default behavior (new line)
        return
      }
      // On desktop, Enter submits (unless Shift is held)
      if (!e.shiftKey && !isSubmitDisabled) {
        e.preventDefault()
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
      }
    }
  }

  return (
    <div className="flex w-full flex-col items-center">

      {/* ⭐ WRAPPER BARU AGAR MENYATU */}
      <div className="w-full rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden">
        {/* ⭐ INPUT TANPA BORDER & TANPA ROUNDED */}
        <form onSubmit={handleSubmit} className="w-full">
          <InputGroup className="rounded-none border-0">
            <InputGroupTextarea
              placeholder={t("createAnything") || "Buat apapun sesuai ide..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || isLimitReached}
              className="max-h-[12rem] resize-none rounded-none border-0"
            />

            <InputGroupAddon align="block-end">
              <InputGroupButton
                type="button"
                variant="outline"
                className="rounded-full"
                size="icon-xs"
                onClick={handlePlusClick}
                disabled={isLoading || isEnhancingPrompt || isLimitReached}
                title={t("attachFile") || "Attach file"}
              >
                <IconPlus />
              </InputGroupButton>

              <InputGroupButton
                type="button"
                variant="outline"
                className="rounded-full"
                size="icon-xs"
                onClick={handleEnhancePrompt}
                disabled={isLoading || isEnhancingPrompt || isLimitReached || !inputValue || inputValue.trim().length === 0}
                title={t("enhancePrompt") || "Enhance prompt"}
              >
                {isEnhancingPrompt ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </InputGroupButton>

              <InputGroupText className="ml-auto flex items-center gap-2">
                <span>{usageText}</span>
              </InputGroupText>

              <Separator orientation="vertical" className="!h-4" />

              {isLoading ? (
                <InputGroupButton
                  type="button"
                  variant="secondary"
                  className="rounded-full"
                  size="icon-xs"
                  onClick={stopGeneration}
                >
                  <Square className="h-4 w-4" />
                </InputGroupButton>
              ) : (
                <InputGroupButton
                  type="submit"
                  variant="default"
                  className="rounded-full"
                  size="icon-xs"
                  disabled={isSubmitDisabled}
                >
                  <ArrowUpIcon className="h-4 w-4" />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          </InputGroup>
        </form>

        {/* ⭐ SECTION UPGRADE — sekarang menyatu */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted">
          <p className="text-sm text-muted-foreground">
            {t("upgradeToTeam").split("{plan}")[0]}
            <span className="font-semibold text-foreground">{t("pro")}</span>
            {t("upgradeToTeam").split("{plan}")[1]}
          </p>

          <Button size="sm" className="flex items-center gap-1">
            {t("upgradePlan")}
          </Button>
        </div>
      </div>

      {/* ⭐ SUGGESTIONS Tetap sama */}
      {(isLoadingSuggestions || (suggestions && suggestions.length > 0)) && (
        <div className="mt-4 w-full overflow-x-auto scrollbar-thin">
          <div className="mx-auto flex w-max items-center gap-2 p-2">
            {isLoadingSuggestions ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("generatingSuggestions")}</span>
              </div>
            ) : (
              suggestions?.map(({ text, icon }: any, index: number) => (
                <Button
                  key={index}
                  variant="secondary"
                  onClick={() => setInputValue(text)}
                  className="h-8 flex-shrink-0 rounded-full text-xs md:text-sm"
                >
                  {getSuggestionIcon(icon)}
                  {text}
                </Button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Extract file names from response text
const extractFileNames = (text: string): string[] => {
  const matches = text.match(/(?:index\.html|styles?\.css|script\.js|\.html|\.css|\.js)/gi)
  if (matches) {
    return [...new Set(matches.map(m => m.toLowerCase()))]
  }
  // Fallback: look for common file patterns
  const commonFiles = text.match(/\b(index\.html|styles?\.css|script\.js|app\.html|main\.html)\b/gi)
  return commonFiles ? [...new Set(commonFiles.map(f => f.toLowerCase()))] : ['index.html']
}

// File Attachment Component for Exploring codebase step
const FileAttachment = ({ files }: { files: string[] }) => {
  const getFileIcon = (fileName: string) => {
    if (fileName.includes('.html')) return <FileCode className="h-3 w-3 text-blue-500" />
    if (fileName.includes('.css')) return <FileText className="h-3 w-3 text-purple-500" />
    if (fileName.includes('.js')) return <FileCode className="h-3 w-3 text-yellow-500" />
    return <FileText className="h-3 w-3 text-muted-foreground" />
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {files.map((file, idx) => (
        <div
          key={idx}
          className="flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-xs"
        >
          {getFileIcon(file)}
          <span className="text-foreground">{file}</span>
        </div>
      ))}
    </div>
  )
}

// Individual AI Step Item - appears one by one like attachment (for app_builder only)
const AIStepItem = ({ step, t }: {
  step: { text: string; status: "pending" | "loading" | "done"; response?: string }
  t: (key: string) => string
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  // Get icon based on step text
  const getStepIcon = (stepText: string) => {
    const iconBaseClasses = "h-4 w-4 flex-shrink-0 text-muted-foreground"
    // Match exact step names used in ai-store.ts
    if (stepText === "Thinking..." || stepText.startsWith("Thought for")) {
      return <Brain className={iconBaseClasses} />
    } else if (stepText === "Exploring codebase structure" || stepText.includes("Exploring codebase")) {
      return <Search className={iconBaseClasses} />
    } else if (stepText === "Coding the final files" || stepText.includes("Coding") || stepText.includes("final files")) {
      return <Code2 className={iconBaseClasses} />
    } else if (stepText === "Adding finishing touches" || stepText.includes("finishing touches")) {
      return <Wand2 className={iconBaseClasses} />
    }
    return <Brain className={iconBaseClasses} />
  }

  const stepResponse = step.response
  const isExploringCodebase = step.text.includes("Exploring codebase")
  const isCodingFinalFiles = step.text.includes("Coding") || step.text.includes("final files")
  const extractedFiles = isExploringCodebase && stepResponse ? extractFileNames(stepResponse) : []

  // Only show if loading or done (not pending) - appears one by one
  if (step.status === "pending") return null

  // Translate step text
  const getTranslatedText = (stepText: string) => {
    // Match exact step names used in ai-store.ts
    if (stepText === "Thinking..." || stepText.startsWith("Thought for")) {
      if (step.status === "loading") {
        return t("thinking")
      } else if (stepText.startsWith("Thought for")) {
        const seconds = stepText.match(/\d+/)?.[0] || "0"
        return t("thoughtFor").replace("{seconds}", seconds)
      }
      return t("thinking")
    } else if (stepText === "Exploring codebase structure" || stepText.includes("Exploring codebase")) {
      return t("exploringCodebase")
    } else if (stepText === "Coding the final files" || stepText.includes("Coding") || stepText.includes("final files")) {
      return t("codingFinalFiles")
    } else if (stepText === "Adding finishing touches" || stepText.includes("finishing touches")) {
      return t("addingFinishingTouches")
    }
    return stepText
  }

  return (
    <div
      className="w-full max-w-prose self-start animate-in fade-in-0 slide-in-from-bottom-1 duration-200 mb-3 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable row - toggle expansion when clicking (not for Coding final files) */}
      <div
        className={cn(
          "flex items-center gap-2.5 text-sm transition-colors group",
          // Only make clickable if not Coding final files and has response
          step.status === "done" && stepResponse && !isCodingFinalFiles && "cursor-pointer hover:text-foreground"
        )}
        onClick={() => {
          // Don't allow expansion for Coding final files
          if (step.status === "done" && stepResponse && !isCodingFinalFiles) {
            setIsExpanded(!isExpanded)
          }
        }}
      >
        {/* Icon - show Brain/icon by default, show ChevronDown on hover if done and has response (not for Coding final files) */}
        <div className="w-4 flex-shrink-0">
          {step.status === "done" && stepResponse && !isCodingFinalFiles && isHovered ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-all" />
          ) : step.status === "loading" ? (
            <div className="relative">
              {getStepIcon(step.text)}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-60"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'shiny-text 1.5s linear infinite',
                  backgroundPosition: '-200% 0',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>
          ) : (
            getStepIcon(step.text)
          )}
        </div>
        <span
          className={cn(
            "transition-colors text-sm flex-1",
            step.status === "done"
              ? isHovered && stepResponse && !isCodingFinalFiles ? "text-foreground" : "text-muted-foreground"
              : step.status === "loading"
                ? "text-foreground"
                : "text-foreground",
          )}
        >
          {step.status === "loading" ? (
            <AnimatedShinyText className="text-sm" shimmerWidth={150}>{getTranslatedText(step.text)}</AnimatedShinyText>
          ) : (
            getTranslatedText(step.text)
          )}
        </span>
      </div>
      {/* Expanded content - show as divider line with content beside it, not in card (not for Coding final files) */}
      {isExpanded && stepResponse && !isCodingFinalFiles && (
        <div className="mt-2 flex items-stretch gap-2.5 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          {/* Spacer untuk sejajar dengan icon (w-4 = 16px) - struktur sama persis dengan icon container */}
          <div className="w-4 flex-shrink-0 flex items-center justify-center">
            {/* Vertical divider line - sejajar dengan icon (di tengah w-4 container), tinggi mengikuti konten */}
            <div className="w-px bg-border h-full" />
          </div>
          {/* Content beside the line - dengan scroll jika terlalu panjang */}
          <div className="flex-1 min-w-0 max-h-[400px] relative">
            {/* Gradient fade di bawah */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
            {/* Scroll container */}
            <div className="overflow-y-auto pr-2 h-full scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {/* Show file attachments for Exploring codebase step */}
              {isExploringCodebase && extractedFiles.length > 0 && (
                <div className="mb-4">
                  <FileAttachment files={extractedFiles} />
                </div>
              )}
              <div className="text-muted-foreground prose prose-zinc max-w-none dark:prose-invert prose-p:text-muted-foreground prose-headings:text-muted-foreground prose-strong:text-muted-foreground prose-code:text-muted-foreground">
                <ReactMarkdown
                  components={{
                    h1: (props: any) => (
                      <h1 {...props} className="mt-5 mb-3 text-3xl font-bold text-muted-foreground" />
                    ),
                    h2: (props: any) => (
                      <h2 {...props} className="mt-4 mb-2 border-b border-border pb-1 text-2xl font-bold text-muted-foreground" />
                    ),
                    h3: (props: any) => (
                      <h3 {...props} className="mt-3 mb-1 text-xl font-semibold text-muted-foreground" />
                    ),
                    p: (props: any) => (
                      <p {...props} className="mb-3 leading-relaxed text-muted-foreground" />
                    ),
                    strong: (props: any) => (
                      <strong {...props} className="font-semibold text-muted-foreground" />
                    ),
                    code: (props: any) => (
                      <code {...props} className="rounded-md bg-muted px-1.5 py-1 font-mono text-sm text-muted-foreground" />
                    ),
                    pre: (props: any) => <CodeBlock {...props} />,
                    ul: (props: any) => (
                      <ul {...props} className="my-3 list-inside list-disc space-y-1 text-muted-foreground" />
                    ),
                    ol: (props: any) => (
                      <ol {...props} className="my-3 list-inside list-decimal space-y-1 text-muted-foreground" />
                    ),
                    li: (props: any) => <li {...props} className="pl-2 text-muted-foreground" />,
                    a: (props: any) => (
                      <a
                        {...props}
                        className="text-muted-foreground underline hover:opacity-80"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {stepResponse}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// App Builder AI Steps - displays steps one by one like attachments
const AppBuilderAISteps = ({
  onCodeCardClick,
  projectName,
  t,
  showOnlyFirstTwo = false,
  showFinalStep = false
}: {
  onCodeCardClick: () => void
  projectName?: string | null
  t: (key: string) => string
  showOnlyFirstTwo?: boolean
  showFinalStep?: boolean
}) => {
  const { aiSteps } = useAIStore()
  if (!aiSteps || aiSteps.length === 0) return null

  // Check if coding step exists
  const codingStep = aiSteps.find(step =>
    step.text.includes("Coding") || step.text.includes("final files")
  )
  const isCodingStepDone = codingStep?.status === "done"

  // Check if finishing touches step exists
  const finishingStep = aiSteps.find(step =>
    step.text.includes("Adding finishing touches") || step.text.includes("finishing touches")
  )
  const isFinishingStepDone = finishingStep?.status === "done"

  // Show steps based on mode
  const stepsToShow = showOnlyFirstTwo
    ? aiSteps.slice(0, 2) // Only Thought and Exploring codebase
    : showFinalStep && codingStep && !isCodingStepDone
      ? [codingStep] // Only coding step (if not done yet)
      : showFinalStep && isCodingStepDone && finishingStep && !isFinishingStepDone
        ? [codingStep, finishingStep] // Show both coding (done) and finishing (loading)
        : isFinishingStepDone
          ? aiSteps.filter(step => !step.text.includes("Coding") && !step.text.includes("final files") && !step.text.includes("finishing touches")) // Hide coding and finishing steps if all done
          : aiSteps // All steps

  return (
    <div className="w-full max-w-prose self-start">
      {stepsToShow.map((step, index) => (
        step && (
          <AIStepItem
            key={index}
            step={step}
            t={t}
          />
        )
      ))}
    </div>
  )
}

// Original AIStepsDisplay for non-app_builder modes (with card wrapper)
const AIStepsDisplay = ({ t }: { t: (key: string) => string }) => {
  const { aiSteps } = useAIStore()
  if (!aiSteps || aiSteps.length === 0) return null

  // Check if this is app_builder mode (4 specific steps - no classification)
  const isAppBuilder = aiSteps.length >= 3 &&
    (aiSteps[0]?.text === 'Thinking...' || aiSteps[0]?.text?.includes('Thought for')) &&
    aiSteps[1]?.text === 'Exploring codebase structure' &&
    aiSteps[2]?.text === 'Coding the final files'

  // If app_builder, use the new component (without card)
  // Note: We need to pass onCodeCardClick and projectName, but AIStepsDisplay doesn't have access to them
  // So we'll handle this in the parent component instead
  if (isAppBuilder) {
    return null // Will be handled by AppBuilderAISteps in parent
  }

  // For other modes, use card wrapper
  const getStepIcon = (
    status: "pending" | "loading" | "done",
  ) => {
    const iconBaseClasses = "h-4 w-4 flex-shrink-0"
    switch (status) {
      case "loading":
        return (
          <Loader2
            className={cn(
              iconBaseClasses,
              "animate-spin text-primary",
            )}
          />
        )
      case "done":
        return (
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
            className={cn(
              iconBaseClasses,
              "text-green-500",
            )}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )
      default:
        return (
          <div
            className={cn(
              iconBaseClasses,
              "flex items-center justify-center",
            )}
          >
            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-prose self-start rounded-md border bg-muted/50 p-3 text-sm animate-in fade-in-0">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">
        {t("aiPlan")}
      </p>
      <div className="space-y-2">
        {aiSteps.map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >
            {getStepIcon(step.status)}
            <span
              className={cn(
                "transition-colors",
                step.status === "pending"
                  ? "text-muted-foreground"
                  : "text-foreground",
              )}
            >
              {step.status === "loading" ? (
                <AnimatedShinyText className="text-sm" shimmerWidth={150}>{step.text}</AnimatedShinyText>
              ) : (
                step.text
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const QuotaErrorNotification = ({
  onDismiss,
  t,
}: {
  onDismiss: () => void
  t: (key: string) => string
}) => (
  <div className="absolute bottom-full mb-4 w-full animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
    <div className="rounded-lg border bg-background/95 p-3 shadow-lg ring-1 ring-yellow-500/50 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {t("quotaTitle") ||
              "Batas Penggunaan Gratis Tercapai"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("quotaMessage") ||
              "Upgrade ke Pro untuk melanjutkan percakapan tanpa batas."}
          </p>
          <Button className="mt-3 h-8 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
            <Zap className="mr-2 h-4 w-4" />
            {t("upgradeButton") || "Upgrade ke Pro"}
          </Button>
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
)

const ChatLimitNotification = ({
  t,
  onStartNewChat,
}: {
  t: (key: string) => string
  onStartNewChat: () => void
}) => (
  <div className="mb-4">
    <Item variant="outline">
      <ItemMedia variant="icon">
        <ShieldAlertIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{t("chatLimitTitle")}</ItemTitle>
        <ItemDescription>
          {t("chatLimitDescription")}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          size="sm"
          variant="secondary"
          className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onStartNewChat}
        >
          {t("chatLimitButton")}
        </Button>
      </ItemActions>
    </Item>
  </div>
)

const PageLoader = () => (
  <div className="flex h-full w-full flex-col items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

// --- Main Component ---

export default function AppBuilderClientUI() {
  const { t, lang } = useLanguage()

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  const [inputValue, setInputValue] = React.useState("")
  const [uploadedFiles, setUploadedFiles] = React.useState<
    { file: File; previewUrl: string }[]
  >([])
  const [selectedImageUrl, setSelectedImageUrl] =
    React.useState<string | null>(null)
  const [suggestions, setSuggestions] = React.useState<
    { text: string; icon: string }[]
  >([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] =
    React.useState(true)
  const [isEnhancingPrompt, setIsEnhancingPrompt] = React.useState(false)
  const [apiError, setApiError] = React.useState<string | null>(null)
  const [isCodePanelOpen, setIsCodePanelOpen] = React.useState(false)
  const [finalCode, setFinalCode] = React.useState<string | undefined>(undefined)
  const [sessionTitle, setSessionTitle] = React.useState<string | null>(null)
  const [previewWidth, setPreviewWidth] = React.useState(50) // Default 50% width (balanced for chat and preview)
  const [isResizing, setIsResizing] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [heroIndex] = React.useState(() => Math.floor(Math.random() * 5))
  const resizeHandleRef = React.useRef<HTMLDivElement>(null)

  // Detect mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const {
    messages,
    isLoading,
    isHistoryLoading,
    generate,
    stopGeneration,
    addMessage,
    startNewChat,
    error: storeError,
    aiSteps,
    currentSessionId,
    chatSessions,
  } = useAIStore()

  const CHAT_LIMIT = 8
  const hasReachedLimit = messages.length >= CHAT_LIMIT
  const usagePercentage = Math.round(
    (messages.length / CHAT_LIMIT) * 100,
  )
  const usageText = `${usagePercentage}% ${t("used")}`

  React.useEffect(() => {
    startNewChat()
  }, [startNewChat])

  React.useEffect(() => {
    if (
      storeError &&
      (storeError.includes("RESOURCE_EXHAUSTED") ||
        storeError.includes('"code":429'))
    ) {
      setApiError("QUOTA_EXCEEDED")
      useAIStore.setState({ error: null })
    }
  }, [storeError])


  React.useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true)
      try {
        const suggestionData = await generateAppBuilderSuggestions()
        setSuggestions(suggestionData)
      } catch (error) {
        console.error("Failed to fetch app builder suggestions:", error)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }
    fetchSuggestions()
  }, [])

  React.useEffect(() => {
    // Don't scroll if preview panel is open (prevents bug where preview jumps to top)
    if (!isCodePanelOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading, aiSteps, isCodePanelOpen])

  // Load session title when sessionId changes
  React.useEffect(() => {
    const loadSessionTitle = async () => {
      if (currentSessionId) {
        // Try to get title from chatSessions first (faster)
        const session = chatSessions.find(s => s.id === currentSessionId)
        if (session) {
          setSessionTitle(session.title)
        } else {
          // Fallback: fetch from server
          const { getChatSession } = await import("@/lib/actions/ai")
          const sessionData = await getChatSession(currentSessionId)
          if (sessionData) {
            setSessionTitle(sessionData.title)
          }
        }
      } else {
        setSessionTitle(null)
      }
    }
    loadSessionTitle()
  }, [currentSessionId, chatSessions])

  // Load existing code and steps when session is initialized or final step is done
  React.useEffect(() => {
    const finalStep = aiSteps.find(step =>
      step.text.includes("Coding") || step.text.includes("final files") || step.text.includes("Membuat kode final")
    )

    // Debug logging
    console.log('[App Builder Debug] useEffect triggered:', {
      hasFinalCode: !!finalCode,
      finalCodeLength: finalCode?.length || 0,
      finalCodePreview: finalCode ? finalCode.substring(0, 100) : 'none',
      finalStepStatus: finalStep?.status,
      finalStepHasResponse: !!finalStep?.response,
      finalStepResponseLength: finalStep?.response?.length || 0,
      aiStepsCount: aiSteps.length,
      isLoading,
      currentSessionId
    })

    if (finalStep?.status === "done" && finalStep?.response) {
      // Step is done, check if we need to update finalCode
      const needsUpdate = !finalCode || finalCode !== finalStep.response

      if (needsUpdate) {
        console.log('[App Builder] ✅ Setting final code from AI step', {
          from: finalCode ? 'updating' : 'initial',
          responseLength: finalStep.response.length,
          responsePreview: finalStep.response.substring(0, 150)
        })
        setFinalCode(finalStep.response)
      } else {
        console.log('[App Builder] ✓ Final code already synchronized')
      }
    } else if (finalStep?.status === "done" && !finalStep?.response) {
      console.error('[App Builder] ❌ Final step done but NO RESPONSE! This should not happen.')
    } else if (currentSessionId && !finalCode && !isLoading && aiSteps.length === 0) {
      // Only load from Upstash when session is first initialized (not after save)
      const loadExistingData = async () => {
        console.log('[App Builder] 📥 Loading existing session from Upstash...')
        const { getCodeFromUpstash, getAIStepsFromUpstash } = await import("@/lib/actions/ai")

        // Load code
        const existingCode = await getCodeFromUpstash(currentSessionId)
        if (existingCode) {
          console.log('[App Builder] ✅ Loaded code from Upstash:', existingCode.substring(0, 100))
          setFinalCode(existingCode)
        } else {
          console.log('[App Builder] ℹ️ No existing code in Upstash')
        }

        // Load steps
        const existingSteps = await getAIStepsFromUpstash(currentSessionId)
        if (existingSteps && existingSteps.length > 0) {
          console.log('[App Builder] ✅ Loaded steps from Upstash:', existingSteps.length)
          useAIStore.setState({ aiSteps: existingSteps })
        }
      }
      loadExistingData()
    }
  }, [aiSteps, currentSessionId, isLoading])

  const fileToBase64 = (file: File): Promise<ImagePart> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        const data = result.split(",")[1]
        resolve({ mimeType: file.type, data })
      }
      reader.onerror = (error) => reject(error)
    })

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const handle = resizeHandleRef.current
      if (!handle) return

      const container = handle.parentElement
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const newWidth = ((containerRect.right - e.clientX) / containerRect.width) * 100

      // Limit width between 30% and 80%
      const clampedWidth = Math.max(30, Math.min(80, newWidth))
      setPreviewWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const handlePlusClick = () => fileInputRef.current?.click()

  const handleEnhancePrompt = React.useCallback(async () => {
    if (!inputValue || inputValue.trim().length === 0 || isEnhancingPrompt) {
      return
    }

    setIsEnhancingPrompt(true)
    try {
      const enhanced = await enhancePrompt(inputValue, lang)
      setInputValue(enhanced)
    } catch (error) {
      console.error("Failed to enhance prompt:", error)
      // Keep original prompt on error
    } finally {
      setIsEnhancingPrompt(false)
    }
  }, [inputValue, lang, isEnhancingPrompt])

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files
    if (!files) return
    const newFiles = Array.from(files).slice(
      0,
      5 - uploadedFiles.length,
    )
    const filePreviews = newFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setUploadedFiles((prev) => [...prev, ...filePreviews])
    event.target.value = ""
  }

  const handleRemoveFile = (indexToRemove: number) => {
    URL.revokeObjectURL(uploadedFiles[indexToRemove].previewUrl)
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasReachedLimit) return
    setApiError(null)
    const textPrompt = inputValue.trim()
    if (
      (textPrompt.length < 1 && uploadedFiles.length === 0) ||
      isLoading
    )
      return

    const filesToSubmit = [...uploadedFiles]
    setInputValue("")
    setUploadedFiles([])
    filesToSubmit.forEach((f) =>
      URL.revokeObjectURL(f.previewUrl),
    )

    const imageParts = await Promise.all(
      filesToSubmit.map((f) => fileToBase64(f.file)),
    )

    const imageDataUrls = imageParts.map(
      (part) => `data:${part.mimeType};base64,${part.data}`,
    )

    addMessage({
      role: "user" as const,
      content: textPrompt,
      images: imageDataUrls,
    })

    await generate(textPrompt, lang, false, imageParts, [], 'app_builder')
  }

  const handleRegenerate = async (index: number) => {
    const lastUserMessage = messages[index - 1]
    if (
      !lastUserMessage ||
      lastUserMessage.role !== "user" ||
      isLoading
    )
      return
    const userPrompt = lastUserMessage.content
    let imageParts: ImagePart[] = []

    if (lastUserMessage.images?.length) {
      imageParts = await Promise.all(
        lastUserMessage.images.map(async (imgSrc) => {
          const response = await fetch(imgSrc)
          const blob = await response.blob()
          const file = new File([blob], "image.jpg", {
            type: blob.type,
          })
          return fileToBase64(file)
        }),
      )
    }

    useAIStore.setState((state) => ({
      messages: state.messages.slice(0, index),
    }))
    await generate(userPrompt, lang, true, imageParts, [], 'app_builder')
  }

  const isSubmitDisabled =
    isLoading ||
    (inputValue.trim().length < 1 && uploadedFiles.length === 0) ||
    hasReachedLimit

  const FilePreview = () =>
    uploadedFiles.length > 0 ? (
      <div className="mb-3 flex gap-3 px-2">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="relative">
            <button
              onClick={() =>
                setSelectedImageUrl(file.previewUrl)
              }
              className="overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <img
                src={file.previewUrl}
                alt={`Preview ${index + 1}`}
                width={80}
                height={80}
                className="h-20 w-20 object-cover transition-transform hover:scale-105"
              />
            </button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
              onClick={() => handleRemoveFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    ) : null

  if (isHistoryLoading) {
    return <PageLoader />
  }

  return (
    <>
      <Sheet
        open={!!selectedImageUrl}
        onOpenChange={(isOpen) =>
          !isOpen && setSelectedImageUrl(null)
        }
      >
        <SheetContent className="w-[80vw] sm:max-w-3xl">
          <SheetHeader>
            <SheetTitle>
              {t("imagePreview") || "Image Preview"}
            </SheetTitle>
          </SheetHeader>
          {selectedImageUrl && (
            <div className="mt-4">
              <img
                src={selectedImageUrl}
                alt="Image Preview"
                className="max-h-[80vh] w-full object-contain"
              />
            </div>
          )}
        </SheetContent>
      </Sheet>



      <div className="flex flex-col items-center h-full w-full bg-background transition-all duration-300 overflow-hidden">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
          aria-label="Upload image files"
        />

        {/* soft glow background */}
        <div
          className="pointer-events-none fixed left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />

        {messages.length === 0 &&
          !isLoading &&
          !isHistoryLoading ? (
          // EMPTY STATE – modern hero dengan background gradient
          <div className="relative flex flex-col flex-grow w-full h-0 items-center justify-center overflow-y-auto">
            {/* Modern gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <main className="relative flex w-full flex-col items-center justify-center px-4">
              <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  {t(`appBuilderTitle${heroIndex + 1}`) || t("appBuilderTitle") || "What do you want to create?"}
                </h1>
                <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                  {t(`appBuilderSubtitle${heroIndex + 1}`) || t("appBuilderSubtitle") || "Start building with a single prompt. No coding needed."}
                </p>

                <div className="w-full max-w-2xl">
                  <FilePreview />
                  <InputSection
                    {...{
                      inputValue,
                      setInputValue,
                      handleSubmit,
                      handlePlusClick,
                      handleEnhancePrompt,
                      isLoading,
                      isEnhancingPrompt,
                      stopGeneration: () =>
                        stopGeneration(
                          t("generationStopped"),
                        ),
                      suggestions,
                      isLoadingSuggestions,
                      t,
                      isSubmitDisabled,
                    }}
                    usageText={usageText}
                    usagePercentage={usagePercentage}
                    isLimitReached={hasReachedLimit}
                  />
                </div>
              </div>
            </main>
          </div>
        ) : (
          // CHAT STATE
          <div className={cn(
            "flex flex-grow w-full h-0",
            isCodePanelOpen ? "flex-row" : "flex-col items-center"
          )}>
            {/* Chat container - hidden on mobile when preview is open */}
            <div
              className={cn(
                "flex flex-col flex-grow h-full relative",
                isCodePanelOpen ? "border-r border-border md:block hidden" : "w-full max-w-4xl"
              )}
              style={isCodePanelOpen && !isMobile ? { width: `${100 - previewWidth}%` } : undefined}
            >
              {/* Messages container - scrollable */}
              <div className="flex-1 overflow-y-auto space-y-4 pt-4 pb-4 overflow-x-hidden px-6">
                {/* Show messages */}
                {messages.map((msg, index) => {
                  const isAppBuilderMode = aiSteps && aiSteps.length >= 3 &&
                    (aiSteps[0]?.text === 'Thinking...' || aiSteps[0]?.text?.includes('Thought for')) &&
                    aiSteps[1]?.text === 'Exploring codebase structure' &&
                    aiSteps[2]?.text === 'Coding the final files'

                  // Check if this is the implementation plan message (first model message after user message)
                  // Implementation plan is the first model message that appears after user message and before coding step
                  const isImplementationPlan = msg.role === 'model' &&
                    index > 0 &&
                    messages[index - 1]?.role === 'user' &&
                    isAppBuilderMode &&
                    // Check if this message is not from coding step (coding step response is saved separately)
                    !msg.content?.includes('```html') &&
                    !msg.content?.includes('```css') &&
                    !msg.content?.includes('```javascript') &&
                    !msg.content?.includes('```js')

                  return (
                    <React.Fragment key={index}>
                      {msg.role === "user" ? (
                        <>
                          <div
                            className={cn(
                              "relative flex w-full flex-col gap-2 text-left group",
                              "items-end"
                            )}
                          >
                            <div className="relative">
                              {msg.images &&
                                msg.images.length > 0 && (
                                  <div className="mb-2 flex max-w-prose flex-wrap justify-end gap-2">
                                    {msg.images.map(
                                      (imgSrc, imgIndex) => (
                                        <button
                                          key={imgIndex}
                                          onClick={() =>
                                            setSelectedImageUrl(
                                              imgSrc,
                                            )
                                          }
                                          className="overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                        >
                                          <img
                                            src={imgSrc}
                                            alt={`Uploaded ${imgIndex + 1
                                              }`}
                                            width={120}
                                            height={120}
                                            className="rounded-md object-cover transition-transform hover:scale-105"
                                          />
                                        </button>
                                      ),
                                    )}
                                  </div>
                                )}
                              {msg.content && (
                                <div className="max-w-prose rounded-lg bg-zinc-200 px-4 py-3 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                                  <p className="whitespace-pre-wrap">
                                    {msg.content}
                                  </p>
                                </div>
                              )}
                              {msg.content && (
                                <UserMessageActions
                                  content={msg.content}
                                  t={t}
                                />
                              )}
                            </div>
                          </div>

                          {/* Show AI Steps (Thought and Exploring codebase) AFTER user message */}
                          {isAppBuilderMode && (isLoading || (aiSteps && aiSteps.length > 0)) && (
                            <div className="flex w-full flex-col items-start gap-0 text-left group relative mt-6">
                              <AppBuilderAISteps
                                onCodeCardClick={() => setIsCodePanelOpen(true)}
                                projectName={sessionTitle}
                                t={t}
                                showOnlyFirstTwo={true}
                              />
                            </div>
                          )}
                        </>
                      ) : msg.content ===
                        t("generationStopped") ? (
                        <p className="text-sm italic text-muted-foreground">
                          {t("generationStopped")}
                        </p>
                      ) : (
                        <>
                          {/* Always show model messages (including implementation plan) */}
                          <div
                            className={cn(
                              "relative flex w-full flex-col gap-2 text-left group",
                              "items-start",
                              // Reduce spacing if this is implementation plan (comes right after Exploring codebase step)
                              isImplementationPlan && "-mt-1"
                            )}
                          >
                            {msg.content && (
                              <AIMessage msg={msg} compact={isImplementationPlan} />
                            )}
                            {msg.content &&
                              (msg.table || msg.chart) && (
                                <div className="my-4 w-full max-w-prose border-t border-border" />
                              )}
                            {msg.table && (
                              <div className="w-full max-w-prose self-start">
                                <TableDisplay table={msg.table} />
                              </div>
                            )}
                            {msg.chart && (
                              <div className="w-full max-w-prose self-start">
                                <ChartDisplay
                                  chart={
                                    msg.chart as AIGeneratedChart
                                  }
                                />
                              </div>
                            )}

                            {/* Show final steps (Coding & Finishing touches) if still loading, or card if done (card opens Sheet from right) INSIDE implementation plan container, before MessageActions */}
                            {isImplementationPlan && isAppBuilderMode && (() => {
                              const codingStep = aiSteps?.find(step =>
                                step.text.includes("Coding") || step.text.includes("final files")
                              )
                              const finishingStep = aiSteps?.find(step =>
                                step.text.includes("Adding finishing touches") || step.text.includes("finishing touches")
                              )
                              const isCodingStepDone = codingStep?.status === "done"
                              const isCodingStepLoading = codingStep?.status === "loading"
                              const isFinishingStepLoading = finishingStep?.status === "loading"
                              const isFinishingStepDone = finishingStep?.status === "done"

                              // Show steps if any is still loading
                              if (isCodingStepLoading || (isCodingStepDone && isFinishingStepLoading)) {
                                return (
                                  <div className="flex w-full flex-col items-start gap-2 text-left group relative mt-4">
                                    <AppBuilderAISteps
                                      onCodeCardClick={() => setIsCodePanelOpen(true)}
                                      projectName={sessionTitle}
                                      t={t}
                                      showFinalStep={true}
                                    />
                                  </div>
                                )
                              }

                              // If all done, show button that opens Sheet from right (hide steps)
                              if (isCodingStepDone && isFinishingStepDone && finalCode) {
                                // Show button without container, hover effect only
                                return (
                                  <div className="flex w-full flex-col items-start gap-2 text-left group relative mt-4">
                                    <button
                                      onClick={() => setIsCodePanelOpen(prev => !prev)}
                                      className="w-full max-w-prose self-start text-left p-2 -mx-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group/button"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                          <Code2 className="h-5 w-5 text-muted-foreground group-hover/button:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-semibold text-foreground group-hover/button:text-primary transition-colors">
                                            {sessionTitle || "Created Luminite AI landing page v1"}
                                          </div>
                                          <div className="text-sm text-muted-foreground mt-1">
                                            {isCodePanelOpen ? (t("clickToCloseCode") || "Click to close preview") : t("clickToViewCode")}
                                          </div>
                                        </div>
                                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform", isCodePanelOpen ? "rotate-90deg" : "rotate-[-90deg]")} />
                                      </div>
                                    </button>
                                  </div>
                                )
                              }

                              return null
                            })()}

                            {/* Hide MessageActions if final steps are still loading */}
                            {(() => {
                              const codingStep = aiSteps?.find(step =>
                                step.text.includes("Coding") || step.text.includes("final files")
                              )
                              const finishingStep = aiSteps?.find(step =>
                                step.text.includes("Adding finishing touches") || step.text.includes("finishing touches")
                              )
                              const isCodingStepLoading = codingStep?.status === "loading"
                              const isFinishingStepLoading = finishingStep?.status === "loading"

                              // Hide actions if this is implementation plan and any step is still loading
                              if (isImplementationPlan && isAppBuilderMode && (isCodingStepLoading || isFinishingStepLoading)) {
                                return null
                              }

                              return (
                                <MessageActions
                                  msg={msg}
                                  onRegenerate={() =>
                                    handleRegenerate(index)
                                  }
                                  t={t}
                                />
                              )
                            })()}
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  )
                })}

                <div ref={bottomRef} />
              </div>

              {/* Input Section - sticky at bottom */}
              <div className="w-full flex-shrink-0 bg-background sticky bottom-0 z-10 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {apiError === "QUOTA_EXCEEDED" && (
                  <QuotaErrorNotification
                    onDismiss={() => setApiError(null)}
                    t={t}
                  />
                )}

                {hasReachedLimit && (
                  <div className="mb-3">
                    <ChatLimitNotification
                      t={t}
                      onStartNewChat={() => {
                        startNewChat()
                        const current =
                          typeof window !== "undefined"
                            ? window.location.pathname
                            : ""
                        if (
                          !current.startsWith(
                            "/playground/app-builder",
                          )
                        ) {
                          window.history.replaceState(
                            {},
                            "",
                            "/playground/app-builder",
                          )
                        }
                      }}
                    />
                  </div>
                )}

                <FilePreview />
                <InputSection
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  handleSubmit={handleSubmit}
                  handlePlusClick={handlePlusClick}
                  handleEnhancePrompt={handleEnhancePrompt}
                  isLoading={isLoading}
                  isEnhancingPrompt={isEnhancingPrompt}
                  stopGeneration={() =>
                    stopGeneration(t("generationStopped"))
                  }
                  suggestions={[]}
                  isLoadingSuggestions={false}
                  t={t}
                  isSubmitDisabled={isSubmitDisabled}
                  usageText={usageText}
                  usagePercentage={usagePercentage}
                  isLimitReached={hasReachedLimit}
                />
              </div>
            </div>

            {/* Resize Handle - hidden on mobile */}
            {isCodePanelOpen && finalCode && (
              <div
                ref={resizeHandleRef}
                onMouseDown={handleMouseDown}
                className={cn(
                  "w-1 flex-shrink-0 cursor-col-resize relative z-20 group hidden md:block",
                  isResizing ? "bg-primary/50" : "bg-transparent hover:bg-primary/20"
                )}
              >
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-border group-hover:bg-primary transition-colors" />
              </div>
            )}

            {/* Code Preview Panel - part of main layout (not overlay) */}
            {isCodePanelOpen && finalCode && (
              <div
                className={cn(
                  "flex-shrink-0 h-full w-full md:w-auto",
                  !isMobile && "border-l border-border"
                )}
                style={{
                  width: isMobile ? '100%' : `${previewWidth}%`,
                  minWidth: isMobile ? '100%' : '300px',
                  maxWidth: '100%'
                }}
              >
                <PanelCode
                  code={finalCode}
                  isOpen={isCodePanelOpen}
                  onClose={() => setIsCodePanelOpen(false)}
                  projectName={sessionTitle || "Preview"}
                  sessionId={currentSessionId}
                  variant="full"
                  showActions={true}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
