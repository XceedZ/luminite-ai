"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation" 
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, SendHorizonal, ChevronDown, Copy, ThumbsUp, ThumbsDown, RefreshCw, Square, X, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useAIStore } from "@/app/store/ai-store"
import { cn } from "@/lib/utils"
import { generateSuggestions, AIGeneratedChart, ImagePart } from "@/lib/actions/ai"
import { ChartDisplay } from "@/components/ChartDisplay";
import { TableDisplay } from "@/components/TableDisplay";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
    IconBolt,
    IconCash,
    IconCashMove,
    IconCashBanknote,
    IconCashRegister,
    IconReceipt2,
    IconReportMoney,
    IconChartBar,
    IconChartPie,
    IconChartHistogram,
    IconChartLine,
    IconShoppingCart,
    IconShoppingBag,
    IconCreditCard,
    IconCreditCardPay,
    IconCreditCardRefund,
    IconCalendarStats,
    IconCalendarEvent,
    IconPigMoney,
    IconBuildingBank,
    IconBuildingStore,
    IconFileInvoice,
    IconFileSpreadsheet,
    IconFileText,
    IconBriefcase,
    IconUsers,
    IconUserDollar,
    IconUserCheck,
    IconUserCog,
    IconCurrencyDollar,
    IconCurrencyEuro,
    IconCurrencyBitcoin,
    IconCurrencyRupee,
    IconCurrencyYen,
    IconWallet,
    IconClipboardList,
    IconClipboardText,
    IconTarget,
    IconGauge,
    IconTrendingUp,
    IconTrendingDown,
    IconBulb,
    IconNotes,
    IconListCheck,
    IconDatabase,
    IconSettings,
    IconWorld,
    IconServer,
    IconCloud,
  } from "@tabler/icons-react";
  
  const ICON_MAP: Record<string, React.FC<any>> = {
    IconBolt, IconCash, IconCashMove, IconCashBanknote, IconCashRegister, IconReceipt2, IconReportMoney, IconChartBar, IconChartPie, IconChartHistogram, IconChartLine, IconShoppingCart, IconShoppingBag, IconCreditCard, IconCreditCardPay, IconCreditCardRefund, IconCalendarStats, IconCalendarEvent, IconPigMoney, IconBuildingBank, IconBuildingStore, IconFileInvoice, IconFileSpreadsheet, IconFileText, IconBriefcase, IconUsers, IconUserDollar, IconUserCheck, IconUserCog, IconCurrencyDollar, IconCurrencyEuro, IconCurrencyBitcoin, IconCurrencyRupee, IconCurrencyYen, IconWallet, IconClipboardList, IconClipboardText, IconTarget, IconGauge, IconTrendingUp, IconTrendingDown, IconBulb, IconNotes, IconListCheck, IconDatabase, IconSettings, IconWorld, IconServer, IconCloud,
  };
  
  export const DynamicIcon = ({ name }: { name: string }) => {
    const IconComponent = ICON_MAP[name] || IconBulb;
    return <IconComponent className="mr-2 h-4 w-4" />;
  };  

const AIMessage = ({ msg }: { msg: any }) => {
  return (
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
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
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
}) => (
  <div className="w-full flex flex-col items-center">
    <form onSubmit={handleSubmit} className="relative w-full">
       <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
        <Button type="button" variant="ghost" size="icon" onClick={handlePlusClick} className="cursor-pointer h-5 w-5" aria-label={t('ariaUpload')}><Plus className="h-4 w-4" /></Button>
        <div className="h-6 w-px bg-border" />
      </div>
      <Input type="text" placeholder={t('inputPlaceholder')} className="h-12 pl-16 pr-14 text-base" value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isLoading} />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
        {isLoading ? (<Button variant="secondary" size="icon" aria-label={t('ariaStop')} onClick={stopGeneration}><Square className="h-5 w-5" /></Button>) : 
        (<Button className="cursor-pointer" type="submit" variant="ghost" size="icon" aria-label={t('ariaSend')} disabled={isSubmitDisabled}><SendHorizonal className="h-5 w-5 text-primary" /></Button>)}
      </div>
    </form>
    {/* [PERBAIKAN] Tampilkan suggestions HANYA jika array-nya ada dan tidak kosong */}
    {suggestions && suggestions.length > 0 && (
      <div className="w-full overflow-x-auto scrollbar-thin mt-4">
        <div className="flex w-max mx-auto gap-2 p-2 items-center">
          {isLoadingSuggestions ? (<p className="text-xs text-muted-foreground animate-pulse flex-shrink-0">{t('generatingSuggestions')}</p>) : 
            (suggestions.map(({ text, icon }, index: number) => (
              <Button key={index} variant="secondary" onClick={() => setInputValue(text)} className="text-xs cursor-pointer md:text-sm h-8 flex-shrink-0">
                <DynamicIcon name={icon} />
                {text}
              </Button>
            )))
          }
        </div>
      </div>
    )}
  </div>
);

const fileToBase64 = (file: File): Promise<{ mimeType: string, data: string }> => {
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

function PageLoader() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}

