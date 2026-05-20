import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2, Pizza as PizzaIcon, BrainCircuit } from "lucide-react"
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
      setError("Please enter your flavor cravings first!")
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedPizza(null)

    try {
      const pizza = await generateCustomPizza(preferences)
      setGeneratedPizza(pizza)
    } catch (err) {
      setError(err instanceof Error ? err.message : "The AI Chef encountered an error.")
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
      toast.success(`${generatedPizza.name} added to your cart!`, {
        icon: '🍕'
      })
      setGeneratedPizza(null)
      setPreferences("")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/30 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 max-w-5xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold tracking-wide text-sm mb-6 border border-primary/20">
            <BrainCircuit className="w-5 h-5" />
            Machine Learning Kitchen
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Pizza Lab</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Welcome to the frontier of flavor. Let our trained Neural Network synthesize a completely unique recipe based on your wildest cravings.
          </p>
        </motion.div>
      </section>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10 mt-8">
        {/* AI Feature Workspace */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-full"
        >
          <div className="relative p-1 rounded-3xl bg-gradient-to-br from-primary/30 via-orange-400/20 to-transparent h-full shadow-2xl">
            <div className="absolute top-0 right-0 p-6 z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-primary/20 text-xs font-bold text-primary shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                AI SYSTEM ONLINE
              </div>
            </div>

            <div className="bg-card/90 backdrop-blur-2xl rounded-[23px] p-8 md:p-10 h-full flex flex-col relative overflow-hidden">
              {/* Internal Decorative glow */}
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

              <h2 className="text-3xl font-bold font-heading mb-3 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                Synthesize Custom Pizza
              </h2>
              <p className="mb-8 text-foreground/60 text-lg">Input your desired flavor profile, dietary constraints, or crazy cravings. The AI will engineer a masterpiece.</p>
              
              <AnimatePresence mode="wait">
                {!generatedPizza ? (
                  <motion.div 
                    key="input-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-grow flex flex-col"
                  >
                    <div className="relative flex-grow mb-6">
                      <textarea 
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        className="w-full h-full min-h-[200px] p-6 rounded-2xl border-2 border-border/50 bg-background/50 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none resize-none transition-all text-lg placeholder:text-foreground/30 shadow-inner"
                        placeholder="E.g., I want something extremely spicy with beef and jalapenos, but I also love sweet contrast like pineapple..."
                        disabled={isGenerating}
                      />
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-medium flex items-center gap-2">
                        <span className="text-xl">⚠️</span> {error}
                      </motion.div>
                    )}

                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full py-5 bg-gradient-to-r from-primary to-orange-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="tracking-wide">Synthesizing Recipe...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          <span className="tracking-wide">Generate Masterpiece</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="result-card"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex-grow flex flex-col bg-background rounded-3xl p-8 border-2 border-primary/20 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-400 to-primary"></div>
                    
                    <div className="flex-grow">
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full mb-4 uppercase tracking-wider">
                        AI Synthesized Result
                      </div>
                      
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <h3 className="text-3xl font-black font-heading leading-tight">{generatedPizza.name}</h3>
                        <div className="text-2xl font-black text-primary shrink-0 bg-primary/5 px-4 py-2 rounded-xl">
                          ${generatedPizza.price}
                        </div>
                      </div>
                      
                      <p className="text-foreground/70 italic mb-8 text-lg border-l-4 border-primary/30 pl-4 py-1">
                        "{generatedPizza.description}"
                      </p>
                      
                      <h4 className="font-bold mb-4 flex items-center gap-2 text-foreground/80 uppercase tracking-wide text-sm">
                        <PizzaIcon className="w-4 h-4 text-primary" /> 
                        Flavor Profile & Ingredients
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                        {generatedPizza.ingredients.map((ing, i) => (
                          <span key={i} className="px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-xl text-sm font-semibold border border-border/50">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                      <button 
                        onClick={() => setGeneratedPizza(null)}
                        className="py-4 rounded-xl font-bold border-2 border-border hover:bg-muted transition-colors"
                      >
                        Discard & Restart
                      </button>
                      <button 
                        onClick={handleOrderCustom}
                        className="py-4 bg-primary text-white rounded-xl font-bold shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
