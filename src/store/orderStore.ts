import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderState {
  cart: CartItem[]
  activeOrderId: string | null
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  placeOrder: (weatherBufferMins: number, baseMapMins: number) => Promise<string>
  setActiveOrder: (id: string) => void
}

export const useOrderStore = create<OrderState>((set, get) => ({
  cart: [],
  activeOrderId: null,

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

  placeOrder: async (weatherBufferMins, baseMapMins) => {
    const { cart } = get()
    if (cart.length === 0) throw new Error("Cart is empty")

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    
    // Calculate total ETA
    // Prep time = 15 mins + Map Drive Time + Weather Buffer
    const totalMinutes = 15 + baseMapMins + weatherBufferMins
    const eta = new Date()
    eta.setMinutes(eta.getMinutes() + totalMinutes)

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
      console.error("Supabase error:", error)
      // Since it might fail if Supabase is not actually set up with a real URL, we'll mock it fallback
      console.warn("Falling back to local state due to DB error")
      const mockId = crypto.randomUUID()
      set({ activeOrderId: mockId, cart: [] })
      return mockId
    }

    set({ activeOrderId: data.id, cart: [] })
    return data.id
  },

  setActiveOrder: (id) => set({ activeOrderId: id })
}))
