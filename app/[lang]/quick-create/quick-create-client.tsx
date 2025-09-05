"use client"

import * as React from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, SendHorizonal, ChevronDown, Copy, ThumbsUp, ThumbsDown, RefreshCw, Square } from "lucide-react"
import * as TablerIcons from "@tabler/icons-react"
import ReactMarkdown from "react-markdown"
import { useAIStore } from "@/app/store/ai-store" 
import { cn } from "@/lib/utils"
import { generateSuggestions } from "@/lib/actions/ai"

// --- Komponen Ikon Dinamis ---
const DynamicIcon = ({ name }: { name: string }) => {
  // @ts-ignore
  const IconComponent = TablerIcons[name] || TablerIcons.IconBoltFilled;
  return <IconComponent className="mr-2 h-4 w-4" />;
};

// --- Komponen Pesan AI ---
const AIMessage = ({ msg, onRegenerate, t }: { msg: any; onRegenerate: () => void; t: (key: string) => string }) => {
  const [feedback, setFeedback] = React.useState<'like' | 'dislike' | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    if(msg.content) {
      navigator.clipboard.writeText(msg.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  return (
    <div className="group relative flex flex-col gap-2 w-full max-w-prose">
      <div className="animate-in fade-in-0 duration-500">
        <div className="max-w-none">
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
      
      {msg.content && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7 hover:text-foreground"><Copy className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setFeedback('like')} className={cn("h-7 w-7 hover:text-foreground", feedback === 'like' && 'text-primary')}><ThumbsUp className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setFeedback('dislike')} className={cn("h-7 w-7 hover:text-foreground", feedback === 'dislike' && 'text-destructive')}><ThumbsDown className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onRegenerate} className="h-7 w-7 hover:text-foreground"><RefreshCw className="h-4 w-4" /></Button>
          {isCopied && <span className="text-xs ml-2 animate-in fade-in-0">{t('copied')}</span>}
        </div>
      )}
    </div>
  );
};

// --- Komponen InputSection ---
const InputSection = ({ inputValue, setInputValue, handleSubmit, handlePlusClick, isLoading, stopGeneration, suggestions, isLoadingSuggestions, t }: {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePlusClick: () => void;
  isLoading: boolean;
  stopGeneration: () => void;
  suggestions?: { text: string; icon: string }[];
  isLoadingSuggestions?: boolean;
  t: (key: string) => string;
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
        (<Button className="cursor-pointer" type="submit" variant="ghost" size="icon" aria-label={t('ariaSend')} disabled={inputValue.length === 0}><SendHorizonal className="h-5 w-5 text-primary" /></Button>)}
      </div>
    </form>
    {suggestions && (
      // [PERBAIKAN] Menggunakan div luar untuk scrolling, dan div dalam untuk centering
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

// --- Komponen Utama UI Klien ---
export default function QuickCreateClientUI({ dictionary }: { dictionary: any }) {
  const t = (key: string) => dictionary[key] || key;

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState("");
  const { messages, isLoading, generate, stopGeneration } = useAIStore();
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const [expandedResults, setExpandedResults] = React.useState<Record<number, boolean>>({});
  const [suggestions, setSuggestions] = React.useState<{ text: string; icon: string }[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(true);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const suggestionData = await generateSuggestions();
        setSuggestions(suggestionData);
      } catch (error) { 
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([{ text: "Catat pengeluaran", icon: "IconBoltFilled" }, { text: "Ringkas cash flow", icon: "IconBoltFilled" }, { text: "Analisis penjualan", icon: "IconBoltFilled" }]);
      } finally { setIsLoadingSuggestions(false); }
    };
    fetchSuggestions();
  }, []);
  
  const lastMessage = messages[messages.length - 1];
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [lastMessage, messages.length]);

  const handlePlusClick = () => {
    if(fileInputRef.current) {
        fileInputRef.current.click();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const valueToSubmit = inputValue;
    setInputValue("");
    await generate(valueToSubmit, false);
  };
  
  const handleRegenerate = (index: number) => {
    const userPrompt = messages[index - 1]?.content;
    if (userPrompt && !isLoading) {
      useAIStore.setState(state => ({ messages: state.messages.slice(0, index) }));
      generate(userPrompt, true);
    }
  };

  return (
    <div className="flex flex-col items-center h-full w-full bg-background">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/10 rounded-full -z-10 blur-3xl" aria-hidden="true"/>
      
      {messages.length === 0 ? (
        <main className="w-full max-w-4xl flex flex-col items-center justify-center flex-grow text-center p-4">
          <Image src="/image.png" alt="Luminite Logo" width={64} height={64} className="mb-6 invert dark:invert-0"/>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{t('quickCreateTitle')}</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-4xl">{t('quickCreateSubtitle')}</p>
          {/* [PERUBAHAN] Wrapper ini sekarang mengontrol lebar dan posisi input */}
          <div className="mt-8 w-full">
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
            />
          </div>
        </main>
      ) : (
        <div className="flex flex-col flex-grow w-full h-0 items-center">
          <div ref={chatContainerRef} className="flex-grow w-full max-w-4xl overflow-y-auto px-4 space-y-8 pt-4 pb-4">
            {messages.map((msg, index) => (
              <div key={index} className={cn("flex flex-col gap-2 text-left", msg.role === 'user' && 'items-end')}>
                
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
                
                <div className={cn("flex w-full", msg.role === 'user' && 'justify-end')}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap max-w-prose bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-lg px-4 py-2">
                        {msg.content}
                      </p>
                    ) : msg.content === t('generationStopped') ? (
                      <p className="text-sm italic text-destructive">{msg.content}</p>
                    ) : (
                      <AIMessage msg={msg} onRegenerate={() => handleRegenerate(index)} t={t} />
                    )}
                </div>
              </div>
            ))}
            {isLoading && (<div className="flex flex-row items-center gap-3 text-left"><div className="h-5 w-5 border-2 border-border border-t-primary rounded-full animate-spin" /><p className="text-muted-foreground animate-pulse">Thinking...</p></div>)}
          </div>
          {/* [PERUBAHAN] Wrapper input sekarang mengontrol lebar dan padding */}
          <div className="w-full max-w-4xl flex-shrink-0 border-t px-4 pt-2 pb-4">
            <InputSection 
              inputValue={inputValue} 
              setInputValue={setInputValue} 
              handleSubmit={handleSubmit} 
              handlePlusClick={handlePlusClick}
              isLoading={isLoading} 
              stopGeneration={() => stopGeneration(t('generationStopped'))}
              t={t}
            />
          </div>
        </div>
      )}
    </div>
  )
}

