import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrderStore } from '../store/orderStore';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

// Define the Menu Categories
const CATEGORIES = ["All", "Pizzas", "Starters", "Beverages", "Desserts"];

// Low-cost, premium menu items
const MENU_ITEMS = [
  // Pizzas
  { id: 1, name: "Margherita Classico", category: "Pizzas", price: 5.99, description: "San Marzano tomato sauce, fresh mozzarella, and basil.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop" },
  { id: 2, name: "Spicy Pepperoni", category: "Pizzas", price: 6.99, description: "Double pepperoni, chili flakes, and hot honey drizzle.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2080&auto=format&fit=crop" },
  { id: 3, name: "Truffle Mushroom", category: "Pizzas", price: 8.99, description: "Wild mushrooms, truffle oil, roasted garlic, and ricotta.", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "BBQ Chicken Supreme", category: "Pizzas", price: 7.99, description: "Smoked chicken, red onions, cilantro, and BBQ sauce.", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop" },
  
  // Starters
  { id: 5, name: "Garlic Breadsticks", category: "Starters", price: 2.99, description: "Oven-baked with garlic butter and parmesan.", img: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, name: "Caprese Salad", category: "Starters", price: 4.50, description: "Fresh mozzarella, tomatoes, balsamic glaze.", img: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=1969&auto=format&fit=crop" },
  
  // Beverages
  { id: 7, name: "Craft Lemonade", category: "Beverages", price: 1.99, description: "Freshly squeezed lemons with a hint of mint.", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1974&auto=format&fit=crop" },
  { id: 8, name: "Iced Peach Tea", category: "Beverages", price: 2.49, description: "Brewed black tea infused with sweet peach nectar.", img: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=1964&auto=format&fit=crop" },
  
  // Desserts
  { id: 9, name: "Classic Tiramisu", category: "Desserts", price: 3.99, description: "Espresso-soaked ladyfingers with mascarpone cream.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=1974&auto=format&fit=crop" },
  { id: 10, name: "Vanilla Bean Gelato", category: "Desserts", price: 2.99, description: "Authentic Italian gelato made with real vanilla beans.", img: "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?q=80&w=2027&auto=format&fit=crop" },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart } = useOrderStore();

  const filteredItems = activeCategory === "All" 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const handleAddToCart = (item: any) => {
    addToCart({ name: item.name, price: item.price });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Immersive Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" 
            alt="Premium Restaurant Dining" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-4 tracking-tight drop-shadow-lg">
            Our <span className="text-primary">Menu</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md">
            Premium ingredients. Artisanal quality. Unbeatable prices.
          </p>
        </div>
      </section>

      {/* Category Navigation Tabs */}
      <section className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 py-4 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 md:justify-center min-w-max">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                  activeCategory === category 
                    ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                    : 'bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredItems.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id} 
              className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full font-black text-primary shadow-sm">
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  {item.category}
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">{item.name}</h3>
                <p className="text-foreground/70 text-sm mb-6 flex-grow">{item.description}</p>
                
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all group/btn"
                >
                  <ShoppingBag className="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
