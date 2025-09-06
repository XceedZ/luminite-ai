"use client"

import { create } from 'zustand'
import {
  generateContent, getChatHistory, getChatSessions,
  renameChatSession, deleteChatSession
} from '@/lib/actions/ai'
import type { ImagePart, StoredMessage, AIGeneratedChart, ThinkingResult, AIGeneratedTable } from '@/lib/actions/ai';
import type { ChatHistoryItem } from '@/components/nav-history';

// Definisikan tipe untuk pesan dalam state
interface Message {
  role: 'user' | 'model';
  content: string;
  images?: string[];
  thinkingResult?: ThinkingResult | null;
  chart?: AIGeneratedChart | null;
  table?: AIGeneratedTable | null;
}

// Definisikan tipe untuk keseluruhan state store
interface AIState {
  messages: Message[];
  chatSessions: ChatHistoryItem[];
  isLoading: boolean;
  isSessionsLoading: boolean;
  isHistoryLoading: boolean;
  isCancelled: boolean;
  error: string | null;

  // State untuk melacak sesi aktif tanpa bergantung pada URL/props
  currentSessionId: string | null;

  // Flag untuk mencegah fetch data yang tidak perlu setelah navigasi pertama
  sessionJustCreated: boolean;
  setSessionJustCreated: (value: boolean) => void;

  // Actions
  initializeSession: (sessionId: string) => Promise<void>;
  fetchChatSessions: (force?: boolean) => Promise<void>;
  startNewChat: () => void;
  addMessage: (message: Message) => void;
  generate: (prompt: string, lang: string, isRegenerate?: boolean, images?: ImagePart[]) => Promise<string | null>;
  stopGeneration: (message: string) => void;
  renameChat: (sessionId: string, newTitle: string) => Promise<void>;
  deleteChat: (sessionIdToDelete: string) => Promise<{ isActiveChat: boolean }>;
}

export const useAIStore = create<AIState>()(
    (set, get) => ({
      // Initial State
      messages: [],
      chatSessions: [],
      isLoading: false,
      isSessionsLoading: true,
      isHistoryLoading: false,
      isCancelled: false,
      error: null,
      currentSessionId: null,
      sessionJustCreated: false,

      // Actions
      setSessionJustCreated: (value) => set({ sessionJustCreated: value }),

      fetchChatSessions: async (force = false) => {
        if (get().chatSessions.length > 0 && !force) {
          set({ isSessionsLoading: false });
          return;
        }
        set({ isSessionsLoading: true });
        try {
          const sessions = await getChatSessions();
          set({ chatSessions: sessions });
        } catch (error) {
          console.error("Gagal mengambil sesi obrolan:", error);
        } finally {
          set({ isSessionsLoading: false });
        }
      },

      initializeSession: async (sessionId: string) => {
        set({ isHistoryLoading: true, messages: [], currentSessionId: sessionId });
        try {
          const history: StoredMessage[] = await getChatHistory(sessionId);
          const formattedMessages: Message[] = history.map(msg => ({
            role: msg.role,
            content: msg.content,
            chart: msg.chart ?? undefined,
            table: msg.table ?? undefined,
            thinkingResult: msg.thinkingResult ?? undefined,
            // Note: Gambar dari history tidak dimuat ulang di sini, sesuaikan jika perlu
          }));
          set({ messages: formattedMessages });
        } catch (error) {
            console.error("Gagal memuat riwayat sesi:", error);
        } finally {
            set({ isHistoryLoading: false });
        }
      },

      startNewChat: () => {
        set({ messages: [], currentSessionId: null });
      },

      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

      stopGeneration: (message) => set(state => ({
        isLoading: false,
        isCancelled: true,
        messages: [...state.messages, { role: 'model', content: message }]
      })),

      renameChat: async (sessionId, newTitle) => {
        try {
          const result = await renameChatSession(sessionId, newTitle);
          if (!result.success) throw new Error(result.error || 'Gagal mengganti nama di server.');
          await get().fetchChatSessions(true);
        } catch (error) {
          console.error("Gagal mengganti nama obrolan:", error);
          await get().fetchChatSessions(true);
        }
      },

      deleteChat: async (sessionIdToDelete) => {
        const isActiveChat = get().currentSessionId === sessionIdToDelete;
        try {
          const result = await deleteChatSession(sessionIdToDelete);
          if (!result.success) throw new Error(result.error || 'Gagal menghapus di server.');
          
          if (isActiveChat) {
            get().startNewChat();
          }
          await get().fetchChatSessions(true);
          return { isActiveChat };
        } catch (error) {
          console.error("Gagal menghapus obrolan:", error);
          await get().fetchChatSessions(true);
          return { isActiveChat: false };
        }
      },
      
      generate: async (prompt, lang, isRegenerate = false, images = []) => {
        // Gunakan ID sesi dari state, bukan dari parameter fungsi
        const sessionId = get().currentSessionId;
        set({ isLoading: true, isCancelled: false });

        try {
          const result = await generateContent(prompt, sessionId, images);
      
          if (get().isCancelled) return null;
          if (result.error) throw new Error(result.error as string);
      
          const isNewSession = !sessionId && result.sessionId;
          const newSessionId = result.sessionId;
      
          // Jika ini sesi baru, update state internal dan refresh daftar sesi
          if (isNewSession && newSessionId) {
            set({ currentSessionId: newSessionId });
            await get().fetchChatSessions(true);
          }
      
          const modelMessage: Message = {
            role: "model",
            content: result.text || "",
            thinkingResult: { classification: result.classification, duration: result.duration },
            chart: result.chart,
            table: result.table,
          };
      
          set(state => ({ messages: [...state.messages, modelMessage] }));
          return newSessionId; 
        } catch (e: unknown) {
          if (!get().isCancelled) {
            const error = e as Error;
            set(state => ({
              error: error.message || "Terjadi kesalahan.",
              messages: [
                ...state.messages,
                { role: "model", content: `Maaf, terjadi kesalahan: ${error.message}` },
              ],
            }));
          }
          return null;
        } finally {
          set({ isLoading: false });
        }
      },        
    })
);