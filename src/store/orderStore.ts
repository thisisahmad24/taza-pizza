import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface OrderDetails {
  id: string
  items: CartItem[]
  totalPrice: number
  status: 'Preparing' | 'Baking' | 'Out for Delivery' | 'Delivered'
  estimatedDelivery: string
  address: string
  latitude: number
  longitude: number
  weatherCondition: string
  weatherDelay: number
  baseTime: number
  createdAt: string
}

interface OrderState {
  cart: CartItem[]
  activeOrderId: string | null
  activeOrderDetails: OrderDetails | null
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  placeOrder: (params: {
    address: string
    latitude: number
    longitude: number
    weatherCondition: string
    weatherDelay: number
    baseTime: number
    totalPrice: number
  }) => Promise<string>
  setActiveOrder: (id: string) => void
  updateOrderStatus: (id: string, status: 'Preparing' | 'Baking' | 'Out for Delivery' | 'Delivered') => void
  clearActiveOrder: () => void
}

// Load initial state from localstorage
const savedOrderJson = localStorage.getItem('active_order')
const initialOrderDetails: OrderDetails | null = savedOrderJson ? JSON.parse(savedOrderJson) : null
const initialOrderId = initialOrderDetails ? initialOrderDetails.id : null

export const useOrderStore = create<OrderState>((set, get) => ({
  cart: [],
  activeOrderId: initialOrderId,
  activeOrderDetails: initialOrderDetails,

  addToCart: (item) => set((state) => {
    const existing = state.cart.find(c => c.name === item.name)
    if (existing) {
      return {
        cart: state.cart.map(c => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c)
      }
    }
    return { cart: [...state.cart, { ...item, id: crypto.randomUUID(), quantity: 1 }] }
  }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),

  clearCart: () => set({ cart: [] }),

  placeOrder: async ({ address, latitude, longitude, weatherCondition, weatherDelay, baseTime, totalPrice }) => {
    const { cart } = get()
    if (cart.length === 0) throw new Error("Cart is empty")

    // Calculate total ETA
    // Prep time = 15 mins + Map Drive Time + Weather Buffer
    const totalMinutes = 15 + baseTime + weatherDelay
    const eta = new Date()
    eta.setMinutes(eta.getMinutes() + totalMinutes)

    const orderId = crypto.randomUUID()
    const createdAtIso = new Date().toISOString()

    const orderDetails: OrderDetails = {
      id: orderId,
      items: cart,
      totalPrice: totalPrice,
      status: 'Preparing',
      estimatedDelivery: eta.toISOString(),
      address,
      latitude,
      longitude,
      weatherCondition,
      weatherDelay,
      baseTime,
      createdAt: createdAtIso
    }

    // 1. Try to save to Express/MongoDB backend if running
    let savedBackendId = null
    try {
      const userRaw = localStorage.getItem('user')
      const user = userRaw ? JSON.parse(userRaw) : null
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id || undefined,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          totalPrice,
          status: 'Preparing',
          estimatedDelivery: eta.toISOString()
        })
      })
      if (response.ok) {
        const data = await response.json()
        savedBackendId = data._id
        console.log("Order saved to MongoDB:", data)
      }
    } catch (err) {
      console.warn("MongoDB backend not running, falling back to Supabase/Local state", err)
    }

    const finalId = savedBackendId || orderId
    orderDetails.id = finalId

    // 2. Try to save to Supabase
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            items: cart,
            total_price: totalPrice,
            status: 'preparing',
            estimated_delivery: eta.toISOString()
          }
        ])
        .select()
        .single()
      
      if (error) {
        console.warn("Supabase insert error, relying on local/MongoDB:", error.message)
      } else if (data) {
        console.log("Order saved to Supabase:", data)
      }
    } catch (err) {
      console.warn("Supabase connection issue:", err)
    }

    // 3. Save to Zustand state and LocalStorage
    set({ 
      activeOrderId: finalId, 
      activeOrderDetails: orderDetails,
      cart: [] 
    })
    localStorage.setItem('active_order', JSON.stringify(orderDetails))

    return finalId
  },

  setActiveOrder: (id) => set({ activeOrderId: id }),

  updateOrderStatus: (id, status) => set((state) => {
    if (state.activeOrderDetails && state.activeOrderDetails.id === id) {
      const updated = { ...state.activeOrderDetails, status }
      localStorage.setItem('active_order', JSON.stringify(updated))
      return { activeOrderDetails: updated }
    }
    return {}
  }),

  clearActiveOrder: () => {
    localStorage.removeItem('active_order')
    set({ activeOrderId: null, activeOrderDetails: null })
  }
}))
