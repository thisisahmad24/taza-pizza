import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, ChefHat, Bike, CheckCircle2, Clock, MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const STEPS = [
  { status: 'Preparing', icon: Package, label: 'Order Received' },
  { status: 'Baking', icon: ChefHat, label: 'In the Oven' },
  { status: 'Out for Delivery', icon: Bike, label: 'On the Way' },
  { status: 'Delivered', icon: CheckCircle2, label: 'Enjoy your Pizza!' }
];

export default function OrderTracker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Store coordinates (Lahore example)
  const shopCoords: [number, number] = [31.5204, 74.3587];
  const deliveryCoords: [number, number] = [31.5504, 74.3887];

  useEffect(() => {
    // Simulate order progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStep < STEPS.length - 1) {
            setCurrentStep(s => s + 1);
            return 0;
          }
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 300); // Fast simulation for demo

    return () => clearInterval(timer);
  }, [currentStep]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress & Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-heading font-bold">Track Order</h1>
              <div className="flex items-center gap-2 text-primary font-bold">
                <Clock className="h-5 w-5" />
                <span>~25 mins</span>
              </div>
            </div>

            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx <= currentStep;
                const isPending = idx > currentStep;
                
                return (
                  <div key={idx} className="flex gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 ${
                      isActive ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {idx === currentStep && progress < 100 && (
                        <p className="text-sm text-primary animate-pulse font-medium">In progress...</p>
                      )}
                      {idx < currentStep && (
                        <p className="text-sm text-green-500 font-medium">Completed</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="font-bold">Delivery Address</p>
            </div>
            <p className="text-foreground/70 text-sm pl-8">
              Model Town, Block H, Lahore, Pakistan
            </p>
          </div>
        </div>

        {/* Right Column: Live Map */}
        <div className="lg:col-span-2 relative h-[500px] lg:h-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-card">
          <MapContainer 
            center={shopCoords} 
            zoom={13} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={shopCoords}>
              <Popup>Taza Pizza Shop</Popup>
            </Marker>
            <Marker position={deliveryCoords}>
              <Popup>Your Home</Popup>
            </Marker>
            <Polyline 
              positions={[shopCoords, deliveryCoords]} 
              color="hsl(var(--primary))" 
              dashArray="10, 10"
              weight={4}
              opacity={0.6}
            />
          </MapContainer>

          {/* Floating UI on map */}
          <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur p-4 rounded-xl shadow-lg border border-border/50 max-w-[200px]">
            <p className="text-xs uppercase tracking-wider font-bold text-foreground/50 mb-1">Driver</p>
            <p className="font-bold">Ahmed Khan</p>
            <p className="text-xs text-primary font-medium">Out for delivery</p>
          </div>
        </div>

      </div>
    </div>
  );
}
