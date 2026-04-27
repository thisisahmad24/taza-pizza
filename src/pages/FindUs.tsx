import { MapPin, Clock, Phone, Mail } from "lucide-react"

export default function FindUs() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Find Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Drop by for a slice or get in touch. We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-muted-foreground">123 Pizza Lane, Food City, FC 12345</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Opening Hours</h3>
                  <p className="text-muted-foreground">Mon - Thu: 11:00 AM - 10:00 PM</p>
                  <p className="text-muted-foreground">Fri - Sun: 11:00 AM - 11:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">hello@tazapizza.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-bold mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input type="text" className="w-full p-3 rounded-lg border bg-background" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input type="text" className="w-full p-3 rounded-lg border bg-background" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="w-full p-3 rounded-lg border bg-background" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea className="w-full p-3 rounded-lg border bg-background h-32 resize-none" placeholder="How can we help?" />
              </div>
              <button className="w-full py-3 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary-dark transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="h-[600px] bg-muted rounded-2xl border overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col">
            <MapPin className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">[Interactive Google Map Integration]</p>
            <p className="text-sm">To be implemented with Google Maps API</p>
          </div>
        </div>
      </div>
    </div>
  )
}
