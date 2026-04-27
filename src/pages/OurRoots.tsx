export default function OurRoots() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Roots</h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8"></div>
        </div>
        
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="lead text-xl text-muted-foreground font-medium mb-8 text-center">
            Taza Pizza was born from a simple belief: pizza shouldn't just be fast food, it should be an experience.
          </p>
          
          <div className="aspect-video bg-muted rounded-2xl mb-8 flex items-center justify-center border text-muted-foreground">
            [Pizzaiolo Image Placeholder]
          </div>
          
          <h2 className="text-2xl font-heading font-bold mt-12 mb-4">The Taza Story</h2>
          <p>
            Started in 2024, our founders traveled to Naples to learn the ancient art of dough fermentation. We brought those secrets back, combining them with local, fresh ingredients to create something truly unique. "Taza" means fresh, and that's the promise we make with every single pie that leaves our oven.
          </p>
          
          <h2 className="text-2xl font-heading font-bold mt-12 mb-4">Our Core Values</h2>
          <ul className="space-y-4 mt-4">
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">1</span>
              <div>
                <strong>Uncompromising Freshness:</strong> We never freeze our dough and we source our produce from local farmers daily.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">2</span>
              <div>
                <strong>Innovation meets Tradition:</strong> While our ovens are traditional, our approach to flavor is modern and boundary-pushing.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">3</span>
              <div>
                <strong>Community First:</strong> We believe a pizzeria should be the heartbeat of its neighborhood.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
