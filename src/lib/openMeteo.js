const MANILA = { latitude: 14.5995, longitude: 120.9842 }

const THUNDERSTORM_CODES = [95, 96, 99]
const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]
const FOG_CODES = [45, 48]
const CLOUDY_CODES = [2, 3]
const CLEAR_CODES = [0, 1]

export async function fetchManilaWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${MANILA.latitude}&longitude=${MANILA.longitude}&current=temperature_2m,weather_code,is_day&timezone=Asia%2FManila`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo request failed: ${res.status}`)
  const data = await res.json()
  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
  }
}

// Maps a WMO weather code + day/night flag to one of the app's ambience effects.
export function classifyAmbience(weatherCode, isDay) {
  if (THUNDERSTORM_CODES.includes(weatherCode)) return 'thunderstorm'
  if (RAIN_CODES.includes(weatherCode)) return 'rain'
  if (FOG_CODES.includes(weatherCode)) return 'fog'
  if (CLOUDY_CODES.includes(weatherCode)) return 'cloudy'
  if (CLEAR_CODES.includes(weatherCode)) return isDay ? 'clear-day' : 'clear-night'
  return 'none'
}
