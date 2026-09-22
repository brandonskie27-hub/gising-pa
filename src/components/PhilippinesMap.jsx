import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import './PhilippinesMap.css'
import { supabase } from '../supabaseClient'
import NewThoughtForm from './NewThoughtForm'

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

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
  return thoughts.map((thought) => (
    <Marker key={thought.id} position={[thought.latitude, thought.longitude]}>
      <Popup>
        <strong>{thought.category}</strong>
        <p>{thought.content}</p>
      </Popup>
    </Marker>
  ))
}

function PhilippinesMap() {
  const [thoughts, setThoughts] = useState([])
  const [pendingPoint, setPendingPoint] = useState(null)

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
    <MapContainer
      center={PH_CENTER}
      zoom={6}
      minZoom={5}
      maxZoom={18}
      maxBounds={PH_BOUNDS}
      maxBoundsViscosity={1.0}
      className="ph-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickCapture onSelect={setPendingPoint} />
      <ThoughtPins thoughts={thoughts} />
      {pendingPoint && (
        <NewThoughtForm point={pendingPoint} onCancel={() => setPendingPoint(null)} />
      )}
    </MapContainer>
  )
}

export default PhilippinesMap
