import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './leaflet-theme.css'
import './PhilippinesMap.css'
import { supabase } from '../supabaseClient'
import { isGisingHours } from '../lib/gisingHours'
import { CATEGORY_META, getCategoryIcon } from '../lib/categories'
import NewThoughtForm from './NewThoughtForm'
import ClosedNotice from './ClosedNotice'
import WorldMask from './WorldMask'
import WeatherAmbience from './WeatherAmbience'
import AppHeader from './AppHeader'

const PH_CENTER = [12.8797, 121.774]
const PH_BOUNDS = L.latLngBounds([4.2158, 114.0952], [21.3217, 127.6048])

function ClickCapture({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

function ThoughtPins({ thoughts }) {
  return thoughts.map((thought) => {
    const meta = CATEGORY_META[thought.category]
    return (
      <Marker
        key={thought.id}
        position={[thought.latitude, thought.longitude]}
        icon={getCategoryIcon(thought.category)}
      >
        <Popup>
          <div className="thought-popup">
            <span className="thought-popup-category" style={{ color: meta?.color }}>
              {meta?.emoji} {meta?.label ?? thought.category}
            </span>
            <p className="thought-popup-content">{thought.content}</p>
          </div>
        </Popup>
      </Marker>
    )
  })
}

function PhilippinesMap() {
  const [thoughts, setThoughts] = useState([])
  const [pendingPoint, setPendingPoint] = useState(null)
  const [gisingOpen, setGisingOpen] = useState(() => isGisingHours())

  useEffect(() => {
    const interval = setInterval(() => setGisingOpen(isGisingHours()), 30_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function loadThoughts() {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setThoughts(data)
    }
    loadThoughts()

    const channel = supabase
      .channel('thoughts-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'thoughts' },
        (payload) => {
          setThoughts((prev) => [payload.new, ...prev])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="ph-map-wrapper">
      <MapContainer
        center={PH_CENTER}
        zoom={6}
        minZoom={5}
        maxZoom={18}
        maxBounds={PH_BOUNDS}
        maxBoundsViscosity={1.0}
        preferCanvas
        className="ph-map"
      >
        <TileLayer
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          url={`https://api.maptiler.com/maps/basic-v2-dark/256/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`}
        />
        <WorldMask />
        <ClickCapture onSelect={setPendingPoint} />
        <ThoughtPins thoughts={thoughts} />
        {pendingPoint && gisingOpen && (
          <NewThoughtForm point={pendingPoint} onCancel={() => setPendingPoint(null)} />
        )}
        {pendingPoint && !gisingOpen && (
          <ClosedNotice point={pendingPoint} onDismiss={() => setPendingPoint(null)} />
        )}
      </MapContainer>
      <WeatherAmbience />
      <AppHeader />
    </div>
  )
}

export default PhilippinesMap
