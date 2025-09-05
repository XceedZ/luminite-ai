"use server"

import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY || "")

// [FINAL] Fungsi untuk menghasilkan 3 sugesti singkat
export async function generateSuggestions() {
    console.log("AI: Generating initial suggestions...");
    const suggestionPrompt = `
      You are an AI Finance Assistant for Indonesian SMEs.
      Generate exactly 3-4 SHORT, actionable suggestions for a user's first question. Each suggestion should be a maximum of 5 words.
      For each suggestion, provide a relevant icon name from the Tabler Icons set. The icon name MUST be in PascalCase format (e.g., "IconCash", "IconChartBar", "IconReceipt2", "IconArrowTrendingUp").
      Return the result ONLY as a valid JSON object with a key "suggestions" which is an array of objects, each containing "text" and "icon".
  
      Example JSON format:
      {
        "suggestions": [
          { "text": "Catat pengeluaran harian", "icon": "IconReceipt2" },
          { "text": "Ringkas cash flow", "icon": "IconChartBar" },
          { "text": "Analisis data penjualan", "icon": "IconArrowTrendingUp" }
        ]
      }
  
      **IMPORTANT: Your entire response must be ONLY the JSON object, without any surrounding text or markdown formatting.**
      
      JSON Output:
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "models/gemma-3n-e4b-it",
        contents: suggestionPrompt,
      });
      
      const responseText = response.text;
      const jsonMatch = responseText.match(/{[\s\S]*}/);
  
      if (jsonMatch && jsonMatch[0]) {
        const parsed = JSON.parse(jsonMatch[0]);
        // [PERUBAHAN] Menambahkan console.log untuk hasil sugesti
        console.log("Full Suggestions Result:", parsed.suggestions);
        return parsed.suggestions || [];
      } else {
        throw new Error("Failed to extract valid JSON for suggestions.");
      }
    } catch (error) {
      console.error("Suggestion AI Error:", error);
      return [
        { "text": "Catat pengeluaran", "icon": "IconReportMoney" },
        { "text": "Ringkas cash flow", "icon": "IconCashMove" },
        { "text": "Tips keuangan", "icon": "IconBulb" },
      ];
    }
  }

// --- Fungsi Pipeline Chat Utama (Non-Streaming) ---

async function classifyAndSummarize(prompt: string): Promise<{ language: string; intent: string; summary: string; mood: string; rawResponse: string }> {
    console.log("AI Step 1: Classifying prompt...");
    const classificationPrompt = `
      Analyze the user prompt. Your tasks are:
      1. Detect the user's language (e.g., "Indonesian", "English").
      2. Classify the user's intent based on financial context for SMEs.
      3. **Elaborate on the user's true underlying request. Explain what the user actually wants to achieve with their prompt. This elaboration must be in the detected language.**
      4. Detect the user's mood (e.g., "neutral", "positive", "negative", "urgent").
      Return ONLY a valid JSON object with the keys "language", "intent", "summary" (which contains the elaboration from task 3), and "mood".
      
      User Prompt: "${prompt}"
      
      JSON Output:
    `;
    try {
      const response = await ai.models.generateContent({
        model: "models/gemma-3n-e4b-it",
        contents: classificationPrompt
      });
      const responseText = response.text;
      const jsonMatch = responseText.match(/{[\s\S]*}/);
      if (jsonMatch && jsonMatch[0]) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log("AI Step 1 Result:", parsed);
        return { ...parsed, rawResponse: responseText };
      }
      throw new Error("Failed to extract valid JSON from classification response.");
    } catch (error) {
      console.error("Classification AI Error:", error);
      return { language: "Indonesian", intent: "general_question", summary: `Pengguna bertanya: "${prompt}"`, mood: "neutral", rawResponse: "AI classification failed to produce valid JSON." };
    }
  }

async function generateFinalResponse(originalPrompt: string, intent: string, summary: string, language: string): Promise<string> {
    console.log(`AI Step 2: Generating final response with intent: ${intent}`);
    
    const finalPrompt = `
      **System Instruction:**
      You are "Luminite", an expert AI Finance & Expense Assistant specifically for Indonesian SMEs (UMKM). Your personality is helpful, professional, and encouraging.
      Your primary functions are:
      1.  Expense Categorization
      2.  Cashflow Analysis
      3.  Revenue Prediction
      4.  Actionable Insights
  
      **If the user's prompt is a simple greeting, a thank you, or a general off-topic question, provide a brief, friendly, and professional response, then gently guide the conversation back to your main financial functions.**
  
      **Task:**
      A user has a request with the classified intent of "${intent}".
      Here is a summary of their request: "${summary}".
      The user is communicating in **${language}**. You **MUST** respond in **${language}**.
      
      **User's Original Prompt:** "${originalPrompt}"
  
      **Your Response (in ${language}):**
    `;
  
    try {
      const response = await ai.models.generateContent({
          model: "models/gemma-3-27b-it",
          contents: finalPrompt
      });
      return response.text;
    } catch (error) {
      console.error("Generation AI Error:", error);
      throw new Error("Failed to generate final content from Google AI.");
    }
  }

export async function generateContent(prompt: string) {
  const startTime = Date.now();
  try {
    const classificationResult = await classifyAndSummarize(prompt);
    const finalResponseText = await generateFinalResponse(
      prompt,
      classificationResult.intent,
      classificationResult.summary,
      classificationResult.language
    );
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    return { 
      classification: classificationResult,
      duration: duration,
      text: finalResponseText 
    };
  } catch (error: any) {
    return { error: error.message || "An unknown error occurred." };
  }
}