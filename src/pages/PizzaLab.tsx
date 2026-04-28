import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Loader2, Pizza as PizzaIcon, Plus } from "lucide-react"
import { generateCustomPizza, type CustomPizza } from "../services/ai"
import { useOrderStore } from "../store/orderStore"

import { toast } from "sonner"

export default function PizzaLab() {
  const [preferences, setPreferences] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPizza, setGeneratedPizza] = useState<CustomPizza | null>(null)
  const [error, setError] = useState("")
  
  const { addToCart } = useOrderStore()


  const handleGenerate = async () => {
    if (!preferences.trim()) {
      setError("Please enter some preferences first!")
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedPizza(null)

    try {
      const pizza = await generateCustomPizza(preferences)
      setGeneratedPizza(pizza)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOrderCustom = () => {
    if (generatedPizza) {
      addToCart({
        name: generatedPizza.name,
        price: generatedPizza.price
      })
      toast.success(`${generatedPizza.name} added to cart!`)
      setGeneratedPizza(null)
      setPreferences("")
    }
  }

  const handleOrderClassic = (item: {name: string, price: number}) => {
    addToCart(item)
    toast.success(`${item.name} added to cart!`)
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-8">
        The <span className="text-primary">Pizza Lab</span>
      </h1>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16 text-lg">
        Welcome to the lab! Here you can order from our handcrafted menu or use our AI to create a unique flavor profile just for you.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Classic Menu - Static for now */}
        <div className="p-8 border rounded-3xl bg-card shadow-sm h-fit">
          <h2 className="text-2xl font-bold font-heading mb-6">Classic Menu</h2>
          <div className="space-y-6">
            {[
              { name: "Margherita Originale", desc: "San Marzano tomatoes, fresh mozzarella, basil, EVOO", price: 16.99 },
              { name: "Diavola Spicy", desc: "Spicy salami, chili flakes, mozzarella, hot honey", price: 19.99 },
              { name: "Truffle Mushroom", desc: "Wild mushrooms, truffle cream, fontina, thyme", price: 21.99 }
            ].map(item => (
              <div key={item.name} className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b last:border-0 last:pb-0 gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-lg font-bold">${item.price}</div>
                  <button 
                    onClick={() => handleOrderClassic(item)}
                    className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Feature */}
        <div className="p-8 border-2 border-primary/20 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 shadow-lg relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl font-medium text-sm flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> AI Powered
          </div>
          
          <h2 className="text-2xl font-bold font-heading mb-2 text-primary">Create Your Own</h2>
          <p className="mb-6 text-foreground/80">Tell our AI chef what flavors you love, and we'll craft a custom recipe.</p>
          
          {!generatedPizza ? (
            <div className="space-y-4 flex-grow flex flex-col">
              <textarea 
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="w-full flex-grow min-h-[150px] p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all shadow-inner"
                placeholder="E.g., I love spicy food, garlic, and mushrooms, but no olives. Make it sound fancy!"
                disabled={isGenerating}
              />
              {error && <p className="text-destructive text-sm font-medium">{error}</p>}
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Consulting the Chef...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Custom Pizza
                  </>
                )}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-grow flex flex-col bg-background/80 backdrop-blur-sm rounded-2xl p-6 border shadow-sm"
            >
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-bold font-heading text-primary leading-tight">{generatedPizza.name}</h3>
                  <span className="text-xl font-bold ml-4 shrink-0">${generatedPizza.price}</span>
                </div>
                <p className="text-muted-foreground italic mb-6">"{generatedPizza.description}"</p>
                
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <PizzaIcon className="w-4 h-4 text-orange-500" /> 
                  Premium Ingredients:
                </h4>
                <ul className="grid grid-cols-2 gap-2 mb-6">
                  {generatedPizza.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm bg-secondary px-3 py-1.5 rounded-md border text-center font-medium">
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button 
                  onClick={() => setGeneratedPizza(null)}
                  className="py-3 border border-input bg-background rounded-xl font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Try Again
                </button>
                <button 
                  onClick={handleOrderCustom}
                  className="py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-dark transition-colors"
                >
                  Order This
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
