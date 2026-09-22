import { useEffect, useState } from 'react'
import { Polygon } from 'react-leaflet'

const WORLD_RING = [
  [-90, -180],
  [-90, 180],
  [90, 180],
  [90, -180],
]

function toHoleRings(geojson) {
  const geom = geojson.features ? geojson.features[0].geometry : geojson.geometry
  const polygons = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates]
  return polygons.map((polygon) => polygon[0].map(([lng, lat]) => [lat, lng]))
}

function WorldMask() {
  const [maskPositions, setMaskPositions] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/ph-boundary.geojson')
      .then((res) => res.json())
      .then((geojson) => {
        if (cancelled) return
        setMaskPositions([WORLD_RING, ...toHoleRings(geojson)])
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!maskPositions) return null

  return (
    <Polygon
      positions={maskPositions}
      interactive={false}
      pathOptions={{ stroke: false, fillColor: '#223848', fillOpacity: 1 }}
    />
  )
}

export default WorldMask
