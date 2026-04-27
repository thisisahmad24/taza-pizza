export default function PizzaLab() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-8">
        The <span className="text-primary">Pizza Lab</span>
      </h1>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16 text-lg">
        Welcome to the lab! Here you can order from our handcrafted menu or use our AI to create a unique flavor profile just for you.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Placeholder for Menu */}
        <div className="p-8 border rounded-3xl bg-card shadow-sm">
          <h2 className="text-2xl font-bold font-heading mb-6">Classic Menu</h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">Menu items loading...</p>
          </div>
        </div>

        {/* Placeholder for AI Feature */}
        <div className="p-8 border-2 border-primary/20 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl font-medium text-sm">
            AI Powered
          </div>
          <h2 className="text-2xl font-bold font-heading mb-6 text-primary">Create Your Own</h2>
          <p className="mb-6 text-foreground/80">Tell our AI chef what flavors you love, and we'll craft a custom recipe.</p>
          
          <div className="space-y-4">
            <textarea 
              className="w-full h-32 p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all"
              placeholder="E.g., I love spicy food, garlic, and mushrooms, but no olives..."
            />
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary-dark transition-all active:scale-[0.98]">
              Generate Custom Pizza
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
