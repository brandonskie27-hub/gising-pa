import L from 'leaflet'

export const CATEGORY_META = {
  senti: { emoji: '💗', color: '#ff6fa5', label: 'Senti / Love' },
  academic: { emoji: '📚', color: '#6fa8ff', label: 'Academic' },
  family: { emoji: '🏠', color: '#ffd166', label: 'Family' },
  career: { emoji: '💼', color: '#4dd0b1', label: 'Career' },
  personal: { emoji: '🌙', color: '#b18cff', label: 'Personal' },
}

export const CATEGORIES = Object.entries(CATEGORY_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}))

export function getCategoryIcon(category) {
  const meta = CATEGORY_META[category] ?? { emoji: '💭', color: '#9fb3c8' }
  return L.divIcon({
    className: 'category-pin',
    html: `<span class="category-pin-badge" style="background:${meta.color}">${meta.emoji}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  })
}
