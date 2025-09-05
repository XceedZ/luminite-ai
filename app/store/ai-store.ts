"use client"

import { create } from 'zustand'
import { generateContent } from '@/lib/actions/ai' 

interface ThinkingResult {
  classification: { intent: string; summary: string; rawResponse: string };
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
  generate: (prompt: string, isRegenerate?: boolean) => Promise<void>;
  stopGeneration: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  isLoading: false,
  isCancelled: false,

  // [FITUR BARU] Saat stop, tambahkan pesan ke riwayat chat
  stopGeneration: () => {
    set(state => ({
      isLoading: false,
      isCancelled: true,
      messages: [...state.messages, {
        role: 'model',
        content: 'Pembangkitan respons dihentikan oleh pengguna.'
      }]
    }));
    console.log("Generation stopped by user on client-side.");
  },

  // [FITUR BARU] Fungsi generate sekarang menerima `isRegenerate`
  generate: async (prompt: string, isRegenerate: boolean = false) => {
    if (!prompt || get().isLoading) return;

    set((state) => ({
      isLoading: true,
      isCancelled: false,
      messages: isRegenerate 
        ? state.messages 
        : [...state.messages, { role: 'user', content: prompt }],
    }));

    try {
      const result = await generateContent(prompt);

      // Jika pengguna menekan stop saat menunggu, hapus pesan "stop" yang mungkin sudah muncul
      // lalu panggil stopGeneration lagi untuk menempatkannya di akhir.
      if (get().isCancelled) {
        set(state => ({
          messages: state.messages.filter(msg => msg.content !== 'Pembangkitan respons dihentikan oleh pengguna.')
        }));
        get().stopGeneration();
        return; 
      }

      if (result.error) throw new Error(result.error);
      
      const modelMessage: Message = {
        role: 'model',
        content: result.text || "",
        thinkingResult: {
          classification: result.classification,
          duration: result.duration,
        }
      };

      set((state) => ({
        messages: [...state.messages, modelMessage],
      }));
    } catch (e: any) {
      if (!get().isCancelled) {
        set({ error: e.message || "An unknown error occurred." });
      }
    } finally {
      // Pastikan isLoading selalu false di akhir, tapi jangan reset isCancelled
      if (!get().isCancelled) {
        set({ isLoading: false });
      } else {
        // Jika dibatalkan, reset flag untuk request selanjutnya
        set({ isLoading: false, isCancelled: false });
      }
    }
  },
}));