"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateContent, getChatHistory, getChatSessions, getChatSession,   renameChatSession,
  deleteChatSession
 } from '@/lib/actions/ai' 
import type { ImagePart, StoredMessage, AIGeneratedChart, ThinkingResult, AIGeneratedTable } from '@/lib/actions/ai'; // [UPDATE] Impor tipe AIGeneratedTable
import type { ChatHistoryItem } from '@/components/nav-history';

interface Message {
  role: 'user' | 'model';
  content: string;
  images?: string[];
  thinkingResult?: ThinkingResult | null;
  chart?: AIGeneratedChart | null;
  table?: AIGeneratedTable | null; // [BARU] Tambahkan properti tabel
}

interface AIState {
  sessionId: string | null;
  messages: Message[];
  chatSessions: ChatHistoryItem[]; 
  isLoading: boolean;
  isSessionsLoading: boolean; 
  isHistoryLoading: boolean; 
  isCancelled: boolean; 
  error: string | null;
  initializeSession: (sessionId: string) => Promise<void>;
  fetchChatSessions: () => Promise<void>; 
  startNewChat: () => void;
  addMessage: (message: Message) => void;
  generate: (prompt: string, lang: string, isRegenerate?: boolean, images?: ImagePart[]) => Promise<void>;
  stopGeneration: (message: string) => void;
  renameChat: (sessionId: string, newTitle: string) => Promise<void>;
  deleteChat: (sessionId: string) => Promise<{ isActiveChat: boolean }>;
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      messages: [],
      chatSessions: [],
      isLoading: false,
      isSessionsLoading: true, 
      isHistoryLoading: false,
      isCancelled: false,
      error: null,

      fetchChatSessions: async () => {
        if (get().chatSessions.length > 0) {
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
        if (get().sessionId === sessionId && get().messages.length > 0) {
          return;
        }
        set({ isHistoryLoading: true, messages: [], sessionId });
        try {
          const history: StoredMessage[] = await getChatHistory(sessionId);
          // [UPDATE] Petakan juga `table` dari data yang diambil
          const formattedMessages: Message[] = history.map(msg => ({
            role: msg.role,
            content: msg.content,
            chart: msg.chart ?? undefined,
            table: msg.table ?? undefined, // Tambahkan ini
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
        set({ sessionId: null, messages: [] });
      },

      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message]
        }));
      },

      stopGeneration: (message) => {
        set(state => ({
          isLoading: false,
          isCancelled: true,
          messages: [...state.messages, { role: 'model', content: message }]
        }));
      },

      renameChat: async (sessionId: string, newTitle: string) => {
        const originalSessions = get().chatSessions;
        const updatedSessions = originalSessions.map(session =>
          session.id === sessionId ? { ...session, title: newTitle } : session
        );
        set({ chatSessions: updatedSessions });

        try {
          const result = await renameChatSession(sessionId, newTitle);
          if (!result.success) {
            throw new Error(result.error || 'Gagal mengganti nama di server.');
          }
        } catch (error) {
          console.error("Gagal mengganti nama obrolan:", error);
          set({ chatSessions: originalSessions });
        }
      },

      deleteChat: async (sessionIdToDelete: string) => {
        const originalSessions = get().chatSessions;
        const updatedSessions = originalSessions.filter(session => session.id !== sessionIdToDelete);
        
        set({ chatSessions: updatedSessions });

        const isActiveChat = get().sessionId === sessionIdToDelete;

        try {
          const result = await deleteChatSession(sessionIdToDelete);
          if (!result.success) {
            throw new Error(result.error || 'Gagal menghapus di server.');
          }
          if (isActiveChat) {
            set({ sessionId: null, messages: [] });
          }
          return { isActiveChat };
        } catch (error) {
          console.error("Gagal menghapus obrolan:", error);
          set({ chatSessions: originalSessions });
          return { isActiveChat: false };
        }
      },
      
      generate: async (prompt: string, lang: string, isRegenerate = false, images: ImagePart[] = []) => {
        set({ isLoading: true, isCancelled: false });
      
        try {
          const result = await generateContent(prompt, get().sessionId, images);
      
          if (get().isCancelled) return;
          if (result.error) throw new Error(result.error as string);
      
          set({ sessionId: result.sessionId });
      
          if (result.title) {
            const newSessionItem: ChatHistoryItem = {
              id: result.sessionId,
              title: result.title,
              href: `/${lang}/quick-create/${result.sessionId}`, // ✅ sekarang lang valid
            };
            set(state => ({
              chatSessions: [newSessionItem, ...state.chatSessions],
            }));
          }
      
          const modelMessage: Message = {
            role: "model",
            content: result.text || "",
            thinkingResult: {
              classification: result.classification,
              duration: result.duration,
            },
            chart: result.chart,
            table: result.table,
          };
      
          set(state => ({
            messages: [...state.messages, modelMessage],
          }));
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
        } finally {
          set({ isLoading: false });
        }
      },        
    }),
    {
      name: 'luminite-chat-storage',
      partialize: (state) => ({ sessionId: state.sessionId }),
    }
  )
);

