import { Link } from "react-router-dom"
import { Pizza, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Pizza className="h-8 w-8 text-primary" />
              <span className="font-heading text-2xl font-bold tracking-tight">
                TAZA <span className="text-primary">PIZZA</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              Handcrafted, wood-fired pizzas made with love and the freshest ingredients. Taste the tradition in every slice.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/lab" className="hover:text-primary transition-colors">Pizza Lab</Link></li>
              <li><Link to="/roots" className="hover:text-primary transition-colors">Our Roots</Link></li>
              <li><Link to="/find-us" className="hover:text-primary transition-colors">Find Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>123 Pizza Lane, Food City, FC 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: hello@tazapizza.com</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Taza Pizza. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
