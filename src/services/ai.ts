export interface CustomPizza {
  name: string
  description: string
  ingredients: string[]
  price: number
}

export async function generateCustomPizza(preferences: string): Promise<CustomPizza> {
  try {
    // Call our locally trained pure-Python machine learning suggestion engine!
    const response = await fetch(`http://localhost:5000/api/predict/suggest?keywords=${encodeURIComponent(preferences)}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch suggestions from local ML engine.");
    }
    
    const data = await response.json();
    
    if (!data.success || !data.suggestions || data.suggestions.length === 0) {
      throw new Error("No pizzas found matching your cravings.");
    }
    
    // Take the absolute best matching pizza suggested by the ML engine
    const topSuggestion = data.suggestions[0];
    
    return {
      name: topSuggestion.name,
      description: `A masterfully crafted recommendation based on your preferences! Features a brilliant flavor profile driven by: ${topSuggestion.tags.join(', ')}.`,
      ingredients: topSuggestion.tags,
      price: 18.99 + (topSuggestion.pizza_id * 0.5) // Dynamic price generation
    };
  } catch (error) {
    console.error("Error fetching ML pizza suggestion:", error);
    // Fallback if local backend is down
    return {
      name: "The ML Fallback Pie",
      description: "Our backend ML server is currently asleep. Please run 'node server/server.js' to see the magic!",
      ingredients: ["Cheese", "Tomato", "ML Magic"],
      price: 15.99
    };
  }
}
