import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Order = {
  id: string
  user_id?: string
  items: any[]
  total_price: number
  status: 'pending' | 'preparing' | 'on_way' | 'delivered'
  estimated_delivery: string
  created_at: string
}

export type Review = {
  id: string
  order_id: string
  rating: number
  comment: string
  created_at: string
}
