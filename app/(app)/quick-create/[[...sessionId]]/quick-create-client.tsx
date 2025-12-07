"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, SendHorizonal, Copy, ThumbsUp, ThumbsDown, RefreshCw, Square, X, Loader2, Zap, AlertTriangle, ChevronUp, ChevronDown, Image as ImageIcon, FileUp, ChevronDown as ChevronDownIcon, ArrowUpIcon, ShieldAlertIcon, AtSign, Bot as BotIcon } from "lucide-react" // MODIFIED: Added ShieldAlertIcon and AtSign, BotIcon, ChevronDownIcon
import ReactMarkdown from "react-markdown"
import { useAIStore } from "@/app/store/ai-store"
import { cn } from "@/lib/utils"
import { generateSuggestions, AIGeneratedChart, ImagePart } from "@/lib/actions/ai"
import type { StoredMessage } from "@/lib/actions/ai"
import { ChartDisplay } from "@/components/ChartDisplay";
import { TableDisplay } from "@/components/TableDisplay";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Imports from new component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { CircularProgress } from "@/components/customized/progress/progress-07"
import { Switch } from "@/components/ui/switch"
import { ButtonGroup } from "@/components/ui/button-group"
// removed command dialog imports in favor of dropdown menu for context selection
// End of imports from new component

// NEW: Imports for Item component
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
// END NEW

import {
  IconBolt, IconCash, IconCashMove, IconCashBanknote, IconCashRegister, IconReceipt2, IconReportMoney, IconChartBar, IconChartPie, IconChartHistogram, IconChartLine, IconShoppingCart, IconShoppingBag, IconCreditCard, IconCreditCardPay, IconCreditCardRefund, IconCalendarStats, IconCalendarEvent, IconPigMoney, IconBuildingBank, IconBuildingStore, IconFileInvoice, IconFileSpreadsheet, IconFileText, IconBriefcase, IconUsers, IconUserDollar, IconUserCheck, IconUserCog, IconCurrencyDollar, IconCurrencyEuro, IconCurrencyBitcoin, IconCurrencyRupee, IconCurrencyYen, IconWallet, IconClipboardList, IconClipboardText, IconTarget, IconGauge, IconTrendingUp, IconTrendingDown, IconBulb, IconNotes, IconListCheck, IconDatabase, IconSettings, IconWorld, IconServer, IconCloud,
  IconPlus, IconCheck
} from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";


// --- Helper Components ---

const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  IconBolt, IconCash, IconCashMove, IconCashBanknote, IconCashRegister, IconReceipt2, IconReportMoney, IconChartBar, IconChartPie, IconChartHistogram, IconChartLine, IconShoppingCart, IconShoppingBag, IconCreditCard, IconCreditCardPay, IconCreditCardRefund, IconCalendarStats, IconCalendarEvent, IconPigMoney, IconBuildingBank, IconBuildingStore, IconFileInvoice, IconFileSpreadsheet, IconFileText, IconBriefcase, IconUsers, IconUserDollar, IconUserCheck, IconUserCog, IconCurrencyDollar, IconCurrencyEuro, IconCurrencyBitcoin, IconCurrencyRupee, IconCurrencyYen, IconWallet, IconClipboardList, IconClipboardText, IconTarget, IconGauge, IconTrendingUp, IconTrendingDown, IconBulb, IconNotes, IconListCheck, IconDatabase, IconSettings, IconWorld, IconServer, IconCloud,
};

const DynamicIcon = ({ name }: { name: string }) => {
  const IconComponent = ICON_MAP[name] ?? IconBulb;
  return <IconComponent className="mr-2 h-4 w-4" />;
};

type ChatMessage = {
  role: 'user' | 'model';
  content?: string;
  images?: string[];
  table?: unknown;
  chart?: unknown;
  thinkingResult?: { duration: number; classification?: { summary?: string; rawResponse?: string } } | null;
};

