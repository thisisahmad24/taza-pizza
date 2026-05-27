import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, ArrowRight, Quote } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

interface TestimonialItem {
  name: string
  text: string
  rating: number
}

export default function Home() {
  const [dbReviews, setDbReviews] = useState<any[]>([])

  useEffect(() => {
    async function fetchDbReviews() {
      // 1. Try local MongoDB backend first
      try {
        const res = await fetch('http://localhost:5000/api/reviews')
        if (res.ok) {
          const data = await res.json()
          setDbReviews(data.slice(0, 3))
          return
        }
      } catch (err) {
        console.warn("MongoDB review fetch failed, falling back to Supabase/default")
      }

      // 2. Try Supabase
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('comment, rating, created_at')
          .order('created_at', { ascending: false })
          .limit(3)
        if (data) {
          setDbReviews(data)
        }
      } catch (err) {
        console.warn("Supabase review fetch failed:", err)
      }
    }
    fetchDbReviews()
  }, [])

  const defaultTestimonials: TestimonialItem[] = [
    { name: "Sarah M.", text: "The best crust I've ever had. Period. The AI flavor suggestion in the Lab was spot on!", rating: 5 },
    { name: "Zainab R.", text: "Unbelievably fast delivery to DHA. ETA adjusted automatically for the rain and it was on point!", rating: 5 },
    { name: "Haris K.", text: "Taza Pizza brings authentic wood-fired smokiness to Clifton. My absolute favorite spot in Karachi.", rating: 5 }
  ]

  // Combine dynamic db reviews with default reviews
  const testimonials: TestimonialItem[] = [
    ...dbReviews.map(review => ({
      name: review.userId?.name || "Customer Feedback",
      text: review.comment || "Absolutely delicious, wood-fired to perfection!",
      rating: review.rating || 5
    })),
    ...defaultTestimonials
  ].slice(0, 6) // Show up to 6 reviews in a grid

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32 pb-16">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-sm text-primary font-bold">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-ping"></span>
                  Gourmet Wood-Fired Experience
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter font-heading text-foreground">
                  The True Taste of <br className="hidden lg:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Taza Pizza</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-lg">
                  Artisanal pizzas crafted with organic ingredients, 48-hour slow-fermented sourdough, and the perfect blistered char from our oak-wood ovens.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/lab"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg hover:shadow-primary/30 transition-all hover:bg-primary/95 flex items-center gap-2 group"
                >
                  Order Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/roots"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 text-sm font-bold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Our Story
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto lg:ml-auto w-full max-w-[500px] lg:max-w-none relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-orange-400/20 rounded-full blur-3xl" />
              <div className="aspect-square relative rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-900 flex items-center justify-center bg-orange-100">
                 <img 
                   src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop" 
                   alt="Delicious wood-fired pizza" 
                   className="w-full h-full object-cover"
                 />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter">Loved by Locals</h2>
            <p className="text-muted-foreground mx-auto max-w-[600px] text-lg">
              Hear what our amazing customers have to say. Reviews are fetched live from customer feedback!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-3xl shadow-md border border-border/50 relative flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4 text-muted-foreground/10">
                  <Quote className="w-12 h-12" />
                </div>
                <div>
                  <div className="flex gap-1 text-primary mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current text-yellow-400" />)}
                  </div>
                  <p className="mb-6 text-foreground/80 italic leading-relaxed text-sm">"{t.text}"</p>
                </div>
                <p className="font-extrabold text-foreground border-t pt-4 border-border/40 text-sm">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
