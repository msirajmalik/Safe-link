import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

// Initialize Gemini Client
// CRITICAL: process.env.API_KEY is assumed to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze the safety and reputation of the following website/domain: "${url}".
    
    Provide a realistic safety assessment based on public knowledge of this domain. 
    If the domain is a known legitimate business (e.g., google.com, amazon.com), rate it high.
    If it looks like a phishing pattern, scam, or unknown low-trust site, rate it lower.
    
    Return the response in a strict JSON structure conforming to the schema.
    Ensure "safetyScore" is between 0 and 100.
    "riskLevel" should be one of: "Safe", "Caution", "High Risk", "Unknown".
    "securityChecklist" should simulate checking for SSL, Malware Status, and Phishing Status based on general domain reputation.
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
    // Fallback/Mock response in case of API error to prevent app crash, 
    // or re-throw if you want to show an error state.
    // For this demo, we'll re-throw to be handled by the component.
    throw error;
  }
};