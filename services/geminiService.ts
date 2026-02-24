
import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah Pustakawan Hukum cerdas untuk FH UNDANA. Bantu mahasiswa menemukan referensi hukum, jelaskan konsep hukum secara sederhana, dan ringkas dokumen penelitian dalam bahasa Indonesia yang formal namun ramah.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, asisten cerdas sedang mengalami gangguan teknis.";
  }
};

export const summarizeAbstract = async (abstract: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ringkas abstrak hukum berikut dalam 3 poin utama yang sangat jelas (Bahasa Indonesia):\n\n${abstract}`,
    });
    return response.text;
  } catch (error) {
    return abstract;
  }
};
