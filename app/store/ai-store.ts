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
  deleteChatSession,
  saveCodeToUpstash,
  getCodeFromUpstash,
  getTemplateExample
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
  actionResult?: {
    title: string;
    description?: string;
  } | null;
}

interface AIStep {
  text: string;
  status: 'pending' | 'loading' | 'done';
  response?: string; // Store response for this step (text detail for UI)
  startTime?: number; // Track start time for duration calculation
  duration?: number; // Duration in seconds
  previewCode?: string; // Preview template code from Thinking step
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
  generate: (prompt: string, lang: string, isRegenerate?: boolean, images?: ImagePart[], extraContext?: StoredMessage[], mode?: string) => Promise<string | null>;
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
            actionResult: msg.actionResult ?? undefined,
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
      generate: async (prompt, lang, isRegenerate = false, images = [], extraContext = [], mode) => {
        // For app_builder mode, preserve existing steps instead of clearing
        const isAppBuilder = mode === 'app_builder'
        let existingSteps = isAppBuilder ? get().aiSteps : []
        
        // For app_builder mode, load existing steps from Upstash if not in state
        if (isAppBuilder && existingSteps.length === 0) {
          const sessionId = get().currentSessionId;
          if (sessionId) {
            const { getAIStepsFromUpstash } = await import("@/lib/actions/ai");
            const stepsFromUpstash = await getAIStepsFromUpstash(sessionId);
            if (stepsFromUpstash && stepsFromUpstash.length > 0) {
              existingSteps = stepsFromUpstash;
            }
          }
        }
        
        set({ isLoading: true, isCancelled: false, error: null, aiSteps: isAppBuilder ? existingSteps : [] });
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

            // For app_builder mode, check if code already exists and load it
            if (isAppBuilder && sessionId && existingSteps.length >= 3) {
              const existingCode = await getCodeFromUpstash(sessionId);
              if (existingCode) {
                // Find final step index and mark it as done with existing code
                const finalStepIndex = existingSteps.findIndex(step => 
                  step.text.includes("Coding") || step.text.includes("final files")
                );
                if (finalStepIndex >= 0) {
                  set(state => ({
                    aiSteps: state.aiSteps.map((s, i) => 
                      i === finalStepIndex ? { ...s, status: 'done' as const, response: existingCode } : s
                    )
                  }));
                }
              }
            }

            // For app_builder mode, skip classification (already known)
            let classificationResult: any;
            let finalIntent: string;
            let requestType: string;
            
            if (isAppBuilder) {
              // Skip classification for app_builder - use default values
              finalIntent = 'app_builder';
              requestType = 'app_builder';
              classificationResult = {
                language: lang || 'Indonesian',
                intent: 'app_builder',
                summary: prompt,
                mood: 'neutral',
                stepByAi: []
              };
            } else {
              // [NEW] Auto classification step for code/finance categorization
              // Override with provided mode if specified, otherwise auto classify
              requestType = mode || await classifyRequestType(prompt, images);
              if (get().isCancelled) return null;
              
              classificationResult = await classifyAndSummarize(prompt, historyForAnalysis, images);
              if (get().isCancelled) return null;

              // Override intent based on mode
              finalIntent = mode || classificationResult.intent;
            }

            // Set up AI steps based on intent
            // For app_builder mode, only create new steps if we don't have existing ones
            let aiSteps: AIStep[] = [];
            if (isAppBuilder && existingSteps.length > 0) {
              // Preserve existing steps - don't overwrite
              aiSteps = existingSteps;
            } else if (classificationResult.stepByAi && classificationResult.stepByAi.length > 0) {
              aiSteps = classificationResult.stepByAi.map((stepText: string) => ({
                text: stepText,
                status: 'pending' as const
              }));
            } else if (finalIntent === 'app_builder') {
              // Default 3-step plan for app_builder (only if no existing steps)
              aiSteps = [
                { text: 'Planning website structure and requirements', status: 'pending' as const },
                { text: 'Designing HTML structure and layout', status: 'pending' as const },
                { text: 'Generating final HTML and CSS code', status: 'pending' as const }
              ];
            }

            // Only set new steps if we don't have existing ones (for app_builder mode)
            if (aiSteps.length > 0 && !(isAppBuilder && existingSteps.length > 0)) {
              set({ aiSteps });
            }
            
            const updateStepStatus = (index: number, status: 'loading' | 'done') => {
                set(state => ({
                    aiSteps: state.aiSteps.map((step, i) => i === index ? { ...step, status } : step)
                }));
            };

            let finalResponseText: string | undefined, chart: AIGeneratedChart | null = null, table: AIGeneratedTable | null = null;
            
            if (['data_visualization', 'data_tabulation'].includes(finalIntent)) {
                // Step 1: Summarize data (menggunakan model default di function)
                updateStepStatus(0, 'loading');
                const summaryResult = await summarizeDataForChartOrTable(historyForAnalysis, classificationResult.language, finalIntent, images);
                updateStepStatus(0, 'done');

                if (summaryResult.needsMoreData) { 
                    finalResponseText = summaryResult.followUpQuestion; 
                } else if (summaryResult.data) {
                    if (finalIntent === 'data_visualization') {
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
                                finalIntent, 
                                classificationResult.summary, 
                                classificationResult.language, 
                                historyForAnalysis, 
                                images, 
                                requestType as 'code' | 'finance' | 'app_builder' | 'general',
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
                                finalIntent, 
                                classificationResult.summary, 
                                classificationResult.language, 
                                historyForAnalysis, 
                                images, 
                                requestType as 'code' | 'finance' | 'app_builder' | 'general',
                                'gemma-3-27b-it',
                                tableContext
                            );
                            updateStepStatus(2, 'done');
                        }
                    }
                }
            } else if (finalIntent === 'code_assistance') {
                // Step 1: Analyze coding requirements (using gemma-3-4b-it)
                updateStepStatus(0, 'loading');
                const analysisResult = await generateFinalResponse(
                    `Analyze the following coding request and provide a detailed analysis of requirements, constraints, and approach: ${prompt}`,
                    'code_analysis',
                    'Analyze coding requirements and constraints',
                    classificationResult.language,
                    historyForAnalysis,
                    images,
                    requestType as 'code' | 'finance' | 'app_builder' | 'general',
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
                    requestType as 'code' | 'finance' | 'app_builder' | 'general',
                    'gemma-3-12b-it',
                    analysisResult // Pass step 1 result as context
                );
                updateStepStatus(1, 'done');
                
                // Step 3: Generate code solution and best practices (using gemma-3-27b-it)
                updateStepStatus(2, 'loading');
                finalResponseText = await generateFinalResponse(
                    `Provide the complete code solution for: ${prompt}. Include working code, explanations, and best practices.`,
                    finalIntent,
                    classificationResult.summary,
                    classificationResult.language,
                    historyForAnalysis,
                    images,
                    requestType as 'code' | 'finance' | 'app_builder' | 'general',
                    'gemma-3-27b-it',
                    `Analysis Result: ${analysisResult}\n\nPlanning Result: ${planningResult}` // Pass step 1 & 2 results
                );
                updateStepStatus(2, 'done');
              } else if (finalIntent === 'app_builder') {
                
                // AI Steps untuk app_builder - 3 langkah (Planning implementation tidak jadi step, langsung di chat)
                // Always set steps for app_builder (skip classification step since we're already in app_builder)
                const newAiSteps: AIStep[] = [
                  { text: 'Thinking...', status: 'pending' }, // Step 0: Thinking (will update to "Thought for Xs" when done)
                  { text: 'Exploring codebase structure', status: 'pending' }, // Step 1: Explore codebase
                  { text: 'Coding the final files', status: 'pending' }, // Step 2: Generate code
                  { text: 'Adding finishing touches', status: 'pending' } // Step 3: Polish design with images
                ];
                set({ aiSteps: newAiSteps });

                // --- Langkah 0: Thought (track real-time duration) ---
                // IMPORTANT: This step should ONLY generate text about SECTIONS (Hero, CTA, Features, etc.), NOT code
                const thoughtStartTime = Date.now()
                updateStepStatus(0, 'loading'); // 'Thinking...' (index 0)
                set(state => ({
                  aiSteps: state.aiSteps.map((s, i) => 
                    i === 0 ? { ...s, startTime: thoughtStartTime } : s
                  )
                }));

                // Load template example based on user prompt
                const templateExample = await getTemplateExample(prompt)
                const templateContext = templateExample 
                  ? `\n\n**REFERENCE TEMPLATE CODE (use as inspiration for structure and design quality):**\n\n${templateExample}`
                  : ''

                const inspirationResponse = await generateFinalResponse(
                    `Describe the sections and design elements you will create for: ${prompt}. Provide a JSON response with "text" (detailed description) and "code" (preview template HTML with inline CSS and JavaScript). The code should be a modern, interactive, and beautiful template example.`,
                    'app_builder_inspiration', // intent
                    classificationResult.summary,
                    classificationResult.language,
                    historyForAnalysis,
                    images,
                    'app_builder_inspiration_json', // mode - Use new JSON mode
                    'gemma-3-12b-it', // Model yang lebih kecil/cepat cocok untuk teks deskripsi
                    templateContext // Pass template as planning context
                );
                
                if (get().isCancelled) return null;
                
                // Parse JSON response with robust error handling
                let inspirationText = '';
                let previewCode = '';
                try {
                  // Try to parse as JSON
                  const cleanedResponse = inspirationResponse.trim();
                  
                  // Remove markdown code blocks if present
                  const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
                  
                  if (jsonMatch) {
                    // SANITASI: Replace problematic escaped characters
                    const jsonString = jsonMatch[0];
                    
                    // Fix common JSON issues from AI responses
                    // Try direct parse first
                    try {
                      const jsonData = JSON.parse(jsonString);
                      inspirationText = jsonData.text || inspirationResponse;
                      previewCode = jsonData.code || '';
                      console.log('[AI Store] ✅ JSON parsed successfully');
                    } catch (firstError) {
                      console.warn('[AI Store] First JSON parse failed, attempting sanitization...');
                      
                      // Sanitize approach: Extract fields manually with regex
                      const textMatch = jsonString.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                      const codeMatch = jsonString.match(/"code"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                      
                      if (textMatch || codeMatch) {
                        inspirationText = textMatch ? textMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : inspirationResponse;
                        previewCode = codeMatch ? codeMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : '';
                        console.log('[AI Store] ✅ JSON extracted using regex fallback');
                      } else {
                        throw firstError; // Re-throw if regex extraction also fails
                      }
                    }
                  } else {
                    // Fallback: treat as plain text
                    inspirationText = inspirationResponse;
                    console.log('[AI Store] ℹ️ No JSON found, using raw response');
                  }
                } catch (error) {
                  // If all parsing fails, use the response as text
                  console.error('[AI Store] ❌ Failed to parse JSON response:', error);
                  console.error('[AI Store] Raw response preview:', inspirationResponse.substring(0, 500));
                  inspirationText = inspirationResponse;
                }
                
                // Calculate duration and update step text
                const thoughtDuration = Math.round((Date.now() - thoughtStartTime) / 1000)
                const thoughtText = `Thought for ${thoughtDuration}s`
                updateStepStatus(0, 'done');
                set(state => ({
                  aiSteps: state.aiSteps.map((s, i) => 
                    i === 0 ? { 
                      ...s, 
                      status: 'done' as const, 
                      response: inspirationText, // Text for UI display
                      text: thoughtText, 
                      duration: thoughtDuration,
                      previewCode: previewCode // Store preview code for final step
                    } : s
                  )
                }));

                if (get().isCancelled) return null;

                // --- Langkah 1: Exploring codebase structure ---
                // IMPORTANT: Generate file structure and codebase exploration
                updateStepStatus(1, 'loading'); // 'Exploring codebase structure' (index 1)
                const planningResult = await generateFinalResponse(
                    `What code stack and technologies should be used for this website: ${prompt}? Be brief and focus only on code technologies (HTML, CSS, JavaScript). Also, list the files that will be created (e.g., index.html, styles.css, script.js).`,
                    'web_planning',
                    'Planning code stack and technologies',
                    classificationResult.language,
                    historyForAnalysis,
                    images,
                    'web_planning', // Use 'web_planning' mode to ensure SHORT TEXT about code stack, not code
                    'gemma-3-4b-it',
                    inspirationText
                );
                updateStepStatus(1, 'done');
                // Store response for step 1 (Exploring codebase structure) - planning result
                set(state => ({
                  aiSteps: state.aiSteps.map((s, i) => 
                    i === 1 ? { ...s, status: 'done' as const, response: planningResult } : s
                  )
                }));
                
                if (get().isCancelled) return null;

                // --- Planning implementation: Generate and save as message (NOT a step) ---
                // IMPORTANT: Generate detailed implementation plan before coding - save as chat message
                const implementationPlan = await generateFinalResponse(
                    `Based on the design inspiration and codebase structure, create a detailed implementation plan for: ${prompt}. Focus on the technical implementation approach, component structure, layout strategy, and how each section will be built. Be specific about the implementation methodology, not just describing what will be built. Explain HOW it will be implemented technically.`,
                    'app_builder_planning',
                    'Planning implementation details',
                    classificationResult.language,
                    historyForAnalysis,
                    images,
                    'app_builder_planning',
                    'gemma-3-12b-it',
                    `Design Inspiration:\n${inspirationText}\n\nCodebase Structure:\n${planningResult}`
                );
                
                if (get().isCancelled) return null;
                
                // Save implementation plan as a chat message (not a step)
                if (implementationPlan && sessionId) {
                  // Add to current messages first (so it appears immediately)
                  get().addMessage({
                    role: 'model',
                    content: implementationPlan
                  });
                  // Then save to history
                  await saveMessageToHistory(sessionId, {
                    role: 'model',
                    content: implementationPlan
                  });
                }
                
                if (get().isCancelled) return null;

                // --- Langkah 2: Generasi Kode Final (Final Code Generation) ---
                // ONLY this step generates code - all previous steps are text only
                updateStepStatus(2, 'loading'); // 'Coding the final files' (index 2)
                
                // Load ORIGINAL template (not AI-generated preview) for final code reference
                const finalTemplateExample = await getTemplateExample(prompt)
                console.log('[App Builder] Loaded template for final code:', finalTemplateExample ? `${finalTemplateExample.length} chars` : 'none')
                
                // Check if code already exists - if yes, update it (not create new)
                const existingCode = await getCodeFromUpstash(sessionId!);
                const codeContext = existingCode 
                  ? `[UPDATE MODE] The user wants to improve/update an existing website. Current code:\n${existingCode}\n\nUser's request: ${prompt}\n\nUpdate the code based on the user's request. Keep what works, improve what needs to be changed.`
                  : `Design Inspiration:\n${inspirationText}\n\nCodebase Structure:\n${planningResult}\n\nImplementation Plan:\n${implementationPlan}${finalTemplateExample ? `\n\n**REFERENCE TEMPLATE (use as inspiration for code structure, design patterns, and quality):**\n\n${finalTemplateExample}` : ''}`;
                
                finalResponseText = await generateFinalResponse(
                    existingCode 
                      ? `Update the existing website content based on: ${prompt}. KEEP the structure, layout, and CSS exactly the same. ONLY change text content (titles, descriptions, etc). Output ONLY a single HTML code block.`
                      : `User request: ${prompt}

IMPORTANT INSTRUCTIONS:
1. You have been provided with a REFERENCE TEMPLATE in the context below
2. Use that template's HTML structure, CSS, and design EXACTLY as-is
3. ONLY change the TEXT CONTENT to match the user's request:
   - Change titles, headings, descriptions to match "${prompt}"
   - Update placeholder names, company names, project titles
   - Modify text to be relevant to user's request
4. DO NOT redesign, DO NOT change colors, DO NOT modify CSS
5. Think of this as "content translation" - same design, different content
6. Output ONLY a single complete HTML code block with all CSS inline

The template is already beautiful and perfect. Your job is to make the CONTENT relevant to: ${prompt}`,
                    finalIntent,
                    classificationResult.summary,
                    classificationResult.language,
                    historyForAnalysis,
                    images,
                    'app_builder',
                    'gemma-3-27b-it',
                    codeContext
                );
                updateStepStatus(2, 'done'); // 'Coding the final files' Selesai (index 2)
                // Store response for step 2 (final code)
                set(state => ({
                  aiSteps: state.aiSteps.map((s, i) => 
                    i === 2 ? { ...s, status: 'done' as const, response: finalResponseText } : s
                  )
                }));
                
                // --- Step 3: Adding finishing touches (enhance visuals with images) ---
                updateStepStatus(3, 'loading'); // 'Adding finishing touches' (index 3)
                let finalCodeWithImages = finalResponseText;
                try {
                  const { injectPexelsImagesIntoCode } = await import("@/lib/actions/ai");
                  finalCodeWithImages = await injectPexelsImagesIntoCode(finalResponseText, prompt, classificationResult.language);
                  console.log('[App Builder] ✅ Design enhanced with visual elements');
                } catch (error) {
                  console.error('[App Builder] ⚠️ Failed to enhance visuals, using original code:', error);
                  // Keep original code if enhancement fails
                }
                updateStepStatus(3, 'done'); // 'Adding finishing touches' Selesai (index 3)
                set(state => ({
                  aiSteps: state.aiSteps.map((s, i) => 
                    i === 3 ? { ...s, status: 'done' as const, response: 'Design polished successfully' } : s
                  )
                }));
                
                // Use the final code with images
                finalResponseText = finalCodeWithImages;
                
                // Save code to Upstash for app_builder (don't reload after save)
                if (finalResponseText && sessionId) {
                  // Save in background, don't wait for it
                  saveCodeToUpstash(sessionId, finalResponseText).catch(err => {
                    console.error('Failed to save code to Upstash:', err);
                  });
                }
                
                // Save AI steps to Upstash for app_builder (don't reload after save)
                const currentSteps = get().aiSteps;
                if (currentSteps.length > 0 && sessionId) {
                  // Save in background, don't wait for it
                  const { saveAIStepsToUpstash } = await import("@/lib/actions/ai");
                  saveAIStepsToUpstash(sessionId, currentSteps).catch(err => {
                    console.error('Failed to save AI steps to Upstash:', err);
                  });
                }
                
                // Update session title with project name (similar to v0 by vercel)
                // Don't create a chat message - the title will be used in PanelCode
                if (isNewChat) {
                  const title = await generateTitleForChat(prompt, classificationResult.language, images);
                  await renameChatSession(sessionId!, title || "Obrolan Baru");
                  // Don't reload history after save - it causes preview bug
                  // fetchChatSessions will be called when needed (e.g., on sidebar mount)
                  get().fetchChatSessions(true).catch(err => {
                    console.error('Failed to refresh chat sessions:', err);
                  });
                }
                
                // Don't save any message for app_builder - steps are shown in UI, code is in PanelCode
                // Skip the final modelMessage below
                return sessionId;
            }

            if (!finalResponseText) {
                const finalStepIndex = get().aiSteps.length - 1;
                if(finalStepIndex >= 0) updateStepStatus(finalStepIndex, 'loading');
                // Menggunakan gemma-3-27b-it untuk final response
                finalResponseText = await generateFinalResponse(
                    prompt,
                    finalIntent, 
                    classificationResult.summary, 
                    classificationResult.language, 
                    historyForAnalysis, 
                    images,
                    requestType as 'code' | 'finance' | 'app_builder' | 'general',
                    'gemma-3-27b-it'
                );
                if(finalStepIndex >= 0) updateStepStatus(finalStepIndex, 'done');
            }
            if (get().isCancelled) return null;

            // ✅ [PERBAIKAN] Hitung durasi dari startTime hingga sekarang
            const endTime = Date.now();
            const duration = parseFloat(((endTime - startTime) / 1000).toFixed(2));

            // For app_builder mode, don't save finalResponseText as message
            // Title is already generated and saved above, just return
            if (finalIntent === 'app_builder') {
              return sessionId;
            }

            // For other modes, save final response as message
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
                // Don't reload history after save - it causes preview bug
                // fetchChatSessions will be called when needed (e.g., on sidebar mount)
                get().fetchChatSessions(true).catch(err => {
                  console.error('Failed to refresh chat sessions:', err);
                });
            }
            
            // Tambahkan pesan KODE FINAL ke UI
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
            // For app_builder mode, preserve steps instead of clearing
            // Keep steps visible even after completion
            const isAppBuilder = mode === 'app_builder'
            if (!isAppBuilder) {
              // Only clear steps for non-app_builder modes
              set({ isLoading: false, aiSteps: [] });
            } else {
              // For app_builder, keep steps but update loading state
              set({ isLoading: false });
            }
        }
      },
    })
); 