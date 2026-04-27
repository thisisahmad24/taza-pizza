import { Link, useNavigate } from "react-router-dom"
import { Pizza, Menu, X, ShoppingBag } from "lucide-react"
import { useState } from "react"
import { useOrderStore } from "../../store/orderStore"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart } = useOrderStore()
  const navigate = useNavigate()
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Pizza Lab", path: "/lab" },
    { name: "Our Roots", path: "/roots" },
    { name: "Find Us", path: "/find-us" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Pizza className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
              <span className="font-heading text-2xl font-bold tracking-tight">
                TAZA <span className="text-primary">PIZZA</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8 ml-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <button 
              onClick={() => navigate('/checkout')}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full -translate-y-1/4 translate-x-1/4">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              to="/lab"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              Order Now
            </Link>
          </div>
          <div className="-mr-2 flex md:hidden items-center gap-4">
            <button 
              onClick={() => navigate('/checkout')}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full -translate-y-1/4 translate-x-1/4">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3 bg-background border-b shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/lab"
              onClick={() => setIsOpen(false)}
              className="block mt-4 px-3 py-2 bg-primary text-center text-primary-foreground rounded-md text-base font-bold"
            >
              Order Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
