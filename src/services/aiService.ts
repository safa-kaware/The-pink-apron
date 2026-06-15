import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "@/lib/useRecipes";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface RescaledRecipeData {
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
}

export interface ParsedRecipeData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  tags: string[];
}

export async function parseRecipeText(text: string): Promise<ParsedRecipeData> {
  const prompt = `
    Parse the following text into a structured recipe.
    Text: ${text}
    
    Extract the title, a brief description, the list of ingredients, and the step-by-step instructions.
    Also, suggest a category (e.g., Breakfast, Lunch, Dinner, Dessert, Snacks, Drinks) and 3-5 relevant tags.
    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          category: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "ingredients", "instructions", "category", "tags"]
      }
    }
  });

  const result = response.text;
  if (!result) {
    throw new Error("Failed to parse recipe text.");
  }

  return JSON.parse(result) as ParsedRecipeData;
}

export async function rescaleRecipe(recipe: Recipe, targetServings: number): Promise<RescaledRecipeData> {
  const prompt = `
    Rescale the following recipe to ${targetServings} servings.
    Original Recipe:
    Title: ${recipe.title}
    Description: ${recipe.description}
    Ingredients: ${recipe.ingredients.join(', ')}
    Instructions: ${recipe.instructions.join('\n')}
    
    Please adjust the quantities of the ingredients accurately. 
    Also, adjust the cooking time and instructions if the change in quantity significantly affects them (e.g., larger batches might need more time, smaller batches might need less).
    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The rescaled list of ingredients with adjusted quantities."
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The adjusted instructions for the new scale."
          },
          cookTime: {
            type: Type.STRING,
            description: "The adjusted cooking time (e.g., '45 mins')."
          }
        },
        required: ["ingredients", "instructions"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate rescaled recipe.");
  }

  return JSON.parse(text) as RescaledRecipeData;
}

export async function generateBatchRecipes(count: number = 10): Promise<ParsedRecipeData[]> {
  const prompt = `
    Generate ${count} unique, creative, and delicious cooking recipes.
    Each recipe should have:
    - title
    - description (brief and engaging)
    - ingredients (list of strings with quantities)
    - instructions (step-by-step list)
    - category (one of: Breakfast, Lunch, Dinner, Dessert, Snacks, Drinks)
    - tags (3-5 relevant tags)
    
    Ensure variety in cuisines and dietary preferences.
    Return the result as an array of JSON objects.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "description", "ingredients", "instructions", "category", "tags"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate recipes.");
  return JSON.parse(text) as ParsedRecipeData[];
}
