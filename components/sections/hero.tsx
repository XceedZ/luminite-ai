"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowUp, Plus, Wand2, Loader2, AtSign, X, Check, Play, Zap } from "lucide-react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Particles } from "@/components/ui/particles";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Komponen AI Input Section untuk Hero
const AIInputSection = () => {
  const [inputValue, setInputValue] = useState("");
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [selectedContext, setSelectedContext] = useState<{ id: string; title: string }[]>([]);

  // Placeholder chat sessions untuk demo (di production ini akan dari API/store)
  const chatSessions: { id: string; title: string }[] = [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length < 1) return;
    // Redirect to quick-create or handle submission
    window.open('https://luminite-ai.vercel.app/quick-create', '_blank');
  };

  const handleEnhancePrompt = async () => {
    if (!inputValue || inputValue.trim().length === 0 || isEnhancingPrompt) {
      return;
    }
    // For landing page, just show loading state and redirect
    setIsEnhancingPrompt(true);
    setTimeout(() => {
      setIsEnhancingPrompt(false);
      // Could enhance the prompt here or redirect
      window.open('https://luminite-ai.vercel.app/quick-create', '_blank');
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="relative mt-8 flex w-full max-w-4xl mx-auto justify-center items-center">
      {/* --- KUMPULAN DIV UNTUK EFEK GLOW HALUS --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-2/3 bg-white/8 blur-3xl rounded-full pointer-events-none animate-float-1" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/2 h-full bg-white/6 blur-3xl rounded-full pointer-events-none animate-float-2" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full bg-white/6 blur-3xl rounded-full pointer-events-none animate-float-3" />
      {/* ------------------------------------------- */}

      {/* Kontainer untuk Input dengan BorderBeam */}
      <div className="relative w-full rounded-2xl shadow-2xl overflow-hidden border border-border/50 bg-background/40 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="w-full">
          <InputGroup className="rounded-xl border-0 bg-transparent">
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
                        <span>Add context</span>
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
                          {isSelected && <Check className="ml-auto h-4 w-4" />}
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
              placeholder="Describe what you want to create or accomplish..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-h-[12rem] resize-none rounded-xl min-h-[5rem] text-base placeholder:text-muted-foreground/60"
            />
            <InputGroupAddon align="block-end" className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2">
                <InputGroupButton
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  size="icon-xs"
                >
                  <Plus className="h-4 w-4" />
                </InputGroupButton>
                <InputGroupButton
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  size="icon-xs"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancingPrompt || !inputValue || inputValue.trim().length === 0}
                  title="Enhance prompt"
                >
                  {isEnhancingPrompt ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                </InputGroupButton>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="h-8 w-fit text-xs border-0 bg-transparent shadow-none hover:bg-accent/50 rounded-full px-2 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Auto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                  </SelectContent>
                </Select>
                <Separator orientation="vertical" className="h-4 bg-border/60" />
                <InputGroupButton
                  type="submit"
                  variant="default"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="icon-xs"
                  disabled={inputValue.trim().length < 1}
                >
                  <ArrowUp className="h-4 w-4" />
                </InputGroupButton>
              </div>
            </InputGroupAddon>
          </InputGroup>
        </form>
        {/* BorderBeam untuk efek visual */}
        <BorderBeam size={250} duration={12} delay={9} />
      </div>
    </div>
  );
};


export function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-20 md:px-8">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0"
        quantity={50}
        ease={80}
        color="#ffffff"
        staticity={50}
        refresh
      />

      {/* Kontainer Konten Utama */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        {/* Badge dengan AnimatedShinyText - langsung visible tanpa animasi delay */}
        <div
          className="group rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-primary/20 hover:border-primary/40 hover:scale-105 animate-fade-in"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          <AnimatedShinyText
            shimmerWidth={150}
            className="inline-flex items-center justify-center gap-2 text-primary"
          >
            <Zap className="size-3.5" />
            <span>Introducing Luminite AI</span>
            <ArrowRight className="size-3.5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </AnimatedShinyText>
        </div>

        {/* Headline Utama */}
        <div className="space-y-4">
          <h1
            className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-tight animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            Build the future
            <br />
            <span className="text-primary">with a prompt</span>
          </h1>
        </div>

        {/* Deskripsi */}
        <p
          className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          All your AI productivity tools unified in one powerful application.
        </p>

        {/* Tombol CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            className="shadow-2xl hover:scale-105 transition-transform animate-fade-in"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            onClick={() => window.open('https://luminite-ai.vercel.app', '_blank')}
          >
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight lg:text-base flex items-center gap-2">
              Get Started Free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 animate-fade-in"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
            onClick={() => {
              // TODO: Add video link or modal
              window.open('#', '_blank');
            }}
          >
            <Play className="size-4" />
            See Video
          </Button>
        </div>
      </div>

      {/* Showcase Komponen UI - AI Input Section */}
      <div
        className="relative z-10 w-full mt-12 animate-fade-in"
        style={{ animationDelay: "0.6s", animationFillMode: "both" }}
      >
        <AIInputSection />
      </div>
    </section>
  );
}
