"use client"

import * as React from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Plus, SendHorizonal, Copy, ThumbsUp, ThumbsDown, RefreshCw, Square, X, Loader2, Zap, AlertTriangle, ChevronUp, ChevronDown, Image as ImageIcon, FileUp, ArrowUpIcon, ShieldAlertIcon, User, Sparkles, Check as IconCheck, Plus as IconPlus } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useAIStore } from "@/app/store/ai-store"
import { cn } from "@/lib/utils"
import { generateAppBuilderSuggestions, AIGeneratedChart, ImagePart } from "@/lib/actions/ai"
import type { StoredMessage } from "@/lib/actions/ai"
import { ChartDisplay } from "@/components/ChartDisplay"
import { TableDisplay } from "@/components/TableDisplay"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
      return <IconBulb className="mr-2 h-4 w-4" />
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

const AIMessage = ({ msg }: { msg: ChatMessage }) => (
  <div className="w-full max-w-prose animate-in fade-in-0 duration-500">
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => (
            <h1
              {...props}
              className="mt-5 mb-3 text-3xl font-bold text-foreground"
            />
          ),
          h2: ({ ...props }) => (
            <h2
              {...props}
              className="mt-4 mb-2 border-b pb-1 text-2xl font-bold text-foreground"
            />
          ),
          h3: ({ ...props }) => (
            <h3
              {...props}
              className="mt-3 mb-1 text-xl font-semibold text-foreground"
            />
          ),
          ul: ({ ...props }) => (
            <ul
              {...props}
              className="my-3 list-inside list-disc space-y-1"
            />
          ),
          ol: ({ ...props }) => (
            <ol
              {...props}
              className="my-3 list-inside list-decimal space-y-1"
            />
          ),
          li: ({ ...props }) => <li {...props} className="pl-2" />,
          a: ({ ...props }) => (
            <a
              {...props}
              className="text-primary underline hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          strong: ({ ...props }) => (
            <strong
              {...props}
              className="font-semibold text-foreground"
            />
          ),
          code: ({ ...props }) => (
            <code
              {...props}
              className="rounded-md bg-muted px-1.5 py-1 font-mono text-sm text-muted-foreground"
            />
          ),
          pre: ({ ...props }) => <CodeBlock {...props} />,
          p: ({ ...props }) => (
            <p {...props} className="mb-3 leading-relaxed" />
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
  isLoading,
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
    if (e.key === "Enter" && !e.shiftKey && !isSubmitDisabled) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  return (
    <div className="flex w-full flex-col items-center">

      {/* ⭐ WRAPPER BARU AGAR MENYATU */}
      <div className="w-full rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">

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
              >
                <IconPlus />
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
         <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/30">
           <p className="text-sm text-white/70">
             {t("upgradeToTeam").split("{plan}")[0]}
             <span className="font-semibold text-white">{t("pro")}</span>
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

const AIStepsDisplay = ({ t }: { t: (key: string) => string }) => {
  const { aiSteps } = useAIStore()
  if (!aiSteps || aiSteps.length === 0) return null

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
              {step.text}
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

// Template Card Component for community templates
const TemplateCard = ({
  template,
  t,
}: {
  template: { id: string; name: string; author: string; avatar?: string }
  t: (key: string) => string
}) => (
  <div className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-lg">
    <div className="relative aspect-[16/9] overflow-hidden">
      <img
        src={`https://picsum.photos/seed/${template.id}/600/338`}
        alt={`${template.name} preview`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Overlay yang muncul saat hover */}
      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Button View Details yang muncul saat hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/90 text-black hover:bg-white"
        >
          {t("viewDetails") || "View Details"}
        </Button>
      </div>
    </div>
    <div className="p-4">
      <div className="mb-2 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={template.avatar}
            alt={template.author}
          />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-sm font-medium">{template.name}</h3>
          <p className="text-xs text-muted-foreground">
            by {template.author}
          </p>
        </div>
      </div>
    </div>
  </div>
)

const CommunityTemplatesSection = ({
  t,
}: {
  t: (key: string) => string
}) => {
  const templates = [
    { id: "1", name: "E-commerce Dashboard", author: "John Doe" },
    { id: "2", name: "Task Management App", author: "Jane Smith" },
    { id: "3", name: "Portfolio Website", author: "Alex Johnson" },
    { id: "4", name: "Blog Platform", author: "Sarah Wilson" },
    { id: "5", name: "Analytics Dashboard", author: "Mike Brown" },
    { id: "6", name: "Social Media App", author: "Emma Davis" },
  ]

  return (
    <div className="mx-auto mt-16 w-full max-w-6xl px-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="text-left">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            {t("fromTheCommunity") || "From the Community"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("exploreCommunity") ||
              "Explore what the community is building with Luminite."}
          </p>
        </div>
        <Button
          variant="ghost"
          className="rounded-full text-xs md:text-sm text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          {t("browseAll") || "Browse All"}
          <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} t={t} />
        ))}
      </div>
    </div>
  )
}

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
  const [expandedResults, setExpandedResults] =
    React.useState<Record<number, boolean>>({})
  const [selectedImageUrl, setSelectedImageUrl] =
    React.useState<string | null>(null)
  const [suggestions, setSuggestions] = React.useState<
    { text: string; icon: string }[]
  >([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] =
    React.useState(true)
  const [apiError, setApiError] = React.useState<string | null>(null)

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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading, aiSteps])

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

  const handlePlusClick = () => fileInputRef.current?.click()

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

    await generate(textPrompt, lang, false, imageParts)
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
    await generate(userPrompt, lang, true, imageParts)
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

      <div className="flex min-h-screen w-full flex-col items-center bg-background">
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
          // EMPTY STATE – hero seperti v0.app
          <>
            <main className="flex w-full flex-grow flex-col items-center justify-center px-4 pb-16 pt-20">
              <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  {t("appBuilderTitle") ||
                    "What do you want to create?"}
                </h1>
                <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
                  {t("appBuilderSubtitle") ||
                    "Start building with a single prompt. No coding needed."}
                </p>

                <div className="w-full max-w-2xl">
                  <FilePreview />
                <InputSection
                  {...{
                    inputValue,
                    setInputValue,
                    handleSubmit,
                    handlePlusClick,
                    isLoading,
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

            {/* Section "From the Community" seperti di screenshot v0 */}
            <div className="w-full px-4 pb-16">
              <CommunityTemplatesSection t={t} />

              {/* Load More Button */}
              <div className="mt-12 flex justify-center">
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-2 text-sm"
                >
                  {t("loadMore") || "Load More"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          // CHAT STATE
          <div className="flex h-0 w-full flex-grow flex-col items-center">
            <div className="flex w-full max-w-4xl flex-grow flex-col space-y-8 overflow-y-auto px-4 pt-6 pb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative flex w-full flex-col gap-2 text-left group",
                    msg.role === "user"
                      ? "items-end"
                      : "items-start",
                  )}
                >
                  {msg.role === "model" &&
                    msg.thinkingResult && (
                      <div className="w-full max-w-prose self-start">
                        <button
                          onClick={() =>
                            setExpandedResults((prev) => ({
                              ...prev,
                              [index]:
                                !prev[index],
                            }))
                          }
                          className="mb-2 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {t("resultThink") ||
                            "Hasil Pemikiran"}{" "}
                          ({msg.thinkingResult.duration}s)
                          {expandedResults[index] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        {expandedResults[index] && (
                          <div className="mb-2 rounded-md border bg-muted/50 p-3 text-sm animate-in fade-in-0">
                            <p className="text-xs italic text-muted-foreground">
                              {(() => {
                                try {
                                  const classification =
                                    msg.thinkingResult
                                      .classification
                                  if (
                                    classification &&
                                    classification.summary
                                  ) {
                                    return classification.summary
                                  }
                                  if (
                                    classification &&
                                    classification.rawResponse
                                  ) {
                                    const rawJson =
                                      classification.rawResponse.match(
                                        /{[\s\S]*}/,
                                      )?.[0] || "{}"
                                    const parsed =
                                      JSON.parse(rawJson)
                                    return (
                                      parsed.summary ||
                                      t("noSummary")
                                    )
                                  }
                                  return t("parseError")
                                } catch {
                                  return t("parseError")
                                }
                              })()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                  {msg.role === "user" ? (
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
                                    alt={`Uploaded ${
                                      imgIndex + 1
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
                  ) : msg.content ===
                    t("generationStopped") ? (
                    <p className="text-sm italic text-muted-foreground">
                      {t("generationStopped")}
                    </p>
                  ) : (
                    <>
                      {msg.content && (
                        <AIMessage msg={msg} />
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
                      <MessageActions
                        msg={msg}
                        onRegenerate={() =>
                          handleRegenerate(index)
                        }
                        t={t}
                      />
                    </>
                  )}
                </div>
              ))}

              {isLoading &&
                messages[messages.length - 1]?.role ===
                  "user" && (
                  <div className="flex w-full flex-col items-start gap-4 text-left group relative">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
                      <p className="text-muted-foreground animate-pulse">
                        {t("thinking")}
                      </p>
                    </div>
                    <AIStepsDisplay t={t} />
                  </div>
                )}

              <div ref={bottomRef} />
            </div>

            <div className="relative w-full max-w-4xl flex-shrink-0 px-4 pb-6">
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
                isLoading={isLoading}
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
        )}
      </div>
    </>
  )
}
