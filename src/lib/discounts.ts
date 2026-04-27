export interface DiscountEvent {
  name: string
  discountPercentage: number
  description: string
  isActive: boolean
}

// Logic to check active Pakistani cultural / seasonal events
export function getActiveDiscount(): DiscountEvent | null {
  const today = new Date()
  const month = today.getMonth() // 0-indexed
  const date = today.getDate()

  // 1. Independence Day (August 14) -> 14% OFF
  if (month === 7 && date >= 12 && date <= 16) {
    return {
      name: "Independence Day Special",
      discountPercentage: 14,
      description: "Celebrating Pakistan! Enjoy 14% off your entire order.",
      isActive: true
    }
  }

  // 2. Pakistan Resolution Day (March 23) -> 23% OFF
  if (month === 2 && date >= 20 && date <= 25) {
    return {
      name: "Pakistan Day (23rd March)",
      discountPercentage: 23,
      description: "Celebrate 23rd March with a massive 23% discount!",
      isActive: true
    }
  }

  // 3. Basant Festival / Spring (Early Feb/March)
  if (month === 1 && date >= 15 && date <= 28) {
    return {
      name: "Basant Bahar Deal",
      discountPercentage: 10,
      description: "Welcome Spring! Enjoy 10% off on all pizzas.",
      isActive: true
    }
  }

  // 4. Mock dynamic Islamic Calendar logic (Ramadan / Eid)
  // Since Islamic calendar is lunar, we would ideally use an API. 
  // For the SaaS, we can simulate a Ramadan state checking if it's currently Ramadan.
  // We'll mock a generic "Midnight Deals" for now.
  const hour = today.getHours()
  if (hour >= 23 || hour <= 3) {
    return {
      name: "Midnight Craving Deal",
      discountPercentage: 15,
      description: "Late night cravings? We've got you covered with 15% off.",
      isActive: true
    }
  }

  return null
}
