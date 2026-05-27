import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, ChefHat, Bike, CheckCircle2, Clock, MapPin, Star, Send, Sparkles, FastForward } from 'lucide-react';
import L from 'leaflet';
import { useOrderStore } from '../store/orderStore';
import { toast } from 'sonner';

// Define custom leaflet icons using Tailwind CSS for premium look
const shopIcon = L.divIcon({
  className: 'custom-shop-icon',
  html: `<div class="bg-red-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pizza"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="M2 12C2 6.5 6.5 2 12 2c5.3 0 9.6 4.1 9.9 9.3l-9.9.7-.7 9.9C6.1 21.6 2 17.3 2 12Z"/><path d="M16 16c-3 0-6-3-6-6"/></svg></div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19]
});

const homeIcon = L.divIcon({
  className: 'custom-home-icon',
  html: `<div class="bg-blue-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19]
});

const riderIcon = L.divIcon({
  className: 'custom-rider-icon',
  html: `<div class="bg-primary text-white p-2.5 rounded-full shadow-xl border-2 border-white flex items-center justify-center animate-bounce"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bike"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M15 6h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2"/><path d="M12 11.5V14"/><path d="M7.5 17.5 12 14l5.5 3.5"/><path d="M16 10h-5.5L8 14"/><path d="m12 11.5 5-5.5H12Z"/></svg></div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19]
});

// Helper component to auto-recenter map when coordinates change
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const STEPS = [
  { status: 'Preparing', icon: Package, label: 'Order Received' },
  { status: 'Baking', icon: ChefHat, label: 'In the Oven' },
  { status: 'Out for Delivery', icon: Bike, label: 'Out for Delivery' },
  { status: 'Delivered', icon: CheckCircle2, label: 'Delivered!' }
];

export default function OrderTracker() {
  const { activeOrderDetails, updateOrderStatus, clearActiveOrder } = useOrderStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Dev mode acceleration offset
  const [timeOffsetSeconds, setTimeOffsetSeconds] = useState(0);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!activeOrderDetails) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-xl">
        <div className="bg-card border rounded-3xl p-12 shadow-xl flex flex-col items-center">
          <Clock className="w-16 h-16 text-muted-foreground/40 mb-6" />
          <h1 className="text-3xl font-heading font-bold mb-4">No Active Orders</h1>
          <p className="text-muted-foreground mb-8">
            You don't have any active orders right now. Head over to the Pizza Lab to customize your gourmet wood-fired pizza and place an order!
          </p>
          <a href="/lab" className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-md hover:bg-primary/95 transition-all">
            Open Pizza Lab
          </a>
        </div>
      </div>
    );
  }

  // Calculate times
  const { id: orderId, items, totalPrice, estimatedDelivery, address, latitude, longitude, weatherCondition, weatherDelay, baseTime } = activeOrderDetails;
  
  const shopCoords: [number, number] = [24.8302, 67.0345]; // Teen Talwar, Clifton, Karachi
  const deliveryCoords: [number, number] = latitude && longitude ? [latitude, longitude] : [24.8150, 67.0400];

  const estimatedTime = new Date(estimatedDelivery);
  // Apply the developer acceleration offset to estimated delivery to speed up countdown
  const adjustedEstimatedTime = new Date(estimatedTime.getTime() - timeOffsetSeconds * 1000);

  const msLeft = adjustedEstimatedTime.getTime() - currentTime.getTime();
  const totalDurationMs = (15 + baseTime + weatherDelay) * 60000;
  
  // Calculate raw remaining minutes
  const minutesLeft = Math.max(0, Math.ceil(msLeft / 60000));
  
  // Calculate step based on remaining minutes
  // Prep (15m prep + baseTime + weather)
  // Step 0: Preparing -> First 15% of time
  // Step 1: Baking -> Next 35% of time
  // Step 2: Out for Delivery -> Next 50% of time (until minutesLeft is 0)
  // Step 3: Delivered -> minutesLeft is 0
  let currentStep = 0;
  let progressInStep = 0; // for animating rider position (0 to 100)

  if (msLeft <= 0) {
    currentStep = 3;
  } else {
    const elapsedMs = totalDurationMs - msLeft;
    const ratio = Math.max(0, Math.min(1, elapsedMs / totalDurationMs));

    if (ratio < 0.25) {
      currentStep = 0;
      progressInStep = (ratio / 0.25) * 100;
    } else if (ratio < 0.55) {
      currentStep = 1;
      progressInStep = ((ratio - 0.25) / 0.30) * 100;
    } else {
      currentStep = 2;
      progressInStep = ((ratio - 0.55) / 0.45) * 100;
    }
  }

  // Update backend status dynamically if it has changed in state
  const statusString = STEPS[currentStep].status;
  if (activeOrderDetails.status !== statusString) {
    // Sync state locally
    updateOrderStatus(orderId, statusString as any);
  }

  // Interpolate rider coordinates based on progress in "Out for Delivery" phase
  let riderCoords: [number, number] = shopCoords;
  if (currentStep === 2) {
    const fraction = progressInStep / 100;
    const lat = shopCoords[0] + (deliveryCoords[0] - shopCoords[0]) * fraction;
    const lng = shopCoords[1] + (deliveryCoords[1] - shopCoords[1]) * fraction;
    riderCoords = [lat, lng];
  } else if (currentStep === 3) {
    riderCoords = deliveryCoords;
  }

  // Acceleration function for testing
  const handleAccelerate = () => {
    setTimeOffsetSeconds(prev => prev + 60); // fast-forward by 1 minute
    toast.info("Fast-forwarded ETA by 1 minute!");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;

      // 1. Save to local MongoDB if available
      try {
        const res = await fetch('http://localhost:5000/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?._id || undefined,
            orderId: orderId,
            rating: rating,
            comment: comment
          })
        });
        if (res.ok) {
          console.log("Feedback saved to MongoDB");
        }
      } catch (err) {
        console.warn("MongoDB review save fallback to Supabase", err);
      }

      // 2. Save to Supabase reviews
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            order_id: orderId.length === 36 ? orderId : undefined,
            rating,
            comment
          }
        ]);

      if (error) {
        console.warn("Supabase review error:", error.message);
      }

      setReviewSubmitted(true);
      toast.success("Feedback submitted! Thank you!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress, Status & Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status Tracker */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-heading font-bold">Track Order</h1>
              <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-xl">
                <Clock className="h-5 w-5" />
                <span>{currentStep === 3 ? "Delivered" : `~${minutesLeft} mins`}</span>
              </div>
            </div>

            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx <= currentStep;
                const isCurrent = idx === currentStep;
                
                return (
                  <div key={idx} className="flex gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                      isCurrent 
                        ? 'bg-primary text-white scale-110 ring-4 ring-primary/20' 
                        : isActive 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground/60'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <p className={`font-bold text-lg ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {isCurrent && msLeft > 0 && (
                        <div className="mt-1">
                          <p className="text-sm text-primary animate-pulse font-medium">In progress...</p>
                          {idx === 2 && (
                            <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
                              <div 
                                className="bg-primary h-full transition-all duration-1000" 
                                style={{ width: `${progressInStep}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                      {idx < currentStep && (
                        <p className="text-sm text-green-500 font-semibold flex items-center gap-1 mt-0.5">
                          ✓ Completed
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-lg space-y-4">
            <h2 className="text-xl font-bold font-heading">Order Summary</h2>
            
            <div className="divide-y divide-border/50 max-h-[160px] overflow-y-auto pr-2">
              {items.map((item, index) => (
                <div key={index} className="py-2.5 flex justify-between text-sm">
                  <span>
                    <span className="font-bold text-primary mr-1.5">{item.quantity}x</span>
                    <span className="font-medium text-foreground/90">{item.name}</span>
                  </span>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-muted-foreground font-medium text-sm">Total Paid</span>
              <span className="text-xl font-black text-primary">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="bg-secondary/40 p-4 rounded-2xl space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Delivery Address</p>
                  <p className="text-foreground/80 text-sm mt-0.5">{address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2.5 border-t border-border/40 pt-2.5">
                <CloudRain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Weather conditions</p>
                  <p className="text-foreground/80 text-sm mt-0.5">
                    {weatherCondition} {weatherDelay > 0 ? `(adds +${weatherDelay} mins)` : '(no weather delays)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Test Simulation Controls */}
            {currentStep < 3 && (
              <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-2xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Demo Simulator
                  </span>
                  <button 
                    onClick={handleAccelerate}
                    className="p-1 px-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <FastForward className="w-3 h-3" /> +1 min
                  </button>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Delivery takes ~{minutesLeft} mins. Use the fast-forward button to speed up time and watch the delivery rider move across the map in real-time.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Map and Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Map Block */}
          <div className="h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-border relative bg-muted">
            <MapContainer 
              center={shopCoords} 
              zoom={13} 
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              className="z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <Marker position={shopCoords} icon={shopIcon}>
                <Popup>
                  <div className="p-1 font-sans">
                    <h4 className="font-bold text-primary">Taza Pizza Clifton</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Wood-fired ovens active</p>
                  </div>
                </Popup>
              </Marker>
              
              <Marker position={deliveryCoords} icon={homeIcon}>
                <Popup>
                  <div className="p-1 font-sans">
                    <h4 className="font-bold text-blue-600">Your Address</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{address.slice(0, 30)}...</p>
                  </div>
                </Popup>
              </Marker>

              {/* Show rider icon during out for delivery or delivered */}
              {(currentStep === 2 || currentStep === 3) && (
                <Marker position={riderCoords} icon={riderIcon}>
                  <Popup>
                    <div className="p-1 font-sans">
                      <h4 className="font-bold">Ahmed Rider</h4>
                      <p className="text-xs text-primary font-bold">On the way</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              <Polyline 
                positions={[shopCoords, deliveryCoords]} 
                color="hsl(var(--primary))" 
                dashArray="10, 10"
                weight={4}
                opacity={0.6}
              />
              
              <MapController center={currentStep === 2 ? riderCoords : shopCoords} />
            </MapContainer>

            {/* Floating Driver Info Box */}
            <div className="absolute top-4 left-4 z-20 bg-background/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50 max-w-[220px] transition-all">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-foreground/50 mb-1">Assigned Pizzaiolo</p>
              <p className="font-black text-foreground">Shahzad Ali</p>
              <p className="text-xs font-bold text-primary mt-1 flex items-center gap-1">
                <Bike className="w-3.5 h-3.5" /> Rider: Ahmed Khan
              </p>
            </div>
          </div>

          {/* Delivered: Client Review and Feedback Submission */}
          {currentStep === 3 && (
            <div className="bg-card p-8 rounded-3xl border border-border shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Star className="w-7 h-7 fill-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading">Rate Your Experience</h3>
                  <p className="text-muted-foreground text-sm">How was your Taza Pizza wood-fired experience today?</p>
                </div>
              </div>

              {reviewSubmitted ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-6 rounded-2xl text-center space-y-3">
                  <h4 className="text-xl font-bold font-heading">✓ Review Submitted Successfully!</h4>
                  <p className="text-sm max-w-md mx-auto">
                    Thank you so much! Your feedback has been stored securely in our database. We appreciate your contribution to making Taza Pizza better.
                  </p>
                  <button 
                    onClick={clearActiveOrder}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-bold text-sm shadow-md hover:bg-primary/95 transition-all"
                  >
                    Clear Active Order
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-foreground/80 mb-2">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star 
                            className={`w-9 h-9 transition-colors ${
                              star <= rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-muted/40 hover:text-yellow-200'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-foreground/80 mb-2">Leave your feedback</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about the crust, temperature, speed, or AI recipe suggestion!"
                      className="w-full p-4 rounded-2xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all h-28 resize-none text-sm"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 justify-center flex-1 sm:flex-none"
                    >
                      {isSubmittingReview ? "Submitting..." : <>Submit Feedback <Send className="w-4 h-4" /></>}
                    </button>
                    
                    <button
                      type="button"
                      onClick={clearActiveOrder}
                      className="px-6 py-3.5 bg-secondary text-secondary-foreground font-bold rounded-2xl border hover:bg-accent transition-all flex-1 sm:flex-none"
                    >
                      Skip Feedback
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
