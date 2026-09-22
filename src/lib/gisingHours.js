const GISING_TIMEZONE = 'Asia/Manila'

function getPhHour(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: GISING_TIMEZONE,
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  return parseInt(parts.find((p) => p.type === 'hour').value, 10)
}

// Mirrors the DB's is_gising_hours() check: 10pm-3am Philippine time.
export function isGisingHours(date = new Date()) {
  const hour = getPhHour(date)
  return hour >= 22 || hour < 3
}
