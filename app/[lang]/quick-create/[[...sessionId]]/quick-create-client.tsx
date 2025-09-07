"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, SendHorizonal, Copy, ThumbsUp, ThumbsDown, RefreshCw, Square, X, Loader2, Zap, AlertTriangle, ChevronsUpDown, Image as ImageIcon, FileUp, ChevronDown } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useAIStore } from "@/app/store/ai-store"
import { cn } from "@/lib/utils"
import { generateSuggestions, AIGeneratedChart, ImagePart } from "@/lib/actions/ai"
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

import {
    IconBolt, IconCash, IconCashMove, IconCashBanknote, IconCashRegister, IconReceipt2, IconReportMoney, IconChartBar, IconChartPie, IconChartHistogram, IconChartLine, IconShoppingCart, IconShoppingBag, IconCreditCard, IconCreditCardPay, IconCreditCardRefund, IconCalendarStats, IconCalendarEvent, IconPigMoney, IconBuildingBank, IconBuildingStore, IconFileInvoice, IconFileSpreadsheet, IconFileText, IconBriefcase, IconUsers, IconUserDollar, IconUserCheck, IconUserCog, IconCurrencyDollar, IconCurrencyEuro, IconCurrencyBitcoin, IconCurrencyRupee, IconCurrencyYen, IconWallet, IconClipboardList, IconClipboardText, IconTarget, IconGauge, IconTrendingUp, IconTrendingDown, IconBulb, IconNotes, IconListCheck, IconDatabase, IconSettings, IconWorld, IconServer, IconCloud,
} from "@tabler/icons-react";


// --- Helper Components ---

const ICON_MAP: Record<string, React.FC<any>> = {
    IconBolt, IconCash, IconCashMove, IconCashBanknote, IconCashRegister, IconReceipt2, IconReportMoney, IconChartBar, IconChartPie, IconChartHistogram, IconChartLine, IconShoppingCart, IconShoppingBag, IconCreditCard, IconCreditCardPay, IconCreditCardRefund, IconCalendarStats, IconCalendarEvent, IconPigMoney, IconBuildingBank, IconBuildingStore, IconFileInvoice, IconFileSpreadsheet, IconFileText, IconBriefcase, IconUsers, IconUserDollar, IconUserCheck, IconUserCog, IconCurrencyDollar, IconCurrencyEuro, IconCurrencyBitcoin, IconCurrencyRupee, IconCurrencyYen, IconWallet, IconClipboardList, IconClipboardText, IconTarget, IconGauge, IconTrendingUp, IconTrendingDown, IconBulb, IconNotes, IconListCheck, IconDatabase, IconSettings, IconWorld, IconServer, IconCloud,
};

const DynamicIcon = ({ name }: { name: string }) => {
    const IconComponent = ICON_MAP[name] || IconBulb;
    return <IconComponent className="mr-2 h-4 w-4" />;
};

