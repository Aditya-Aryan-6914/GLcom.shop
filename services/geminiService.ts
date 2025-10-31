
import { GoogleGenAI, Type } from "@google/genai";
import type { UserPreferences } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const productSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Full name of the product." },
    description: { type: Type.STRING, description: "A concise, compelling description of the product." },
    price: { type: Type.STRING, description: "The price of the product, including currency symbol (e.g., '$199.99' or '₹15,000')." },
    source: { type: Type.STRING, enum: ["Amazon", "Flipkart", "Other"], description: "The e-commerce source of the product." },
    imageUrl: { type: Type.STRING, description: "A placeholder image URL from picsum.photos, e.g., https://picsum.photos/400/300." },
  },
  required: ["name", "description", "price", "source", "imageUrl"],
};

export async function generateProductRecommendations(query: string, preferences: UserPreferences) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the user query "${query}" and preferences: Budget - ${preferences.budget}, Preferred Brands - ${preferences.preferredBrands.join(', ')}, Sustainability Focus - ${preferences.sustainabilityFocus ? 'Yes' : 'No'}, find 3 to 5 relevant products. Provide a brief conversational opening before the product list.`,
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
    throw new Error("I had trouble finding products. Please try again.");
  }
}

export async function summarizeReviews(productName: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert product review analyst. Summarize the key pros and cons for the product "${productName}". Structure your response with 'Pros:' and 'Cons:' sections. Provide a balanced overview based on common customer feedback points like performance, build quality, and value for money. Keep it concise.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing reviews:", error);
    throw new Error("Could not generate a review summary at this time.");
  }
}
