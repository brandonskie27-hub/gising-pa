import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './PhilippinesMap.css'

const PH_CENTER = [12.8797, 121.774]
const PH_BOUNDS = L.latLngBounds([4.2158, 114.0952], [21.3217, 127.6048])

function PhilippinesMap() {
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
    </MapContainer>
  )
}

export default PhilippinesMap
