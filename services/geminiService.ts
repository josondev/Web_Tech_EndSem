import { GoogleGenAI, Type } from "@google/genai";
import { ScrapedEvent } from "../types";

export interface AISuggestions {
  suggestedDescription: string;
  suggestedTasks: string[];
}

export const getEventSuggestions = async (
  prompt: string
): Promise<AISuggestions | null> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedDescription: {
              type: Type.STRING,
              description: "An engaging, well-written description for the event.",
            },
            suggestedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "A list of suggested tasks to complete for the event.",
            },
          },
          required: ["suggestedDescription", "suggestedTasks"],
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return null;
  }
};

export const scrapeEventsByLocation = async (
  locationQuery: string
): Promise<ScrapedEvent[] | null> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find 5 plausible, upcoming public events for the following location: "${locationQuery}"`,
            config: {
                systemInstruction: "You are a helpful assistant that finds local events and returns them *only* in a structured JSON array format, conforming to the provided schema. Do not add any commentary or markdown.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            date: { type: Type.STRING },
                            location: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ["name", "date", "location", "description"]
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error scraping events:", error);
        return null;
    }
};