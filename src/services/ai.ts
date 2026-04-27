import { GoogleGenAI } from "@google/genai"

// We use Vite's import.meta.env to access environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: apiKey || "dummy_key" })

export interface CustomPizza {
  name: string
  description: string
  ingredients: string[]
  price: number
}

export async function generateCustomPizza(preferences: string): Promise<CustomPizza> {
  if (!apiKey) {
    console.warn("No Gemini API key found. Returning mock data.")
    return {
      name: "The AI Placeholder Pie",
      description: "A delicious placeholder pizza since the API key is missing. Add your VITE_GEMINI_API_KEY to .env to see the magic!",
      ingredients: ["Tomato Sauce", "Mozzarella", "Basil", "AI Magic"],
      price: 18.99
    }
  }

  const prompt = `
    You are an expert, world-class Pizzaiolo working for 'Taza Pizza', a premium artisanal pizzeria.
    A customer has given you these flavor preferences/ingredients: "${preferences}".
    
    Create a highly gourmet, mouth-watering pizza recipe based on these preferences. 
    Make sure it sounds delicious, premium, and well-balanced.
    
    Return the result EXACTLY as a JSON object with this structure:
    {
      "name": "Creative and appetizing name for the pizza",
      "description": "A 2-3 sentence mouth-watering description of the flavor profile",
      "ingredients": ["Array", "of", "5-8", "specific", "premium", "ingredients"],
      "price": 22.99 (a float between 18.00 and 28.00)
    }
    
    Do not include any markdown formatting, just the raw JSON string.
  `

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    const text = response.text || ""
    // Strip markdown formatting if it accidentally included it (like ```json ... ```)
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()
    
    const pizza: CustomPizza = JSON.parse(cleanJson)
    return pizza
  } catch (error) {
    console.error("Error generating pizza:", error)
    throw new Error("Failed to generate custom pizza. Please try again.")
  }
}
