import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { GoogleGenAI, Type } from "@google/genai";

export const getEventSuggestions = async (req: AuthRequest, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }
  
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set on server");
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
    res.json(JSON.parse(jsonText));

  } catch (error: any) {
    console.error("Error fetching AI suggestions:", error);
    res.status(500).json({ message: 'Failed to get suggestions from AI.' });
  }
};


export const scrapeEventsByLocation = async (req: AuthRequest, res: Response) => {
    const { locationQuery } = req.body;
    if (!locationQuery) {
        return res.status(400).json({ message: 'Location query is required' });
    }

    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set on server");
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
        res.json(JSON.parse(jsonText));

    } catch (error: any) {
        console.error("Error scraping events:", error);
        res.status(500).json({ message: 'Failed to scrape events for location.' });
    }
};
