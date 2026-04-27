import { useState, useEffect } from "react"
import { useOrderStore } from "../store/orderStore"
import { getWeatherImpact, getRouteBaseTime } from "../services/delivery"
import { MapPin, Clock, CloudRain, CheckCircle2, Loader2, ArrowRight } from "lucide-react"

export default function Checkout() {
  const { cart, placeOrder } = useOrderStore()
  const [address, setAddress] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [weatherDelay, setWeatherDelay] = useState(0)
  const [weatherCondition, setWeatherCondition] = useState("Clear")
  const [baseTime, setBaseTime] = useState(0)
  const [isPlaced, setIsPlaced] = useState(false)
  
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalEta = 15 + baseTime + weatherDelay // 15 mins prep time

  useEffect(() => {
    async function fetchWeather() {
      // Automatically fetch weather impact for the primary city
      const weather = await getWeatherImpact("Lahore")
      setWeatherDelay(weather.delayMinutes)
      setWeatherCondition(weather.condition)
    }
    fetchWeather()
  }, [])

  const handleCalculateRoute = async () => {
    if (address.length < 5) return
    setIsCalculating(true)
    const time = await getRouteBaseTime(address)
    setBaseTime(time)
    setIsCalculating(false)
  }

  const handlePlaceOrder = async () => {
    if (baseTime === 0) {
      alert("Please enter your address and calculate the route first.")
      return
    }
    await placeOrder(weatherDelay, baseTime)
    setIsPlaced(true)
  }

  if (isPlaced) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-heading font-bold mb-4">Order Placed!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your estimated delivery time is {totalEta} minutes.
        </p>
        <div className="p-8 bg-card border rounded-2xl max-w-xl mx-auto shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Live Tracker</h2>
          <div className="h-64 bg-muted rounded-xl border flex items-center justify-center flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Lahore&zoom=13&size=600x300&key=demo')] opacity-20 bg-cover bg-center" />
            <MapPin className="w-12 h-12 text-primary animate-bounce relative z-10" />
            <p className="font-medium mt-4 relative z-10">Google Maps Integration Active</p>
            <p className="text-sm text-muted-foreground relative z-10">Driver is heading to your location</p>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Head to the Pizza Lab to order something delicious!</p>
        <a href="/lab" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold">Go to Pizza Lab</a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
            <div className="flex gap-4">
              <input 
                type="text" 
                className="flex-grow p-3 rounded-lg border bg-background" 
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button 
                onClick={handleCalculateRoute}
                disabled={isCalculating || address.length < 5}
                className="px-6 bg-secondary text-secondary-foreground border rounded-lg font-medium hover:bg-accent disabled:opacity-50 flex items-center gap-2"
              >
                {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Calculate"}
              </button>
            </div>
          </div>

          {baseTime > 0 && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold mb-6">Smart Delivery Analysis</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="text-primary" />
                    <span className="font-medium">Preparation Time</span>
                  </div>
                  <span className="font-bold">15 mins</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-500" />
                    <span className="font-medium">Google Maps Route Time</span>
                  </div>
                  <span className="font-bold">{baseTime} mins</span>
                </div>

                <div className={`flex justify-between items-center p-4 rounded-lg ${weatherDelay > 0 ? 'bg-orange-100 dark:bg-orange-950/30' : 'bg-green-100 dark:bg-green-950/30'}`}>
                  <div className="flex items-center gap-3">
                    <CloudRain className={weatherDelay > 0 ? 'text-orange-500' : 'text-green-500'} />
                    <span className="font-medium">Weather Impact ({weatherCondition})</span>
                  </div>
                  <span className="font-bold">{weatherDelay > 0 ? `+${weatherDelay} mins` : 'No delay'}</span>
                </div>

                <div className="pt-4 border-t flex justify-between items-center text-xl">
                  <span className="font-bold">Total ETA</span>
                  <span className="font-bold text-primary">{totalEta} mins</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-2 text-sm">x{item.quantity}</span>
                  </div>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t mb-8">
              <div className="flex justify-between items-center text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={baseTime === 0}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              Place Order <ArrowRight className="w-5 h-5" />
            </button>
            {baseTime === 0 && <p className="text-center text-sm text-muted-foreground mt-3">Calculate route to enable ordering</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
