import { GoogleGenAI, Type } from "@google/genai";
import type { UserPreferences } from '../types';

let ai: GoogleGenAI | null = null;

/**
 * Initializes and returns the GoogleGenAI client instance.
 * This function uses a singleton pattern to ensure the client is created only once.
 */
const getGenAIClient = () => {
  if (!ai) {
    // The App component checks for process.env.API_KEY before calling any functions
    // that use this service, so we can be confident the key exists here.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};


const offerSchema = {
    type: Type.OBJECT,
    properties: {
        source: { type: Type.STRING, enum: ["Amazon", "Flipkart", "Other"] },
        price: { type: Type.STRING, description: "Price with currency, e.g., '$189.99' or '₹14,500'." },
        url: { type: Type.STRING, description: "A dummy URL to the product page, e.g., https://example.com/product." }
    },
    required: ["source", "price", "url"]
};

const productSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Full name of the product." },
    description: { type: Type.STRING, description: "A concise, compelling description of the product." },
    imageUrl: { type: Type.STRING, description: "A placeholder image URL from picsum.photos, e.g., https://picsum.photos/400/300." },
    offers: {
        type: Type.ARRAY,
        description: "A list of offers for this product from different e-commerce sources.",
        items: offerSchema
    }
  },
  required: ["name", "description", "imageUrl", "offers"],
};


export async function generateProductRecommendations(query: string, preferences: UserPreferences) {
  try {
    const client = getGenAIClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the user query "${query}" and preferences: Budget - ${preferences.budget}, Preferred Brands - ${preferences.preferredBrands.join(', ')}, Sustainability Focus - ${preferences.sustainabilityFocus ? 'Yes' : 'No'}, find 3 to 5 relevant products. For each product, provide offers from at least two sources like Amazon and Flipkart if possible. Provide a brief conversational opening before the product list.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response_text: {
              type: Type.STRING,
              description: "A friendly, conversational text response to the user's query that introduces the products."
            },
            products: {
              type: Type.ARRAY,
              items: productSchema
            }
          },
          required: ["response_text", "products"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    return parsedData;

  } catch (error) {
    console.error("Error generating product recommendations:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("The provided API Key is not valid. Please check your configuration.");
    }
    throw new Error("I had trouble finding products. Please try again.");
  }
}

export async function summarizeReviews(productName: string) {
  try {
    const client = getGenAIClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert product review analyst. Summarize the key pros and cons for the product "${productName}". Structure your response with 'Pros:' and 'Cons:' sections. Provide a balanced overview based on common customer feedback points like performance, build quality, and value for money. Keep it concise.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing reviews:", error);
    throw new Error("Could not generate a review summary at this time.");
  }
}