const CodeBlock = ({ children, className, ...props }: { children?: React.ReactNode; className?: string;[key: string]: any }) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = () => {
    const text = typeof children === 'string' ? children : '';
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between bg-muted px-4 py-2 text-sm text-muted-foreground border-b border-border">
        <span className="font-medium">{language ? language.toUpperCase() : 'CODE'}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80"
        >
          {isCopied ? <IconCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="bg-muted text-foreground p-4 overflow-x-auto text-sm">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
};

const AIMessage = ({ msg }: { msg: ChatMessage }) => (
  <div className="w-full max-w-prose animate-in fade-in-0 duration-500">
    <div className="max-w-none prose prose-zinc dark:prose-invert">
      <ReactMarkdown
        components={{
          h1: (props: any) => <h1 {...props} className="text-3xl font-bold mt-5 mb-3 text-foreground" />,
          h2: (props: any) => <h2 {...props} className="text-2xl font-bold mt-4 mb-2 text-foreground border-b pb-1" />,
          h3: (props: any) => <h3 {...props} className="text-xl font-semibold mt-3 mb-1 text-foreground" />,
          ul: (props: any) => <ul {...props} className="list-disc list-inside my-3 space-y-1" />,
          ol: (props: any) => <ol {...props} className="list-decimal list-inside my-3 space-y-1" />,
          li: (props: any) => <li {...props} className="pl-2" />,
          a: (props: any) => <a {...props} className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer" />,
          strong: (props: any) => <strong {...props} className="font-semibold text-foreground" />,
          code: (props: any) => <code {...props} className="bg-muted text-muted-foreground px-1.5 py-1 rounded-md font-mono text-sm" />,
          pre: (props: any) => <CodeBlock {...props} />,
          p: (props: any) => <p {...props} className="mb-3 leading-relaxed" />,
        }}
      >
        {msg.content}
      </ReactMarkdown>
    </div>
  </div>
);

const UserMessageActions = ({ content, t }: { content: string; t: (key: string) => string }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground mt-1 absolute -bottom-8 right-0">
      <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7 hover:text-foreground"><Copy className="h-4 w-4" /></Button>
      {isCopied && <span className="text-xs ml-1 animate-in fade-in-0">{t('copied')}</span>}
    </div>
  );
};

const MessageActions = ({ msg, onRegenerate, t }: { msg: ChatMessage; onRegenerate: () => void; t: (key: string) => string }) => {
  const [feedback, setFeedback] = React.useState<'like' | 'dislike' | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    const textToCopy = msg.content || ((msg.table as unknown as { description?: string } | null)?.description) || ((msg.chart as unknown as { description?: string } | null)?.description) || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-1 transition-opacity text-muted-foreground mt-2">
      <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7 hover:text-foreground"><Copy className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={() => setFeedback('like')} className={cn("h-7 w-7 hover:text-foreground", feedback === 'like' && 'text-primary')}><ThumbsUp className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={() => setFeedback('dislike')} className={cn("h-7 w-7 hover:text-foreground", feedback === 'dislike' && 'text-destructive')}><ThumbsDown className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={onRegenerate} className="h-7 w-7 hover:text-foreground"><RefreshCw className="h-4 w-4" /></Button>
      {isCopied && <span className="text-xs ml-2 animate-in fade-in-0">{t('copied')}</span>}
    </div>
  );
};

