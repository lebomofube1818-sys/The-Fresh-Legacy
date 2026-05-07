import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  /**
   * Recommends a shoe size based on user measurements and preferences
   */
  async recommendSize(measurements: {
    height: number;
    weight: number;
    footWidth: string;
    preferredFit: string;
    targetModel: string;
  }) {
    const prompt = `
      As a senior The Fresh Legacy fit specialist, analyze these user measurements:
      - Height: ${measurements.height}cm
      - Weight: ${measurements.weight}kg
      - Foot Width: ${measurements.footWidth}
      - Preferred Fit: ${measurements.preferredFit}
      - Target Shoe: ${measurements.targetModel}

      Predict the most likely US Shoe Size and provide a 2-sentence explanation of why (mentioning if this shoe runs large or small).
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedSize: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["recommendedSize", "explanation"]
          }
        }
      });
      
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Error:", error);
      return { recommendedSize: "Unknown", explanation: "Unable to calculate at this time." };
    }
  },

  /**
   * Semantic product search
   */
  async smartSearch(query: string, products: any[]) {
    const productListString = products.map(p => `${p.id}: ${p.name} (${p.sport}, ${p.category})`).join('\n');
    
    const prompt = `
      User Query: "${query}"
      Available Products:
      ${productListString}

      Identify the top 3 product IDs that best match the user's natural language intent. 
      Consider sport, style, and use case.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchedIds: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["matchedIds"]
          }
        }
      });
      
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Smart Search Error:", error);
      return { matchedIds: [] };
    }
  }
};
