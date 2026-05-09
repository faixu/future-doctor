import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function solveDoubt(query: string, context?: string) {
  const prompt = `You are a NEET Expert AI Tutor. Help the student with their doubt.
  ${context ? `Context: ${context}` : ""}
  User Query: ${query}
  Provide a detailed explanation, NCERT references if possible, and a clear summary.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't process that query right now.";
  }
}

export async function generateQuickQuiz(subject: string, topic: string) {
  const prompt = `Generate a 5-question NEET level MCQ quiz about ${topic} in ${subject}. 
  Return the response in JSON format:
  [{ "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..." }]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
}
