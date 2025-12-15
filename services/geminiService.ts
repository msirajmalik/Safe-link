import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

// Initialize Gemini Client
// CRITICAL: process.env.API_KEY is assumed to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze the website "${url}" for safety, reputation, and content.
    
    1. Determine the Safety Score (0-100) and Risk Level (Safe, Caution, High Risk).
    2. Provide a concise Summary (2-3 sentences) describing what the site does and its trustworthiness.
    3. Categorize the site (e.g., E-commerce, News, Social, Phishing, Adult, Gambling).
    4. Estimate "Popularity" (High Traffic, Moderate, Low/Niche, New/Unknown).
    5. Estimate "Server Location" based on typical hosting for this type of domain (or "Global").
    6. List Pros (Trust signals) and Cons (Risk signals).
    7. Create a Security Checklist for: "SSL Certificate", "Malware Check", "Domain Age", "Phishing Lists". Status should be Active (Good) or Inactive/Unknown (Bad).

    Return strict JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            domain: { type: Type.STRING },
            safetyScore: { type: Type.INTEGER },
            riskLevel: { type: Type.STRING, enum: [RiskLevel.SAFE, RiskLevel.CAUTION, RiskLevel.HIGH_RISK, RiskLevel.UNKNOWN] },
            summary: { type: Type.STRING },
            category: { type: Type.STRING },
            popularity: { type: Type.STRING },
            serverLocation: { type: Type.STRING },
            pros: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            securityChecklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['Active', 'Inactive', 'Unknown'] },
                  description: { type: Type.STRING }
                },
                required: ['feature', 'status', 'description']
              }
            }
          },
          required: ['domain', 'safetyScore', 'riskLevel', 'summary', 'category', 'pros', 'cons', 'securityChecklist'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(text) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};