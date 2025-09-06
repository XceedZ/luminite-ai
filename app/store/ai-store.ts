"use client"

import { create } from 'zustand'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { 
  generateContent, getChatHistory, getChatSessions, 
  renameChatSession, deleteChatSession 
} from '@/lib/actions/ai' 
import type { ImagePart, StoredMessage, AIGeneratedChart, ThinkingResult, AIGeneratedTable } from '@/lib/actions/ai';
import type { ChatHistoryItem } from '@/components/nav-history';

interface Message {
  role: 'user' | 'model';
  content: string;
  images?: string[];
  thinkingResult?: ThinkingResult | null;
  chart?: AIGeneratedChart | null;
  table?: AIGeneratedTable | null;
}

interface AIState {
  messages: Message[];
  chatSessions: ChatHistoryItem[]; 
  isLoading: boolean;
  isSessionsLoading: boolean; 
  isHistoryLoading: boolean; 
  isCancelled: boolean; 
  error: string | null;
  // [PERBAIKAN] Tambahkan flag baru dan setter-nya
  sessionJustCreated: boolean;
  setSessionJustCreated: (value: boolean) => void;
  initializeSession: (sessionId: string) => Promise<void>;
  fetchChatSessions: (force?: boolean) => Promise<void>; 
  startNewChat: () => void;
  addMessage: (message: Message) => void;
  generate: (prompt: string, lang: string, sessionId: string | null, isRegenerate?: boolean, images?: ImagePart[]) => Promise<string | null>;
  stopGeneration: (message: string) => void;
  renameChat: (sessionId: string, newTitle: string) => Promise<void>;
  deleteChat: (sessionIdToDelete: string, activeSessionId: string | null) => Promise<{ isActiveChat: boolean }>;
}

export const useAIStore = create<AIState>()(
    (set, get) => ({
      messages: [],
      chatSessions: [],
      isLoading: false,
      isSessionsLoading: true, 
      isHistoryLoading: false,
      isCancelled: false,
      error: null,
      // [PERBAIKAN] Inisialisasi state baru
      sessionJustCreated: false,

      // [PERBAIKAN] Tambahkan aksi setter untuk flag
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
        set({ isHistoryLoading: true, messages: [] });
        try {
          const history: StoredMessage[] = await getChatHistory(sessionId);
          const formattedMessages: Message[] = history.map(msg => ({
            role: msg.role,
            content: msg.content,
            chart: msg.chart ?? undefined,
            table: msg.table ?? undefined,
            thinkingResult: msg.thinkingResult ?? undefined,
          }));
          set({ messages: formattedMessages });
        } catch (error) {
            console.error("Gagal memuat riwayat sesi:", error);
        } finally {
            set({ isHistoryLoading: false });
        }
      },

      startNewChat: () => {
        set({ messages: [] });
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

      deleteChat: async (sessionIdToDelete, activeSessionId) => {
        const isActiveChat = activeSessionId === sessionIdToDelete;
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
      
      generate: async (prompt, lang, sessionId, isRegenerate = false, images = []) => {
        set({ isLoading: true, isCancelled: false });
        let newSessionId: string | null = null;
        try {
          const result = await generateContent(prompt, sessionId, images);
      
          if (get().isCancelled) return null;
          if (result.error) throw new Error(result.error as string);
      
          const isNewSession = !sessionId && result.sessionId;
          newSessionId = result.sessionId;
      
          if (isNewSession) {
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
