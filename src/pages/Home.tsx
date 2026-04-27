import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"

export default function Home() {
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
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                  Wood-fired perfection
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter font-heading text-foreground">
                  The True Taste of <br className="hidden lg:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Taza Pizza</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience artisanal pizzas crafted with fresh ingredients, slow-fermented dough, and the perfect wood-fired char.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/lab"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Order Now
                </Link>
                <Link
                  to="/roots"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
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
              {/* Fallback styling for image using CSS gradients since we don't have actual images yet */}
              <div className="aspect-square relative rounded-full bg-orange-100 overflow-hidden shadow-2xl border-4 border-white flex items-center justify-center">
                 <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-300 via-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-inner">
                    [Pizza Image placeholder]
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl">Loved by Locals</h2>
            <p className="text-muted-foreground mx-auto max-w-[600px]">Don't just take our word for it. Hear what our amazing customers have to say.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah M.", text: "The best crust I've ever had. Period. The AI flavor suggestion was surprisingly spot on!" },
              { name: "David L.", text: "Fast delivery, incredible taste, and love the dynamic tracking feature. Always fresh!" },
              { name: "Amna K.", text: "Taza Pizza brings a modern twist to classic Italian flavors. My absolute favorite spot." }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-2xl shadow-sm border border-border"
              >
                <div className="flex gap-1 text-primary mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="mb-4 text-foreground/80 italic">"{t.text}"</p>
                <p className="font-semibold">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
