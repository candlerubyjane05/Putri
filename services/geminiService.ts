
import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
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
    return "Maaf, asisten cerdas sedang tidak tersedia.";
  }
};

export const summarizeAbstract = async (abstract: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this legal abstract in 3 bullet points in Indonesian:\n\n${abstract}`,
    });
    return response.text;
  } catch (error) {
    return abstract;
  }
};
