import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (prompt: string) => {
  try {
    // Correctly using the API_KEY from the environment variable context
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful Law Librarian for FH UNDANA (Faculty of Law, University of Nusa Cendana). Help students find legal resources, explain legal concepts simply, and summarize research papers.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, asisten cerdas sedang tidak tersedia. Mohon periksa konfigurasi API Key.";
  }
};

export const summarizeAbstract = async (abstract: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this legal abstract in 3 bullet points in Indonesian:\n\n${abstract}`,
    });
    return response.text;
  } catch (error) {
    console.error("Summarization Error:", error);
    return abstract;
  }
};