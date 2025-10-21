"use client"

import { create } from 'zustand'
import {
  classifyAndSummarize,
  classifyRequestType,
  summarizeDataForChartOrTable,
  generateChart,
  generateTable,
  generateFinalResponse,
  generateTitleForChat,
  saveMessageToHistory,
  getChatHistory, 
  getChatSessions, 
  renameChatSession, 
  deleteChatSession 
} from '@/lib/actions/ai'
import type { ImagePart, StoredMessage, AIGeneratedChart, ThinkingResult, AIGeneratedTable } from '@/lib/actions/ai';
import type { ChatHistoryItem } from '@/components/nav-history';
import { nanoid } from 'nanoid';

// ... interface tidak berubah ...
interface Message {
  role: 'user' | 'model';
  content: string;
  images?: string[];
  thinkingResult?: ThinkingResult | null;
  chart?: AIGeneratedChart | null;
  table?: AIGeneratedTable | null;
}

interface AIStep {
  text: string;
  status: 'pending' | 'loading' | 'done';
}

interface AIState {
  messages: Message[];
  chatSessions: ChatHistoryItem[];
  isLoading: boolean;
  isSessionsLoading: boolean;
  isHistoryLoading: boolean;
  isCancelled: boolean;
  error: string | null;
  currentSessionId: string | null;
  aiSteps: AIStep[];

  initializeSession: (sessionId: string) => Promise<void>;
  fetchChatSessions: (force?: boolean) => Promise<void>;
  startNewChat: () => void;
  addMessage: (message: Message) => void;
  generate: (prompt: string, lang: string, isRegenerate?: boolean, images?: ImagePart[], extraContext?: StoredMessage[]) => Promise<string | null>;
  stopGeneration: (message: string) => void;
  renameChat: (sessionId: string, newTitle: string) => Promise<void>;
  deleteChat: (sessionIdToDelete: string) => Promise<{ isActiveChat: boolean }>;
}


