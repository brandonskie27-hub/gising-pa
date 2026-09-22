import { Popup } from 'react-leaflet'
import './ClosedNotice.css'

function ClosedNotice({ point, onDismiss }) {
  return (
    <Popup position={point} autoClose={false} closeOnClick={false} eventHandlers={{ remove: onDismiss }}>
      <div className="closed-notice">
        <p>Tulog muna ang Gising Pa? 😴</p>
        <p>Pwede ka lang mag-post sa pagitan ng 10PM at 3AM, Philippine time.</p>
        <button type="button" onClick={onDismiss}>
          Okay
        </button>
      </div>
    </Popup>
  )
}

export default ClosedNotice