// MODIFIED: Added usageText and isLimitReached to props
const InputSection = ({ inputValue, setInputValue, handleSubmit, handlePlusClick, isLoading, stopGeneration, suggestions, isLoadingSuggestions, t, isSubmitDisabled, usageText, usagePercentage, isLimitReached, selectedContext, setSelectedContext, chatSessions }: {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePlusClick: () => void;
  isLoading: boolean;
  stopGeneration: () => void;
  suggestions?: { text: string; icon: string }[];
  isLoadingSuggestions?: boolean;
  t: (key: string) => string;
  isSubmitDisabled: boolean;
  usageText: string;
  usagePercentage: number;
  isLimitReached: boolean;
  selectedContext: { id: string; title: string }[];
  setSelectedContext: React.Dispatch<React.SetStateAction<{ id: string; title: string }[]>>;
  chatSessions: { id: string; title: string }[];
}) => {
  const [isAutoMode, setIsAutoMode] = React.useState(true);
  const [currentMode, setCurrentMode] = React.useState<string>('Auto');
  const [modePopoverOpen, setModePopoverOpen] = React.useState(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSubmitDisabled) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full">
        <InputGroup className="rounded-xl">
          {/* Context selector at input start */}
          <InputGroupAddon align="block-start">
            <div className="flex items-center gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton
                    type="button"
                    variant="outline"
                    className="cursor-pointer inline-flex items-center gap-1 rounded-full px-2 py-1 h-7 text-xs"
                  >
                    <AtSign className="h-4 w-4" />
                    {selectedContext.length === 0 && (
                      <span>{t('addContext') || 'Add context'}</span>
                    )}
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start" className="[--radius:0.95rem]">
                  {chatSessions.length === 0 && (
                    <DropdownMenuItem disabled>No history</DropdownMenuItem>
                  )}
                  {chatSessions.map((s) => {
                    const isSelected = !!selectedContext.find((c) => c.id === s.id);
                    const isDisabled = !isSelected && selectedContext.length >= 2;
                    return (
                      <DropdownMenuItem
                        key={s.id}
                        onSelect={(e) => {
                          e.preventDefault();
                          setSelectedContext((prev) => {
                            const exists = prev.find((p) => p.id === s.id);
                            if (exists) {
                              return prev.filter((p) => p.id !== s.id);
                            }
                            if (prev.length >= 2) return prev;
                            return [...prev, { id: s.id, title: s.title }];
                          });
                        }}
                        className={cn("cursor-pointer", isDisabled && "opacity-50 pointer-events-none")}
                      >
                        <span className="truncate max-w-[16rem]">{s.title}</span>
                        {isSelected && <IconCheck className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              {selectedContext.map((c) => (
                <span
                  key={c.id}
                  className="text-sm px-3 py-1.5 rounded-full bg-muted text-primary cursor-pointer inline-flex items-center"
                  onClick={() => setSelectedContext((prev) => prev.filter((p) => p.id !== c.id))}
                >
                  {c.title}
                  <button className="ml-2 inline-flex items-center justify-center" aria-label="remove">
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </InputGroupAddon>
          <InputGroupTextarea
            placeholder={t('inputPlaceholder')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isLimitReached} // MODIFIED: Disable textarea when limit is reached
            className="max-h-[12rem] resize-none rounded-xl"
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
            <Popover open={modePopoverOpen} onOpenChange={setModePopoverOpen}>
              <PopoverTrigger asChild>
                <InputGroupButton variant="ghost" aria-label="Open Popover" className="inline-flex items-center gap-2 h-8 text-sm">
                  {t('autoLabel') || 'Auto'}
                </InputGroupButton>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0 text-sm">
                <div className="px-4 py-3">
                  <div className="text-sm font-medium">{t('autoModeTitle') || 'Auto Mode'}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Switch id="auto-mode-switch" checked={isAutoMode} onCheckedChange={(v) => setIsAutoMode(!!v)} />
                    <label htmlFor="auto-mode-switch">{t('autoDescription') || 'Auto mode with intelligent classification'}</label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {!isAutoMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton
                    variant="outline"
                    className="inline-flex items-center gap-2 h-8 text-sm rounded-full"
                  >
                    <BotIcon className="h-4 w-4" />
                    {currentMode}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="min-w-[10rem]">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    {t('selectModeTitle') || 'Select Mode'}
                  </div>
                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setCurrentMode('Code'); }} className="flex items-center justify-between cursor-pointer">
                    <span>Code</span>
                    {currentMode === 'Code' && <IconCheck className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setCurrentMode('Finance'); }} className="flex items-center justify-between cursor-pointer">
                    <span>Finance</span>
                    {currentMode === 'Finance' && <IconCheck className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setCurrentMode('General'); }} className="flex items-center justify-between cursor-pointer">
                    <span>General</span>
                    {currentMode === 'General' && <IconCheck className="h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {/* Usage indicator only (hide circular progress for now) */}
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
                aria-label={t('ariaStop')}
              >
                <Square className="h-4 w-4" />
                <span className="sr-only">Stop</span>
              </InputGroupButton>
            ) : (
              <InputGroupButton
                type="submit"
                variant="default"
                className="rounded-full"
                size="icon-xs"
                disabled={isSubmitDisabled}
                aria-label={t('ariaSend')}
              >
                <ArrowUpIcon className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      </form>

      {(isLoadingSuggestions || (suggestions && suggestions.length > 0)) && (
        <div className="w-full overflow-x-auto scrollbar-thin mt-4">
          <div className="flex w-max mx-auto gap-2 p-2 items-center">
            {isLoadingSuggestions ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('generatingSuggestions')}</span>
              </div>
            ) : (
              suggestions?.map(({ text, icon }, index: number) => (
                <Button key={index} variant="secondary" onClick={() => setInputValue(text)} className="text-xs cursor-pointer md:text-sm h-8 flex-shrink-0 rounded-full">
                  <DynamicIcon name={icon} />
                  {text}
                </Button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};


const AIStepsDisplay = ({ t }: { t: (key: string) => string }) => {
  const { aiSteps } = useAIStore();
  if (!aiSteps || aiSteps.length === 0) return null;
  const getStepIcon = (status: 'pending' | 'loading' | 'done') => {
    const iconBaseClasses = "h-4 w-4 flex-shrink-0";
    switch (status) {
      case 'loading': return <Loader2 className={cn(iconBaseClasses, "animate-spin text-primary")} />;
      case 'done': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(iconBaseClasses, "text-green-500")}><polyline points="20 6 9 17 4 12"></polyline></svg>;
      default: return <div className={cn(iconBaseClasses, "flex items-center justify-center")}><div className="h-2 w-2 bg-muted-foreground rounded-full"></div></div>;
    }
  };
  return (
    <div className="w-full max-w-prose self-start border rounded-md p-3 text-sm bg-muted/50 animate-in fade-in-0">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{t('aiPlan')}</p>
      <div className="space-y-2">
        {aiSteps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            {getStepIcon(step.status)}
            <span className={cn("transition-colors", step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground')}>{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuotaErrorNotification = ({ onDismiss, t }: { onDismiss: () => void, t: (key: string) => string }) => (
  <div className="absolute bottom-full mb-4 w-full animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
    <div className="p-3 rounded-lg border bg-background/95 backdrop-blur-sm shadow-lg ring-1 ring-yellow-500/50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5"><AlertTriangle className="h-5 w-5 text-yellow-500" /></div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-foreground">{t('quotaTitle') || 'Batas Penggunaan Gratis Tercapai'}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('quotaMessage') || 'Upgrade ke Pro untuk melanjutkan percakapan tanpa batas.'}</p>
          <Button size="sm" className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs"><Zap className="h-4 w-4 mr-2" />{t('upgradeButton') || 'Upgrade ke Pro'}</Button>
        </div>
        <div className="flex-shrink-0"><Button variant="ghost" size="icon" onClick={onDismiss} className="h-7 w-7"><X className="h-4 w-4" /></Button></div>
      </div>
    </div>
  </div>
);

// NEW: Component to show when chat limit is reached
const ChatLimitNotification = ({ t, onStartNewChat }: { t: (key: string) => string, onStartNewChat: () => void }) => (
  <div className="mb-4">
    <Item variant="outline">
      <ItemMedia variant="icon">
        <ShieldAlertIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{t('chatLimitTitle')}</ItemTitle>
        <ItemDescription>
          {t('chatLimitDescription')}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="secondary" className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90" onClick={onStartNewChat}>
          {t('chatLimitButton')}
        </Button>
      </ItemActions>
    </Item>
  </div>
);


const PageLoader = () => (
  <div className="flex h-full w-full flex-col items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);


// --- Main Component ---

export default function QuickCreateClientUI({
  sessionId: pageSessionId
}: {
  sessionId?: string;
}) {
  const { t, lang } = useLanguage();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = React.useState("");
  const [uploadedFiles, setUploadedFiles] = React.useState<{ file: File, previewUrl: string }[]>([]);
  const [expandedResults, setExpandedResults] = React.useState<Record<number, boolean>>({});
  const [suggestions, setSuggestions] = React.useState<{ text: string; icon: string }[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(true);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [selectedContext, setSelectedContext] = React.useState<{ id: string; title: string }[]>([]);

  const {
    messages,
    isLoading,
    isHistoryLoading,
    generate,
    stopGeneration,
    addMessage,
    initializeSession,
    startNewChat,
    error: storeError,
    aiSteps,
    chatSessions
  } = useAIStore();

  // NEW: Chat limit logic
  const CHAT_LIMIT = 8;
  const hasReachedLimit = messages.length >= CHAT_LIMIT;
  const usagePercentage = Math.round((messages.length / CHAT_LIMIT) * 100);
  const usageText = `${usagePercentage}% ${t('used')}`;
  // END NEW

  React.useEffect(() => {
    const current = typeof window !== 'undefined' ? window.location.pathname : '';
    if (pageSessionId) {
      initializeSession(pageSessionId);
    } else {
      // Always start new chat on base route without sessionId in URL
      if (!current.startsWith('/quick-create') || current.split('/').length > 2) {
        window.history.replaceState({}, '', '/quick-create');
      }
      startNewChat();
    }
  }, [pageSessionId, initializeSession, startNewChat]);

  React.useEffect(() => {
    if (storeError && (storeError.includes('RESOURCE_EXHAUSTED') || storeError.includes('"code":429'))) {
      setApiError('QUOTA_EXCEEDED');
      useAIStore.setState({ error: null });
    }
  }, [storeError]);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const suggestionData = await generateSuggestions();
        setSuggestions(suggestionData);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };
    if (!pageSessionId) {
      fetchSuggestions();
    }
  }, [pageSessionId]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, aiSteps]);

  const fileToBase64 = (file: File): Promise<ImagePart> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const data = result.split(',')[1];
        resolve({ mimeType: file.type, data });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePlusClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - uploadedFiles.length);
    const filePreviews = newFiles.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setUploadedFiles(prev => [...prev, ...filePreviews]);
    event.target.value = '';
  };

  const handleRemoveFile = (indexToRemove: number) => {
    URL.revokeObjectURL(uploadedFiles[indexToRemove].previewUrl);
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasReachedLimit) return; // NEW: Prevent submission if limit is reached
    setApiError(null);
    const textPrompt = inputValue.trim();
    if ((textPrompt.length < 1 && uploadedFiles.length === 0) || isLoading) return;

    const isNewChat = !useAIStore.getState().currentSessionId;

    const filesToSubmit = [...uploadedFiles];
    setInputValue("");
    setUploadedFiles([]);
    filesToSubmit.forEach(f => URL.revokeObjectURL(f.previewUrl));

    const imageParts = await Promise.all(filesToSubmit.map(f => fileToBase64(f.file)));
    // Build extra context from selected sessions
    let extraContext: StoredMessage[] = [];
    if (selectedContext.length) {
      const histories = await Promise.all(selectedContext.map(async (s) => {
        try {
          const h = await (await import("@/lib/actions/ai")).getChatHistory(s.id);
          return h as unknown as StoredMessage[];
        } catch { return []; }
      }));
      extraContext = histories.flat() as StoredMessage[];
    }
    const imageDataUrls = imageParts.map(part => `data:${part.mimeType};base64,${part.data}`);

    addMessage({ role: 'user' as const, content: textPrompt, images: imageDataUrls });

    const newSessionId = await generate(textPrompt, lang, false, imageParts, extraContext);

    // Keep base route; do not append sessionId
  };

  const handleRegenerate = async (index: number) => {
    const lastUserMessage = messages[index - 1];
    if (!lastUserMessage || lastUserMessage.role !== 'user' || isLoading) return;
    const userPrompt = lastUserMessage.content;
    let imageParts: ImagePart[] = [];
    if (lastUserMessage.images?.length) {
      imageParts = await Promise.all(lastUserMessage.images.map(async (imgSrc) => {
        const response = await fetch(imgSrc);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });
        return fileToBase64(file);
      }));
    }
    useAIStore.setState(state => ({ messages: state.messages.slice(0, index) }));
    await generate(userPrompt, lang, true, imageParts);
  };

  // MODIFIED: Add hasReachedLimit to the disabled condition
  const isSubmitDisabled = isLoading || (inputValue.trim().length < 1 && uploadedFiles.length === 0) || hasReachedLimit;

  const FilePreview = () => (
    uploadedFiles.length > 0 ? (
      <div className="mb-2 flex gap-3 px-2">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="relative">
            <button onClick={() => setSelectedImageUrl(file.previewUrl)} className="overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <img src={file.previewUrl} alt={`Preview ${index + 1}`} width={80} height={80} className="h-20 w-20 object-cover transition-transform hover:scale-105" />
            </button>
            <Button variant="secondary" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => handleRemoveFile(index)}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    ) : null
  );

  if (isHistoryLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Sheet open={!!selectedImageUrl} onOpenChange={(isOpen) => !isOpen && setSelectedImageUrl(null)}>
        <SheetContent className="w-[80vw] sm:max-w-3xl">
          <SheetHeader><SheetTitle>{t('imagePreview') || 'Image Preview'}</SheetTitle></SheetHeader>
          {selectedImageUrl && <div className="mt-4"><img src={selectedImageUrl} alt="Image Preview" className="max-h-[80vh] w-full object-contain" /></div>}
        </SheetContent>
      </Sheet>

      <div className="flex flex-col items-center h-full w-full bg-background">
        {/* Context selection moved into InputSection */}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" aria-label="Upload image files" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/10 rounded-full -z-10 blur-3xl" aria-hidden="true" />

        {messages.length === 0 && !isLoading && !isHistoryLoading ? (
          <main className="w-full max-w-4xl flex flex-col items-center justify-center flex-grow text-center p-4">
            <img src="/image.png" alt="Luminite Logo" width={64} height={64} className="mb-6 invert dark:invert-0" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{t('quickCreateTitle')}</h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-4xl">{t('quickCreateSubtitle')}</p>
            <div className="mt-8 w-full relative">
              <FilePreview />
              <InputSection
                {...{ inputValue, setInputValue, handleSubmit, handlePlusClick, isLoading, stopGeneration: () => stopGeneration(t('generationStopped')), suggestions, isLoadingSuggestions, t, isSubmitDisabled }}
                usageText={usageText}
                usagePercentage={usagePercentage}
                isLimitReached={hasReachedLimit}
                selectedContext={selectedContext}
                setSelectedContext={setSelectedContext}
                chatSessions={chatSessions.map(s => ({ id: s.id, title: s.title }))}
              />
              {/* Removed standalone progress ring; now inline with usage text */}
            </div>
          </main>
        ) : (
          <div className="flex flex-col flex-grow w-full h-0 items-center">
            <div className="flex-grow w-full max-w-4xl overflow-y-auto px-4 space-y-8 pt-4 pb-4">
              {messages.map((msg, index) => (
                <div key={index} className={cn("flex w-full flex-col gap-2 text-left group relative", msg.role === 'user' ? 'items-end' : 'items-start')}>

                  {msg.role === 'model' && msg.thinkingResult && (
                    <div className="w-full max-w-prose self-start">
                      <button onClick={() => setExpandedResults(prev => ({ ...prev, [index]: !prev[index] }))} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-2">
                        {t('resultThink') || 'Hasil Pemikiran'} ({msg.thinkingResult.duration}s)
                        {expandedResults[index] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {expandedResults[index] && (
                        <div className="border rounded-md p-3 mb-2 text-sm bg-muted/50 animate-in fade-in-0">
                          <p className="text-xs text-muted-foreground italic">
                            {(() => {
                              try {
                                const classification = msg.thinkingResult.classification;
                                if (classification && classification.summary) {
                                  return classification.summary;
                                }
                                if (classification && classification.rawResponse) {
                                  const rawJson = classification.rawResponse.match(/{[\s\S]*}/)?.[0] || '{}';
                                  const parsed = JSON.parse(rawJson);
                                  return parsed.summary || t('noSummary');
                                }
                                return t('parseError');
                              } catch { return t('parseError'); }
                            })()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.role === 'user' ? (
                    <div className="relative">
                      {msg.images && msg.images.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-2 max-w-prose">
                          {msg.images.map((imgSrc, imgIndex) => (
                            <button key={imgIndex} onClick={() => setSelectedImageUrl(imgSrc)} className="overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                              <img src={imgSrc} alt={`Uploaded ${imgIndex + 1}`} width={120} height={120} className="rounded-md object-cover transition-transform hover:scale-105" />
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.content && (
                        <div className="max-w-prose bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-lg px-4 py-3">
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      )}
                      {msg.content && <UserMessageActions content={msg.content} t={t} />}
                    </div>
                  ) : msg.content === t('generationStopped') ? (
                    <p className="text-sm italic text-muted-foreground">{t('generationStopped')}</p>
                  ) : (
                    <>
                      {msg.content && <AIMessage msg={msg} />}
                      {msg.content && (msg.table || msg.chart) && <div className="my-4 w-full max-w-prose border-t border-border" />}
                      {msg.table && <div className="w-full max-w-prose self-start"><TableDisplay table={msg.table} /></div>}
                      {msg.chart && <div className="w-full max-w-prose self-start"><ChartDisplay chart={msg.chart as AIGeneratedChart} /></div>}
                      <MessageActions msg={msg} onRegenerate={() => handleRegenerate(index)} t={t} />
                    </>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex w-full flex-col items-start gap-4 text-left group relative">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-2 border-border border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">{t('thinking')}</p>
                  </div>
                  <AIStepsDisplay t={t} />
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="w-full max-w-4xl flex-shrink-0 px-4 pb-4 relative">
              {apiError === 'QUOTA_EXCEEDED' && <QuotaErrorNotification onDismiss={() => setApiError(null)} t={t} />}
              {/* NEW: Conditionally render the limit notification */}
              {hasReachedLimit && (
                <div className="mb-3">
                  <ChatLimitNotification t={t} onStartNewChat={() => {
                    startNewChat();
                    const current = typeof window !== 'undefined' ? window.location.pathname : '';
                    if (!current.startsWith('/quick-create')) {
                      window.history.replaceState({}, '', '/quick-create');
                    }
                  }} />
                </div>
              )}
              <FilePreview />
              <InputSection
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSubmit={handleSubmit}
                handlePlusClick={handlePlusClick}
                isLoading={isLoading}
                stopGeneration={() => stopGeneration(t('generationStopped'))}
                t={t}
                isSubmitDisabled={isSubmitDisabled}
                suggestions={[]}
                isLoadingSuggestions={false}
                // MODIFIED: Pass dynamic props
                usageText={usageText}
                usagePercentage={usagePercentage}
                isLimitReached={hasReachedLimit}
                selectedContext={selectedContext}
                setSelectedContext={setSelectedContext}
                chatSessions={chatSessions.map(s => ({ id: s.id, title: s.title }))}
              />
            </div>
          </div>
        )}
      </div>
      {/* Context command dialog */}
      {/* Command dialog removed; using dropdown in input */}
    </>
  )
}