export const useAIStore = create<AIState>()(
    (set, get) => ({
      // ... initial state tidak berubah ...
      messages: [],
      chatSessions: [],
      isLoading: false,
      isSessionsLoading: true,
      isHistoryLoading: false,
      isCancelled: false,
      error: null,
      currentSessionId: null,
      aiSteps: [],

      // ... actions lain tidak berubah ...
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
        set({ isHistoryLoading: true, messages: [], currentSessionId: sessionId, error: null });
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
            set({ error: "Gagal memuat riwayat sesi." })
        } finally {
            set({ isHistoryLoading: false });
        }
      },

      startNewChat: () => {
        set({ 
            messages: [], 
            currentSessionId: null, 
            aiSteps: [], 
            error: null, 
            isCancelled: false 
        });
      },

      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

      stopGeneration: (message) => set(state => ({
        isLoading: false,
        isCancelled: true,
        aiSteps: [],
        messages: [...state.messages, { role: 'model', content: message }]
      })),
      
      renameChat: async (sessionId, newTitle) => {
        try {
          await renameChatSession(sessionId, newTitle);
          await get().fetchChatSessions(true);
        } catch (error) {
          console.error("Gagal mengganti nama obrolan:", error);
          await get().fetchChatSessions(true);
        }
      },

      deleteChat: async (sessionIdToDelete) => {
        const isActiveChat = get().currentSessionId === sessionIdToDelete;
        try {
          await deleteChatSession(sessionIdToDelete);
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

      // ✅ [PERBAIKAN] Fungsi generate kini menghitung durasi
      generate: async (prompt, lang, isRegenerate = false, images = [], extraContext = []) => {
        set({ isLoading: true, isCancelled: false, error: null, aiSteps: [] });
        const startTime = Date.now(); // Catat waktu mulai

        let sessionId = get().currentSessionId;
        const isNewChat = !sessionId;

        if (isNewChat) {
          sessionId = nanoid();
          set({ currentSessionId: sessionId });
        }
        
        try {
            if (!isRegenerate) {
                const userMessageForHistory: StoredMessage = { role: 'user', content: prompt };
                await saveMessageToHistory(sessionId!, userMessageForHistory);
            }

            const historyForAnalysis = [
              ...(extraContext || []),
              ...(await getChatHistory(sessionId!))
            ];

            // [NEW] Auto classification step for code/finance categorization
            const requestType = await classifyRequestType(prompt, images);
            if (get().isCancelled) return null;
            
            const classificationResult = await classifyAndSummarize(prompt, historyForAnalysis, images);
            if (get().isCancelled) return null;

            if (classificationResult.stepByAi && classificationResult.stepByAi.length > 0) {
              const initialSteps: AIStep[] = classificationResult.stepByAi.map((stepText: string) => ({
                text: stepText,
                status: 'pending' as const
              }));
              set({ aiSteps: initialSteps });
            }
            
            const updateStepStatus = (index: number, status: 'loading' | 'done') => {
                set(state => ({
                    aiSteps: state.aiSteps.map((step, i) => i === index ? { ...step, status } : step)
                }));
            };

            let finalResponseText: string | undefined, chart: AIGeneratedChart | null = null, table: AIGeneratedTable | null = null;
            
            if (['data_visualization', 'data_tabulation'].includes(classificationResult.intent)) {
                // Step 1: Summarize data (menggunakan model default di function)
                updateStepStatus(0, 'loading');
                const summaryResult = await summarizeDataForChartOrTable(historyForAnalysis, classificationResult.language, classificationResult.intent, images);
                updateStepStatus(0, 'done');

                if (summaryResult.needsMoreData) { 
                    finalResponseText = summaryResult.followUpQuestion; 
                } else if (summaryResult.data) {
                    if (classificationResult.intent === 'data_visualization') {
                        // Step 2: Generate chart (menggunakan gemma-3-12b-it di function generateChart)
                        updateStepStatus(1, 'loading');
                        const chartResult = await generateChart(summaryResult.data, classificationResult.language, historyForAnalysis, classificationResult.summary);
                        if (chartResult?.type === 'chart') chart = chartResult.chart; else if (chartResult?.type === 'confirmation_needed') finalResponseText = chartResult.message;
                        updateStepStatus(1, 'done');
                        
                        // Step 3: Generate final response text (menggunakan gemma-3-27b-it)
                        if (chart && !finalResponseText) {
                            updateStepStatus(2, 'loading');
                            const chartContext = `Generated Chart: ${JSON.stringify(chart)}`;
                            finalResponseText = await generateFinalResponse(
                                prompt, 
                                classificationResult.intent, 
                                classificationResult.summary, 
                                classificationResult.language, 
                                historyForAnalysis, 
                                images, 
                                requestType,
                                'gemma-3-27b-it',
                                chartContext
                            );
                            updateStepStatus(2, 'done');
                        }
                    } else {
                        // Step 2: Generate table (menggunakan gemma-3-12b-it di function generateTable)
                        updateStepStatus(1, 'loading');
                        table = await generateTable(summaryResult.data, classificationResult.language, classificationResult.summary);
                        updateStepStatus(1, 'done');
                        
                        // Step 3: Generate final response text (menggunakan gemma-3-27b-it)
                        if (table && !finalResponseText) {
                            updateStepStatus(2, 'loading');
                            const tableContext = `Generated Table: ${JSON.stringify(table)}`;
                            finalResponseText = await generateFinalResponse(
                                prompt, 
                                classificationResult.intent, 
                                classificationResult.summary, 
                                classificationResult.language, 
                                historyForAnalysis, 
                                images, 
                                requestType,
                                'gemma-3-27b-it',
                                tableContext
                            );
                            updateStepStatus(2, 'done');
                        }
                    }
                }
            } else if (classificationResult.intent === 'code_assistance') {
                // Step 1: Analyze coding requirements (using gemma-3-4b-it)
                updateStepStatus(0, 'loading');
                const analysisResult = await generateFinalResponse(
                    `Analyze the following coding request and provide a detailed analysis of requirements, constraints, and approach: ${prompt}`,
                    'code_analysis',
                    'Analyze coding requirements and constraints',
                    classificationResult.language,
                    historyForAnalysis,
                    images,
                    requestType,
                    'gemma-3-4b-it'
                );
                updateStepStatus(0, 'done');
                
                // Step 2: Plan implementation approach (using gemma-3-12b-it)
                updateStepStatus(1, 'loading');
                const planningResult = await generateFinalResponse(
                    `Based on the analysis, create a detailed implementation plan for: ${prompt}. Include step-by-step approach, dependencies, and best practices.`,
                    'code_planning',
                    'Create implementation plan and approach',
                    classificationResult.language,
                    historyForAnalysis,
                    images,
                    requestType,
                    'gemma-3-12b-it',
                    analysisResult // Pass step 1 result as context
                );
                updateStepStatus(1, 'done');
                
                // Step 3: Generate code solution and best practices (using gemma-3-27b-it)
                updateStepStatus(2, 'loading');
                finalResponseText = await generateFinalResponse(
                    `Provide the complete code solution for: ${prompt}. Include working code, explanations, and best practices.`,
                    classificationResult.intent,
                    classificationResult.summary,
                    classificationResult.language,
                    historyForAnalysis,
                    images,
                    requestType,
                    'gemma-3-27b-it',
                    `Analysis Result: ${analysisResult}\n\nPlanning Result: ${planningResult}` // Pass step 1 & 2 results
                );
                updateStepStatus(2, 'done');
            }
            
            if (!finalResponseText) {
                const finalStepIndex = get().aiSteps.length - 1;
                if(finalStepIndex >= 0) updateStepStatus(finalStepIndex, 'loading');
                // Menggunakan gemma-3-27b-it untuk final response
                finalResponseText = await generateFinalResponse(
                    prompt, 
                    classificationResult.intent, 
                    classificationResult.summary, 
                    classificationResult.language, 
                    historyForAnalysis, 
                    images, 
                    requestType,
                    'gemma-3-27b-it'
                );
                if(finalStepIndex >= 0) updateStepStatus(finalStepIndex, 'done');
            }
            if (get().isCancelled) return null;

            // ✅ [PERBAIKAN] Hitung durasi dari startTime hingga sekarang
            const endTime = Date.now();
            const duration = parseFloat(((endTime - startTime) / 1000).toFixed(2));

            const modelMessage: Message = {
              role: "model",
              content: finalResponseText || "",
              thinkingResult: { classification: classificationResult, duration },
              chart,
              table,
            };

            await saveMessageToHistory(sessionId!, modelMessage as StoredMessage);

            if (isNewChat) {
                const title = await generateTitleForChat(prompt, classificationResult.language, images);
                await renameChatSession(sessionId!, title || "Obrolan Baru");
                await get().fetchChatSessions(true);
            }
            
            set(state => ({ messages: [...state.messages, modelMessage] }));
            
            return sessionId;
            
        } catch (e: unknown) {
            if (get().isCancelled) return null;
            const error = e as Error;
            const errorMessage = `Maaf, terjadi kesalahan: ${error.message}`;
            set({ error: errorMessage });
            set(state => ({
                messages: [...state.messages, { role: "model", content: errorMessage }],
            }));
            return null;
        } finally {
            set({ isLoading: false, aiSteps: [] });
        }
      },
    })
);