export default function QuickCreateClientUI({ 
  dictionary, 
  sessionId: pageSessionId
}: { 
  dictionary: any;
  sessionId?: string;
}) {
  const t = (key: string) => dictionary[key] || key;
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState("");
  const { 
    messages, 
    isLoading,
    isHistoryLoading,
    generate, 
    stopGeneration, 
    addMessage, 
    initializeSession, 
    startNewChat,
    sessionJustCreated,
    setSessionJustCreated
  } = useAIStore();
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const [uploadedFiles, setUploadedFiles] = React.useState<{ file: File, previewUrl: string }[]>([]);
  const [expandedResults, setExpandedResults] = React.useState<Record<number, boolean>>({});
  const [suggestions, setSuggestions] = React.useState<{ text: string; icon: string }[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(true);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (sessionJustCreated) {
      setSessionJustCreated(false);
      return;
    }
    
    if (pageSessionId) {
      initializeSession(pageSessionId);
    } else {
      startNewChat();
    }
  }, [pageSessionId, initializeSession, startNewChat, sessionJustCreated, setSessionJustCreated]);
  
  React.useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const suggestionData = await generateSuggestions();
        setSuggestions(suggestionData);
      } catch (error) { 
        console.error("Gagal mengambil sugesti:", error);
      } finally { setIsLoadingSuggestions(false); }
    };

    // [PERBAIKAN] Kondisi untuk memuat dan menampilkan suggestions
    // Hanya muat jika TIDAK ada sessionId DAN TIDAK ada pesan.
    if (!pageSessionId && messages.length === 0) {
      fetchSuggestions();
    } else {
      // Jika ada sesi atau pesan, pastikan suggestions kosong dan tidak loading.
      setSuggestions([]);
      setIsLoadingSuggestions(false);
    }
    // [PERBAIKAN] Tambahkan messages.length sebagai dependensi
  }, [pageSessionId, messages.length]);
  
  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handlePlusClick = () => {
    if(fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 2 - uploadedFiles.length);
    const filePreviews = newFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setUploadedFiles(prev => [...prev, ...filePreviews]);
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const fileToRemove = uploadedFiles[indexToRemove];
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textPrompt = inputValue.trim();
    const filesToSubmit = uploadedFiles;
  
    if (textPrompt.length < 1 || isLoading) return;
  
    setInputValue("");
    setUploadedFiles([]);
    filesToSubmit.forEach(f => URL.revokeObjectURL(f.previewUrl));
  
    try {
      const imageParts = await Promise.all(
        filesToSubmit.map(f => fileToBase64(f.file))
      );
      const imageDataUrls = imageParts.map(part => `data:${part.mimeType};base64,${part.data}`);
  
      const userMessage = { role: 'user' as const, content: textPrompt, images: imageDataUrls };
      addMessage(userMessage);
  
      const newSessionId = await generate(textPrompt, lang, pageSessionId ?? null, false, imageParts);

      if (newSessionId && !pageSessionId) {
        setSessionJustCreated(true);
        router.push(`/${lang}/quick-create/${newSessionId}`);
      }
    } catch (error) {
      console.error("Gagal memproses file:", error);
      addMessage({ role: 'user', content: textPrompt });
      await generate(textPrompt, lang, pageSessionId ?? null, false);
    }
  };  
  
  const handleRegenerate = async (index: number) => {
    // 1. Ambil pesan pengguna terakhir secara keseluruhan (bukan hanya teksnya)
    const lastUserMessage = messages[index - 1];

    // 2. Pastikan pesan itu ada, dari pengguna, dan tidak sedang loading
    if (!lastUserMessage || lastUserMessage.role !== 'user' || isLoading) {
      return;
    }

    const userPrompt = lastUserMessage.content;
    
    // 3. Konversi kembali data URL gambar menjadi format ImagePart untuk backend
    let imageParts: ImagePart[] = [];
    if (lastUserMessage.images && lastUserMessage.images.length > 0) {
      imageParts = lastUserMessage.images.map((dataUrl: string) => {
        const [header, data] = dataUrl.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
        return { mimeType, data };
      });
    }

    // 4. Hapus respons AI lama dari state UI
    useAIStore.setState(state => ({ messages: state.messages.slice(0, index) }));
    
    // 5. Panggil fungsi generate dengan flag isRegeneration dan data gambar
    await generate(userPrompt, lang, pageSessionId ?? null, true, imageParts);
  };

  const isSubmitDisabled = isLoading || inputValue.trim().length < 1;

  const FilePreview = () => (
    uploadedFiles.length > 0 ? (
        <div className="mb-3 flex gap-3">
        {uploadedFiles.map((file, index) => (
            <div key={index} className="relative">
              <button onClick={() => setSelectedImageUrl(file.previewUrl)} className="overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <img
                    src={file.previewUrl}
                    alt={`Pratinjau ${index + 1}`}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-cover transition-transform hover:scale-105"
                />
              </button>
              <Button
                  variant="secondary"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={() => handleRemoveFile(index)}
              >
                  <X className="h-4 w-4" />
              </Button>
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
      <Dialog open={!!selectedImageUrl} onOpenChange={(isOpen) => !isOpen && setSelectedImageUrl(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('imagePreview') || 'Image Preview'}</DialogTitle>
          </DialogHeader>
          {selectedImageUrl && (
            <div className="relative mt-4 h-[70vh] w-full">
              <img
                src={selectedImageUrl}
                alt="Image Preview"
                className="object-contain w-full h-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col items-center h-full w-full bg-background">
        <input
          type="file" ref={fileInputRef} onChange={handleFileChange}
          accept="image/*" multiple className="hidden"
        />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/10 rounded-full -z-10 blur-3xl" aria-hidden="true"/>
        
        {messages.length === 0 && !isLoading && !isHistoryLoading ? (
          <main className="w-full max-w-4xl flex flex-col items-center justify-center flex-grow text-center p-4">
            <img src="/image.png" alt="Logo Luminite" width={64} height={64} className="mb-6 invert dark:invert-0"/>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{t('quickCreateTitle')}</h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-4xl">{t('quickCreateSubtitle')}</p>
            <div className="mt-8 w-full">
              <FilePreview />
              <InputSection 
                inputValue={inputValue} 
                setInputValue={setInputValue} 
                handleSubmit={handleSubmit} 
                handlePlusClick={handlePlusClick}
                isLoading={isLoading} 
                stopGeneration={() => stopGeneration(t('generationStopped'))}
                suggestions={suggestions} 
                isLoadingSuggestions={isLoadingSuggestions}
                t={t}
                isSubmitDisabled={isSubmitDisabled}
              />
            </div>
          </main>
        ) : (
          <div className="flex flex-col flex-grow w-full h-0 items-center">
            <div className="flex-grow w-full max-w-4xl overflow-y-auto px-4 space-y-8 pt-4 pb-4">
              {messages.map((msg, index) => (
                <div key={index} className={cn("flex w-full flex-col gap-2 text-left", msg.role === 'user' ? 'items-end' : 'items-start group relative')}>
                  
                  {msg.role === 'model' && msg.thinkingResult && (
                    <div className="w-full max-w-prose self-start">
                      <button onClick={() => setExpandedResults(prev => ({ ...prev, [index]: !prev[index] }))} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-2">
                        {t('resultThink')} ({msg.thinkingResult.duration}s)
                        <ChevronDown className={cn("h-4 w-4 transition-transform", expandedResults[index] && "rotate-180")}/>
                      </button>
                      {expandedResults[index] && (
                        <div className="border rounded-md p-3 mb-2 text-sm bg-muted/50 animate-in fade-in-0">
                          <p className="text-xs text-muted-foreground italic">
                            {(() => {
                              try {
                                const rawJson = msg.thinkingResult.classification.rawResponse.match(/{[\s\S]*}/)?.[0] || '{}';
                                const parsed = JSON.parse(rawJson);
                                return parsed.summary;
                              } catch {
                                return t('parseError');
                              }
                            })()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {msg.role === 'user' ? (
                    <>
                      {msg.images && msg.images.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-2 max-w-prose">
                          {msg.images.map((imgSrc: string, imgIndex: number) => (
                            <button key={imgIndex} onClick={() => setSelectedImageUrl(imgSrc)} className="overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                              <img
                                src={imgSrc}
                                alt={`Gambar Terunggah ${imgIndex + 1}`}
                                width={120} height={120}
                                className="rounded-md object-cover transition-transform hover:scale-105"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.content && (
                        <div className="max-w-prose bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-lg px-4 py-3">
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      )}
                    </>
                  ) : msg.content === t('generationStopped') ? (
                    <p className="text-sm italic text-muted-foreground">{t('generationStopped')}</p>
                  ) : (
                    <>
                      {msg.content && <AIMessage msg={msg} />}
                  
                      {msg.content && (msg.table || (msg.chart && (msg.chart as any).type !== 'confirmation_needed')) && (
                        <div className="my-4 w-full max-w-prose border-t border-border" />
                      )}
                  
                      {msg.table && (
                        <div className="w-full max-w-prose self-start">
                          <TableDisplay table={msg.table} />
                        </div>
                      )}
                  
                      {msg.chart && (msg.chart as any).type !== 'confirmation_needed' && (
                        <div className="w-full max-w-prose self-start">
                          <ChartDisplay chart={msg.chart as AIGeneratedChart} />
                        </div>
                      )}
                  
                      <MessageActions msg={msg} onRegenerate={() => handleRegenerate(index)} t={t} />
                    </>
                  )}
                </div>
              ))}
              {isLoading && (
                  <div className="flex flex-row items-center gap-3 text-left">
                      <div className="h-5 w-5 border-2 border-border border-t-primary rounded-full animate-spin" />
                      <p className="text-muted-foreground animate-pulse">{t('thinking')}</p>
                  </div>
              )}

              <div ref={bottomRef} /> 
            </div>

            <div className="w-full max-w-4xl flex-shrink-0 px-4 pb-4">
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
                suggestions={suggestions} 
                isLoadingSuggestions={isLoadingSuggestions}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

