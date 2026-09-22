import { useEffect, useMemo, useState } from 'react'
import { fetchManilaWeather, classifyAmbience } from '../lib/openMeteo'
import './WeatherAmbience.css'

const REFRESH_MS = 15 * 60 * 1000

function randomRange(min, max) {
  return Math.random() * (max - min) + min
}

function RainLayer({ intense = false }) {
  const drops = useMemo(
    () =>
      Array.from({ length: intense ? 130 : 70 }, () => ({
        left: randomRange(0, 100),
        delay: randomRange(0, 2),
        duration: randomRange(0.5, 1.1),
      })),
    [intense],
  )
  return (
    <div className="weather-rain">
      {drops.map((d, i) => (
        <span
          key={i}
          className="raindrop"
          style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s` }}
        />
      ))}
    </div>
  )
}

function CloudLayer() {
  return (
    <div className="weather-clouds">
      <div className="cloud-blob cloud-blob-a" />
      <div className="cloud-blob cloud-blob-b" />
      <div className="cloud-blob cloud-blob-c" />
    </div>
  )
}

function StarsLayer() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        top: randomRange(0, 60),
        left: randomRange(0, 100),
        delay: randomRange(0, 4),
        size: randomRange(1, 2.5),
      })),
    [],
  )
  return (
    <div className="weather-stars">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
        />
      ))}
    </div>
  )
}

function FogLayer() {
  return (
    <div className="weather-fog">
      <div className="fog-band fog-band-a" />
      <div className="fog-band fog-band-b" />
    </div>
  )
}

function LightningLayer() {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    let timeout
    function scheduleFlash() {
      timeout = setTimeout(() => {
        setFlash(true)
        setTimeout(() => setFlash(false), 150)
        scheduleFlash()
      }, randomRange(4000, 12000))
    }
    scheduleFlash()
    return () => clearTimeout(timeout)
  }, [])

  return <div className={`weather-lightning${flash ? ' flash' : ''}`} />
}

function WeatherAmbience() {
  const [ambience, setAmbience] = useState('none')

  useEffect(() => {
    let cancelled = false

    async function update() {
      try {
        const { weatherCode, isDay } = await fetchManilaWeather()
        if (!cancelled) setAmbience(classifyAmbience(weatherCode, isDay))
      } catch {
        // Weather is decorative only; silently keep the previous ambience on failure.
      }
    }

    update()
    const interval = setInterval(update, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="weather-ambience" aria-hidden="true">
      {ambience === 'clear-night' && <StarsLayer />}
      {ambience === 'cloudy' && <CloudLayer />}
      {ambience === 'fog' && <FogLayer />}
      {ambience === 'rain' && <RainLayer />}
      {ambience === 'thunderstorm' && (
        <>
          <RainLayer intense />
          <LightningLayer />
        </>
      )}
    </div>
  )
}

export default WeatherAmbience
