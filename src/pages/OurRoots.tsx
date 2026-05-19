import { motion } from 'framer-motion';
import { Leaf, Flame, Users } from 'lucide-react';

export default function OurRoots() {
  const fadeIn: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Immersive Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format&fit=crop" 
            alt="Pizzaiolo working the wood-fired oven" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Our <span className="text-primary">Roots</span>
          </h1>
          <p className="text-xl md:text-3xl text-white/90 font-medium drop-shadow-md">
            From the historic streets of Naples to the heart of Pakistan.
          </p>
        </motion.div>
      </section>

      {/* The Origin Story - Split Layout */}
      <section className="py-20 md:py-32 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="order-2 md:order-1 relative"
          >
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform -rotate-3 z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1555072956-7758afb20e8f?q=80&w=2070&auto=format&fit=crop" 
              alt="Kneading fresh pizza dough" 
              className="relative z-10 w-full rounded-2xl shadow-2xl object-cover h-[500px]"
            />
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="order-1 md:order-2 space-y-8"
          >
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm">
              The Journey
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
              A Obsession with <br/><span className="text-primary">Perfect Fermentation</span>
            </h2>
            <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
              <p>
                Started in 2024, our founders traveled to Naples to learn the ancient art of dough fermentation from legendary master pizzaiolos. We spent months perfecting hydration ratios, flour blending, and temperature control.
              </p>
              <p>
                We brought those tightly-guarded secrets back, combining them with local, premium ingredients to create something truly unique. <strong>"Taza"</strong> means fresh, and that is the unbreakable promise we bake into every single pie that leaves our oven.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values - Premium Card Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Core Values</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Value 1 */}
            <motion.div variants={fadeIn} className="bg-card p-10 rounded-3xl border border-border/50 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4">Uncompromising Freshness</h3>
              <p className="text-foreground/70 leading-relaxed">
                We never freeze our dough. We source our San Marzano tomatoes and basil from local farmers daily to ensure vibrant, explosive flavors.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div variants={fadeIn} className="bg-card p-10 rounded-3xl border border-border/50 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <Flame className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4">Innovation meets Tradition</h3>
              <p className="text-foreground/70 leading-relaxed">
                While our ovens are traditional and our fermentation is classic, our approach to flavor profiles and AI-powered custom recipes is fearlessly modern.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div variants={fadeIn} className="bg-card p-10 rounded-3xl border border-border/50 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4">Community First</h3>
              <p className="text-foreground/70 leading-relaxed">
                We believe a pizzeria should be the heartbeat of its neighborhood. We celebrate local events and foster a welcoming space for all.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action Footer Image */}
      <section className="h-[40vh] relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop" 
            alt="Fresh pizza ingredients" 
            className="w-full h-full object-cover brightness-[0.3]"
          />
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative z-10 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Taste the Difference</h2>
          <a href="/pizza-lab" className="inline-block bg-primary text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-primary/90 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(var(--color-primary),0.4)]">
            Experience the Pizza Lab
          </a>
        </motion.div>
      </section>
    </div>
  );
}
