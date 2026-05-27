import { useState, useEffect } from "react"
import { MapPin, Clock, Phone, Mail, Send, Award } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { toast } from "sonner"

// Define custom shop pin for the Clifton location
const pizzaShopIcon = L.divIcon({
  className: "custom-shop-findus-icon",
  html: `<div class="bg-primary text-white p-3 rounded-full shadow-xl border-2 border-white flex items-center justify-center animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pizza"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="M2 12C2 6.5 6.5 2 12 2c5.3 0 9.6 4.1 9.9 9.3l-9.9.7-.7 9.9C6.1 21.6 2 17.3 2 12Z"/><path d="M16 16c-3 0-6-3-6-6"/></svg></div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22]
})

export default function FindUs() {
  const shopCoords: [number, number] = [24.8302, 67.0345] // Teen Talwar, Clifton, Karachi

  // Contact Form State
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    
    // Simulate sending message
    setTimeout(() => {
      setIsSending(false)
      toast.success("Thank you for reaching out! We'll reply within 24 hours.")
      setFirstName("")
      setLastName("")
      setEmail("")
      setMessage("")
    }, 1200)
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
      <div className="text-center mb-16 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-sm text-primary font-bold">
          <Award className="w-4 h-4" /> Original Wood-Fired Taste
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight">Visit The <span className="text-primary">Pizza Lab</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Drop by our flagship Clifton branch to enjoy hot, bubbly wood-fired pizzas fresh from our brick oven, or get in touch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400"></div>
            <h2 className="text-2xl font-heading font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Location</h3>
                  <p className="text-foreground/70 mt-1">Teen Talwar, Clifton, Block 8, Karachi, Pakistan</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Opening Hours</h3>
                  <p className="text-foreground/70 mt-1">Monday - Thursday: 12:00 PM - 12:00 AM</p>
                  <p className="text-foreground/70">Friday - Sunday: 12:00 PM - 2:00 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Phone</h3>
                  <p className="text-foreground/70 mt-1">+92 (21) 3555 1234</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p className="text-foreground/70 mt-1">clifton@tazapizza.pk</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-heading font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80">First Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    placeholder="Ahmed" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    placeholder="Khan" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="ahmed@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80">Message</label>
                <textarea 
                  className="w-full p-3 rounded-xl border bg-background text-sm h-32 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="Tell us what's on your mind..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary/95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSending ? "Sending..." : <>Send Message <Send className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>

        {/* Leaflet Map Column */}
        <div className="h-[600px] lg:h-auto rounded-3xl border border-border shadow-xl overflow-hidden relative min-h-[450px] bg-muted">
          <MapContainer 
            center={shopCoords} 
            zoom={14} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={shopCoords} icon={pizzaShopIcon}>
              <Popup>
                <div className="p-1 font-sans text-center">
                  <h4 className="font-bold text-primary text-base">Taza Pizza Clifton</h4>
                  <p className="text-xs text-muted-foreground mt-1">Teen Talwar, Karachi</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">🔥 Live Wood-Fired Brick Oven</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          {/* Floating Address Box */}
          <div className="absolute bottom-4 left-4 z-20 bg-background/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50 max-w-[260px]">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-foreground/50 mb-0.5">Flagship Store</p>
            <p className="font-black text-foreground">Teen Talwar Branch</p>
            <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
              We're located right in Clifton, right next to the iconic monuments. Pop in for dine-in or takeaway!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
