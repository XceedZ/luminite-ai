"use client"

import { create } from 'zustand'
import {
    generateDiagramFromPrompt,
    analyzeDiagramContext,
    type DiagramGenerationMode,
    type DiagramNode,
    type DiagramEdge,
    type DiagramGenerationResult,
    type DiagramAnalysisResult,
    type DiagramIntentType,
    type DiagramChatMessage
} from '@/lib/actions/ai'

export type { DiagramGenerationMode, DiagramNode, DiagramEdge, DiagramGenerationResult, DiagramAnalysisResult, DiagramIntentType, DiagramChatMessage }

export type AIStep = {
    id: string;
    text: string;
    status: 'pending' | 'loading' | 'done';
    response?: string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    showOptions?: boolean;
    recommendation?: 'replace' | 'add';
}

interface DiagramAIState {
    messages: Message[];
    steps: AIStep[];
    isLoading: boolean;
    pendingPrompt: string | null;
    pendingMode: DiagramGenerationMode | null;
    error: string | null;

    // Actions
    addMessage: (message: Message) => void;
    clearMessages: () => void;
    updateStep: (id: string, updates: Partial<AIStep>) => void;
    setSteps: (steps: AIStep[]) => void;

    // Two-phase generation
    analyze: (
        prompt: string,
        template: 'flowchart' | 'erd',
        existingNodes?: DiagramNode[],
        existingEdges?: DiagramEdge[]
    ) => Promise<DiagramAnalysisResult | null>;

    generate: (
        prompt: string,
        template: 'flowchart' | 'erd',
        mode: DiagramGenerationMode,
        existingNodes?: DiagramNode[],
        existingEdges?: DiagramEdge[]
    ) => Promise<DiagramGenerationResult | null>;

    selectMode: (mode: DiagramGenerationMode) => void;
    resetPending: () => void;
}

export const useDiagramAIStore = create<DiagramAIState>()((set, get) => ({
    messages: [],
    steps: [],
    isLoading: false,
    pendingPrompt: null,
    pendingMode: null,
    error: null,

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    clearMessages: () => set({
        messages: [],
        steps: [],
        error: null,
        pendingPrompt: null,
        pendingMode: null
    }),

    updateStep: (id, updates) => set((state) => ({
        steps: state.steps.map(step =>
            step.id === id ? { ...step, ...updates } : step
        )
    })),

    setSteps: (steps) => set({ steps }),

    selectMode: (mode) => set({ pendingMode: mode }),

    resetPending: () => set({ pendingPrompt: null, pendingMode: null }),

    // Phase 1: Analyze user intent
    analyze: async (prompt, template, existingNodes, existingEdges) => {
        const { messages } = get();

        // Add user message
        set((state) => ({
            messages: [...state.messages, { role: 'user', content: prompt }],
            isLoading: true,
            error: null,
            pendingPrompt: prompt,
            steps: [
                { id: 'analyze', text: 'Thinking...', status: 'loading' }
            ]
        }));

        // Build chat history for AI context
        const chatHistory: DiagramChatMessage[] = messages.map(m => ({
            role: m.role,
            content: m.content
        }));

        try {
            const result = await analyzeDiagramContext(
                prompt,
                template,
                existingNodes,
                existingEdges,
                chatHistory
            );

            // If chat intent, just respond - no generation needed
            if (result.intent === 'chat') {
                set((state) => ({
                    steps: state.steps.map(s =>
                        s.id === 'analyze' ? { ...s, status: 'done' as const, text: 'Understood' } : s
                    )
                }));

                set((state) => ({
                    messages: [
                        ...state.messages,
                        { role: 'assistant', content: result.response }
                    ],
                    steps: [],
                    isLoading: false,
                    pendingPrompt: null
                }));
                return result;
            }

            // For generate intent - update analyze step to done
            set((state) => ({
                steps: state.steps.map(s =>
                    s.id === 'analyze' ? { ...s, status: 'done' as const, text: 'Understood' } : s
                )
            }));

            // If options needed, show response with buttons and STOP loading
            if (result.suggestOptions) {
                set((state) => ({
                    messages: [
                        ...state.messages,
                        {
                            role: 'assistant',
                            content: result.response,
                            showOptions: true,
                            recommendation: result.recommendation
                        }
                    ],
                    isLoading: false,
                    steps: []
                }));
            } else {
                // No options needed - show response and add generate step
                set((state) => ({
                    messages: [
                        ...state.messages,
                        {
                            role: 'assistant',
                            content: result.response,
                            showOptions: false
                        }
                    ],
                    steps: [
                        ...state.steps,
                        { id: 'generate', text: 'Generating diagram...', status: 'loading' }
                    ]
                }));
            }

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Analysis failed';

            set((state) => ({
                messages: [
                    ...state.messages,
                    { role: 'assistant', content: `❌ ${errorMessage}` }
                ],
                steps: [],
                isLoading: false,
                error: errorMessage
            }));

            return null;
        }
    },

    // Phase 2: Generate diagram
    generate: async (prompt, template, mode, existingNodes, existingEdges) => {
        // Add generate step if not already present
        set((state) => ({
            isLoading: true,
            error: null,
            steps: state.steps.some(s => s.id === 'generate')
                ? state.steps.map(s =>
                    s.id === 'generate' ? { ...s, status: 'loading' as const } : s
                )
                : [
                    ...state.steps,
                    { id: 'generate', text: 'Generating diagram...', status: 'loading' as const }
                ]
        }));

        try {
            const result = await generateDiagramFromPrompt(
                prompt,
                template,
                mode,
                existingNodes,
                existingEdges
            );

            // Update step to done
            set((state) => ({
                steps: state.steps.map(s =>
                    s.id === 'generate' ? { ...s, status: 'done' as const, text: 'Done!' } : s
                )
            }));

            // Add success message - no emoji, explicitly no options
            set((state) => ({
                messages: [
                    ...state.messages,
                    {
                        role: 'assistant',
                        content: result.summary,
                        showOptions: false
                    }
                ],
                isLoading: false,
                pendingPrompt: null,
                pendingMode: null,
                steps: []
            }));

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Generation failed';

            set((state) => ({
                messages: [
                    ...state.messages,
                    { role: 'assistant', content: `❌ ${errorMessage}` }
                ],
                steps: [],
                isLoading: false,
                error: errorMessage
            }));

            return null;
        }
    }
}));
