import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Users, DollarSign, Clock, CheckCircle2, ChevronRight, AlertCircle, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch orders periodically
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s for real-time feel
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Analytics Calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const ordersToday = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const activeOrders = orders.filter(o => o.status !== 'Delivered').length;

  const STATUS_FLOW = ['Preparing', 'Baking', 'Out for Delivery', 'Delivered'];

  const getNextStatus = (current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparing': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Baking': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'Out for Delivery': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-muted text-foreground/70';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border/50 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-card/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading leading-tight">ChefOS <span className="text-primary font-black">Admin</span></h1>
              <p className="text-xs text-foreground/60 font-medium tracking-wide uppercase">Taza Pizza Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-foreground/70">Live Sync</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <DollarSign className="w-20 h-20" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500/10 p-3 rounded-2xl text-green-500"><TrendingUp className="w-6 h-6" /></div>
              <h3 className="font-bold text-foreground/70">Total Revenue</h3>
            </div>
            <p className="text-4xl font-black">${totalRevenue.toFixed(2)}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <LayoutDashboard className="w-20 h-20" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary"><CheckCircle2 className="w-6 h-6" /></div>
              <h3 className="font-bold text-foreground/70">Orders Today</h3>
            </div>
            <p className="text-4xl font-black">{ordersToday}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Users className="w-20 h-20" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-500/10 p-3 rounded-2xl text-orange-500"><Clock className="w-6 h-6" /></div>
              <h3 className="font-bold text-foreground/70">Active Kitchen Orders</h3>
            </div>
            <p className="text-4xl font-black">{activeOrders}</p>
          </motion.div>
        </div>

        {/* Live Orders Feed */}
        <div className="bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              Kitchen Display System
            </h2>
            <button onClick={fetchOrders} className="text-sm font-bold text-primary hover:underline">
              Refresh Feed
            </button>
          </div>

          {error ? (
            <div className="p-10 flex flex-col items-center justify-center text-center text-foreground/50">
              <AlertCircle className="w-12 h-12 mb-4 text-destructive opacity-50" />
              <p className="font-bold text-lg text-destructive">Database Connection Error</p>
              <p className="max-w-md mt-2">Cannot connect to MongoDB. Please ensure your local mongod daemon is running or MONGODB_URI is set.</p>
            </div>
          ) : isLoading ? (
            <div className="p-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-20 text-center text-foreground/50">
              <p className="font-bold text-xl mb-2">No Orders Yet</p>
              <p>Waiting for the first customer to place an order...</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {orders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                return (
                  <div key={order._id} className="p-6 hover:bg-muted/30 transition-colors flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                    
                    {/* Order Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-lg">Order #{order._id.slice(-6).toUpperCase()}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-sm text-foreground/50 font-medium">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="bg-background border border-border px-3 py-1.5 rounded-lg text-sm font-medium">
                            {item.quantity}x {item.name || 'Custom Pizza'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Order Meta & Actions */}
                    <div className="flex flex-col items-end gap-3 shrink-0 w-full lg:w-auto">
                      <div className="text-2xl font-black text-primary">${order.totalPrice.toFixed(2)}</div>
                      
                      {nextStatus ? (
                        <button 
                          onClick={() => updateOrderStatus(order._id, nextStatus)}
                          className="w-full lg:w-auto py-2 px-5 bg-foreground text-background font-bold rounded-xl hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                          Mark as {nextStatus} <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="py-2 px-5 bg-green-500/10 text-green-600 font-bold rounded-xl flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Completed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