const AIMessage = ({ msg }: { msg: any }) => (
    <div className="w-full max-w-prose animate-in fade-in-0 duration-500">
      <div className="max-w-none prose prose-zinc dark:prose-invert">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 {...props} className="text-3xl font-bold mt-5 mb-3 text-foreground" />,
            h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-bold mt-4 mb-2 text-foreground border-b pb-1" />,
            h3: ({node, ...props}) => <h3 {...props} className="text-xl font-semibold mt-3 mb-1 text-foreground" />,
            ul: ({node, ...props}) => <ul {...props} className="list-disc list-inside my-3 space-y-1" />,
            ol: ({node, ...props}) => <ol {...props} className="list-decimal list-inside my-3 space-y-1" />,
            li: ({node, ...props}) => <li {...props} className="pl-2" />,
            a: ({node, ...props}) => <a {...props} className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer" />,
            strong: ({node, ...props}) => <strong {...props} className="font-semibold text-foreground" />,
            code: ({node, ...props}) => <code {...props} className="bg-muted text-muted-foreground px-1.5 py-1 rounded-md font-mono text-sm" />,
            p: ({node, ...props}) => <p {...props} className="mb-3 leading-relaxed" />,
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

const MessageActions = ({ msg, onRegenerate, t }: { msg: any; onRegenerate: () => void; t: (key: string) => string }) => {
  const [feedback, setFeedback] = React.useState<'like' | 'dislike' | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    const textToCopy = msg.content || msg.table?.description || msg.chart?.description || '';
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

const InputSection = ({ inputValue, setInputValue, handleSubmit, handlePlusClick, isLoading, stopGeneration, suggestions, isLoadingSuggestions, t, isSubmitDisabled }: {
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
}) => {
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isSubmitDisabled) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
      <div className="w-full flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl shadow-sm">
           <Textarea
             placeholder={t('inputPlaceholder')}
             className="w-full border-none max-h-[12rem] resize-none bg-neutral-100 dark:bg-neutral-900 focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-2"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onKeyDown={handleKeyDown}
             disabled={isLoading}
             rows={2}
           />
           <div className="flex items-center justify-between mt-2">
               <div className="flex items-center gap-1">
                   <Popover>
                     <PopoverTrigger asChild>
                         <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                             <Plus className="h-4 w-4" />
                         </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-2" side="top" align="start">
                         <Button onClick={handlePlusClick} variant="ghost" className="w-full justify-start gap-2 px-2">
                             <FileUp className="h-4 w-4" />
                             Upload File
                         </Button>
                     </PopoverContent>
                   </Popover>
                   <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handlePlusClick}>
                     <ImageIcon className="h-4 w-4" />
                   </Button>
               </div>
               <div>
                 {isLoading ? (
                     <Button variant="secondary" size="icon" aria-label={t('ariaStop')} onClick={stopGeneration} className="h-9 w-9 rounded-full">
                         <Square className="h-5 w-5" />
                     </Button>
                 ) : (
                     <Button type="submit" size="icon" aria-label={t('ariaSend')} disabled={isSubmitDisabled} className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                         <SendHorizonal className="h-5 w-5" />
                     </Button>
                 )}
               </div>
           </div>
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
                  <Button key={index} variant="secondary" onClick={() => setInputValue(text)} className="text-xs cursor-pointer md:text-sm h-8 flex-shrink-0">
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

const PageLoader = () => (
    <div className="flex h-full w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
);


// --- Main Component ---

export default function QuickCreateClientUI({
  dictionary,
  sessionId: pageSessionId
}: {
  dictionary: any;
  sessionId?: string;
}) {
  const t = (key: string) => dictionary[key] || key;
  const lang = usePathname().split('/[lang]')[0].split('/').pop() || 'en';

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = React.useState("");
  const [uploadedFiles, setUploadedFiles] = React.useState<{ file: File, previewUrl: string }[]>([]);
  const [expandedResults, setExpandedResults] = React.useState<Record<number, boolean>>({});
  const [suggestions, setSuggestions] = React.useState<{ text: string; icon: string }[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(true);
  const [apiError, setApiError] = React.useState<string | null>(null);

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
    aiSteps // ✅ [PERBAIKAN] 1. Ambil `aiSteps` dari store
  } = useAIStore();

  React.useEffect(() => {
    if (pageSessionId) {
      initializeSession(pageSessionId);
    } else {
      startNewChat();
    }
  }, [pageSessionId]);

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

  // ✅ [PERBAIKAN] 2. Tambahkan `aiSteps` ke dependency array
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
    setApiError(null);
    const textPrompt = inputValue.trim();
    if ((textPrompt.length < 1 && uploadedFiles.length === 0) || isLoading) return;

    const filesToSubmit = [...uploadedFiles];
    setInputValue("");
    setUploadedFiles([]);
    filesToSubmit.forEach(f => URL.revokeObjectURL(f.previewUrl));

    const imageParts = await Promise.all(filesToSubmit.map(f => fileToBase64(f.file)));
    const imageDataUrls = imageParts.map(part => `data:${part.mimeType};base64,${part.data}`);

    addMessage({ role: 'user' as const, content: textPrompt, images: imageDataUrls });

    const newSessionId = await generate(textPrompt, lang, false, imageParts);

    if (newSessionId && !pageSessionId) {
      const newUrl = `/${lang}/quick-create/${newSessionId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
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

  const isSubmitDisabled = isLoading || (inputValue.trim().length < 1 && uploadedFiles.length === 0);

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
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/10 rounded-full -z-10 blur-3xl" aria-hidden="true"/>

        {messages.length === 0 && !isLoading && !isHistoryLoading ? (
          <main className="w-full max-w-4xl flex flex-col items-center justify-center flex-grow text-center p-4">
            <img src="/image.png" alt="Luminite Logo" width={64} height={64} className="mb-6 invert dark:invert-0"/>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{t('quickCreateTitle')}</h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-4xl">{t('quickCreateSubtitle')}</p>
            <div className="mt-8 w-full relative">
              <FilePreview />
              <InputSection {...{ inputValue, setInputValue, handleSubmit, handlePlusClick, isLoading, stopGeneration: () => stopGeneration(t('generationStopped')), suggestions, isLoadingSuggestions, t, isSubmitDisabled }} />
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
                        <ChevronDown className={cn("h-4 w-4 transition-transform", expandedResults[index] && "rotate-180")}/>
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
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}