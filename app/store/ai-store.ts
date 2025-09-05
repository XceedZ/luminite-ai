"use client"

import { create } from 'zustand'
import { generateContent } from '@/lib/actions/ai' 
import type { ImagePart } from '@/lib/actions/ai';

// Interface ThinkingResult tidak perlu diubah
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

// [MODIFIKASI] Tambahkan properti 'images' agar sesuai dengan data dari komponen
interface Message {
  role: 'user' | 'model';
  content: string;
  images?: string[]; // URL pratinjau gambar
  thinkingResult?: ThinkingResult;
}

interface AIState {
  messages: Message[];
  isLoading: boolean;
  isCancelled: boolean; 
  error: string | null;
  // [BARU] Tambahkan definisi fungsi addMessage di sini
  addMessage: (message: Message) => void;
  generate: (prompt: string, isRegenerate?: boolean, images?: ImagePart[]) => Promise<void>;
  stopGeneration: (message: string) => void;
}

export const useAIStore = create<AIState>()((set, get) => ({
  messages: [],
  isLoading: false,
  isCancelled: false,
  error: null,

  // [BARU] Implementasi fungsi addMessage
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

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

  // [MODIFIKASI] Fungsi generate disederhanakan
  generate: async (prompt, isRegenerate = false, images = []) => {
    // Pengecekan isLoading dipindah ke komponen klien untuk mencegah pengiriman ganda
    
    // Langsung set state loading. Logika penambahan pesan pengguna dihapus.
    set({ isLoading: true, isCancelled: false });
  
    try {
      // Panggil server action untuk mendapatkan hasil dari AI
      const result = await generateContent(prompt, images);
  
      if (get().isCancelled) {
        console.log("Process was cancelled during await, not adding AI response.");
        return; 
      }
  
      if (result.error) throw new Error(result.error as string);
      if (!result.classification || typeof result.duration === 'undefined') {
        throw new Error("Invalid result structure from AI action.");
      }
  
      // Buat pesan dari model AI
      const modelMessage: Message = {
        role: 'model',
        content: result.text || "",
        thinkingResult: {
          classification: result.classification,
          duration: Number(result.duration),
        }
      };
  
      // Tambahkan pesan model ke state
      set((state) => ({
        messages: [...state.messages, modelMessage],
      }));
  
    } catch (e: unknown) {
      if (!get().isCancelled) {
        const error = e as Error;
        // Tambahkan pesan error ke chat agar pengguna tahu ada masalah
        set(state => ({
          error: error.message || "An unknown error occurred.",
          messages: [...state.messages, {
            role: 'model',
            content: `Maaf, terjadi kesalahan: ${error.message}`
          }]
        }));
      }
    } finally {
      // Matikan loading setelah semua proses selesai
      set({ isLoading: false });
    }
  },  
}));