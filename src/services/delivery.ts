const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
// const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export interface WeatherData {
  condition: string
  delayMinutes: number
}

export async function getWeatherImpact(city: string = "Lahore"): Promise<WeatherData> {
  if (!WEATHER_API_KEY) {
    console.warn("No Weather API key, returning mock weather impact.")
    return { condition: "Clear", delayMinutes: 0 }
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`)
    if (!res.ok) throw new Error("Weather API failed")
    
    const data = await res.json()
    const conditionId = data.weather[0].id

    // Delay logic based on OpenWeather condition codes
    if (conditionId >= 200 && conditionId < 300) return { condition: "Thunderstorm", delayMinutes: 20 }
    if (conditionId >= 300 && conditionId < 600) return { condition: "Rain", delayMinutes: 15 }
    if (conditionId >= 600 && conditionId < 700) return { condition: "Snow", delayMinutes: 30 }
    if (conditionId === 711 || conditionId === 741) return { condition: "Smog/Fog", delayMinutes: 10 }
    
    return { condition: "Clear", delayMinutes: 0 }
  } catch (err) {
    console.error(err)
    return { condition: "Unknown", delayMinutes: 0 }
  }
}

export async function getRouteBaseTime(destinationAddress: string): Promise<number> {
  // Without a direct server-side proxy or Maps API key injected, we simulate the route time.
  // In a real SaaS, this would call the Google Maps Distance Matrix API.
  console.log(`Calculating route to: ${destinationAddress}`)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a random time between 10 and 25 minutes
      const randomMinutes = Math.floor(Math.random() * 15) + 10
      resolve(randomMinutes)
    }, 800)
  })
}
