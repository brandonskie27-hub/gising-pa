import './SentiMusicPlayer.css'

const SENTI_PLAYLIST_ID = '2OfJMaJYRUuk1TBRkSxEE9'

function SentiMusicPlayer({ visible }) {
  if (!visible) return null

  return (
    <div className="senti-music-player">
      <iframe
        title="Senti playlist"
        src={`https://open.spotify.com/embed/playlist/${SENTI_PLAYLIST_ID}?utm_source=generator`}
        width="100%"
        height="80"
        style={{ borderRadius: '12px' }}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  )
}

export default SentiMusicPlayer
