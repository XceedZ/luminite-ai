"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateContent, getChatHistory, getChatSessions, getChatSession,   renameChatSession,
  deleteChatSession
 } from '@/lib/actions/ai' 
import type { ImagePart, StoredMessage } from '@/lib/actions/ai';
import type { ChatHistoryItem } from '@/components/nav-history';

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
  images?: string[];
  thinkingResult?: ThinkingResult;
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
  generate: (prompt: string, isRegenerate?: boolean, images?: ImagePart[]) => Promise<void>;
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
      // [PERBAIKAN] Mulai state dengan isSessionsLoading: true
      // Ini akan memastikan kerangka ditampilkan pada render pertama.
      isSessionsLoading: true, 
      isHistoryLoading: false,
      isCancelled: false,
      error: null,

      fetchChatSessions: async () => {
        // [MODIFIKASI] Logika ini mencegah reload yang tidak perlu
        if (get().chatSessions.length > 0) {
          set({ isSessionsLoading: false }); // Jika sudah ada data, matikan loading
          return;
        }
        set({ isSessionsLoading: true }); // Pastikan loading aktif saat mengambil data
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
          const formattedMessages: Message[] = history.map(msg => ({
            role: msg.role,
            content: msg.content,
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
        // Perbarui state secara optimis
        set({ chatSessions: updatedSessions });

        try {
          const result = await renameChatSession(sessionId, newTitle);
          if (!result.success) {
            throw new Error(result.error || 'Gagal mengganti nama di server.');
          }
        } catch (error) {
          console.error("Gagal mengganti nama obrolan:", error);
          // Jika gagal, kembalikan ke state semula
          set({ chatSessions: originalSessions });
          // Anda bisa menambahkan notifikasi error untuk pengguna di sini
        }
      },

      // [BARU] Implementasi untuk menghapus obrolan
      deleteChat: async (sessionIdToDelete: string) => {
        const originalSessions = get().chatSessions;
        const updatedSessions = originalSessions.filter(session => session.id !== sessionIdToDelete);
        
        // Perbarui state secara optimis
        set({ chatSessions: updatedSessions });

        const isActiveChat = get().sessionId === sessionIdToDelete;

        try {
          const result = await deleteChatSession(sessionIdToDelete);
          if (!result.success) {
            throw new Error(result.error || 'Gagal menghapus di server.');
          }
          // Jika obrolan yang aktif dihapus, reset state sesi
          if (isActiveChat) {
            set({ sessionId: null, messages: [] });
          }
          return { isActiveChat };
        } catch (error) {
          console.error("Gagal menghapus obrolan:", error);
          // Jika gagal, kembalikan ke state semula
          set({ chatSessions: originalSessions });
          return { isActiveChat: false };
        }
      },
      
      generate: async (prompt, isRegenerate = false, images = []) => {
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
              href: `/quick-create/${result.sessionId}`
            };
            set(state => ({
              chatSessions: [newSessionItem, ...state.chatSessions]
            }));
          }

          const modelMessage: Message = {
            role: 'model',
            content: result.text || "",
            thinkingResult: {
              classification: result.classification,
              duration: Number(result.duration),
            }
          };
      
          set((state) => ({
            messages: [...state.messages, modelMessage],
          }));
      
        } catch (e: unknown) {
          if (!get().isCancelled) {
            const error = e as Error;
            set(state => ({
              error: error.message || "Terjadi kesalahan.",
              messages: [...state.messages, {
                role: 'model',
                content: `Maaf, terjadi kesalahan: ${error.message}`
              }]
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

