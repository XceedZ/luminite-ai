"use client"

import { create } from 'zustand'
import { generateContent } from '@/lib/actions/ai' 

// [PERBAIKAN] Interface disesuaikan dengan data yang sebenarnya dari ai.ts
interface ThinkingResult {
  classification: { 
    intent: string; 
    summary: string; 
    rawResponse: string;
    language: string;
    mood: string;
  };
  duration: number;
}

interface Message {
  role: 'user' | 'model';
  content: string;
  thinkingResult?: ThinkingResult;
}

interface AIState {
  messages: Message[];
  isLoading: boolean;
  isCancelled: boolean; 
  error: string | null; // [PERBAIKAN] Tambahkan kembali properti error
  generate: (prompt: string, isRegenerate?: boolean) => Promise<void>;
  stopGeneration: (message: string) => void;
}

export const useAIStore = create<AIState>()((set, get) => ({
  messages: [],
  isLoading: false,
  isCancelled: false,
  error: null, // [PERBAIKAN] Inisialisasi properti error

  stopGeneration: (message) => {
    set(state => ({
      isLoading: false,
      isCancelled: true,
      messages: [...state.messages, {
        role: 'model',
        content: message
      }]
    }));
    console.log("Generation stopped by user on client-side.");
  },

  generate: async (prompt, isRegenerate = false) => {
    if (!prompt || get().isLoading) return;

    set((state) => ({
      isLoading: true,
      isCancelled: false, // Selalu reset status pembatalan di awal
      messages: isRegenerate 
        ? state.messages 
        : [...state.messages, { role: 'user', content: prompt }],
    }));

    try {
      const result = await generateContent(prompt);

      if (get().isCancelled) {
        console.log("Process was cancelled during await, not adding AI response.");
        return; 
      }

      if (result.error) throw new Error(result.error as string);
      
      // [PERBAIKAN] Tambahkan pengecekan untuk memastikan result.classification ada
      if (!result.classification || typeof result.duration === 'undefined') {
        throw new Error("Invalid result structure from AI action.");
      }

      const modelMessage: Message = {
        role: 'model',
        content: result.text || "",
        thinkingResult: {
          classification: result.classification,
          duration: Number(result.duration), // Pastikan durasi adalah number
        }
      };

      set((state) => ({
        messages: [...state.messages, modelMessage],
      }));

    } catch (e: unknown) {
      if (!get().isCancelled) {
          const error = e as Error;
          set({ error: error.message || "An unknown error occurred." });
      }
    } finally {
      // Selalu set isLoading menjadi false di akhir.
      set({ isLoading: false });
    }
  },
}));

