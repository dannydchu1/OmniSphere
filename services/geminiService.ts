
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client using the API key exclusively from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AssistantResponse {
  text: string;
  groundingLinks?: { title: string; uri: string }[];
}

export const getOmniAssistantResponse = async (
  query: string, 
  location?: { latitude: number; longitude: number }
): Promise<AssistantResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Required for Google Maps Grounding
      contents: `You are OmniAssistant, the Super AI for OmniSphere super app in the Philippines. 
      The app offers: 
      - Social Feed (Mini-FB)
      - Marketplace (E-commerce)
      - Jobs (Job Board)
      - Staycations (Rentals)
      
      User is asking: "${query}"
      
      Use the Google Maps tool to find real places, businesses, and locations if relevant.
      Provide a very concise, friendly response. Use Taglish occasionally. 
      If suggesting a place, mention that it's found via Maps grounding.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: location ? {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          }
        } : undefined,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    const text = response.text || "Pasensya na, I couldn't generate a response.";
    
    // Extract Maps Grounding URLs
    const groundingLinks: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          groundingLinks.push({
            title: chunk.maps.title || "View on Maps",
            uri: chunk.maps.uri
          });
        }
        if (chunk.web) {
          groundingLinks.push({
            title: chunk.web.title || "View Source",
            uri: chunk.web.uri
          });
        }
      });
    }

    return { 
      text, 
      groundingLinks: groundingLinks.length > 0 ? groundingLinks : undefined 
    };
  } catch (error) {
    console.error("AI Error:", error);
    return { text: "Pasensya na, I'm having trouble connecting to the OmniSphere brain (and Maps) right now. Please try again later!" };
  }
};
