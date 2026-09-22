import { useState } from 'react'
import { Popup } from 'react-leaflet'
import { supabase } from '../supabaseClient'
import './NewThoughtForm.css'

const CATEGORIES = [
  { value: 'senti', label: 'Senti / Love' },
  { value: 'academic', label: 'Academic' },
  { value: 'family', label: 'Family' },
  { value: 'career', label: 'Career' },
  { value: 'personal', label: 'Personal' },
]

function NewThoughtForm({ point, onCancel }) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].value)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return

    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('thoughts').insert({
      content: content.trim(),
      category,
      latitude: point.lat,
      longitude: point.lng,
    })

    setSubmitting(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    onCancel()
  }

  return (
    <Popup position={point} autoClose={false} closeOnClick={false} eventHandlers={{ remove: onCancel }}>
      <form className="thought-form" onSubmit={handleSubmit}>
        <textarea
          className="thought-form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ano'ng nasa isip mo?"
          rows={3}
          maxLength={280}
          autoFocus
        />
        <select
          className="thought-form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        {error && <p className="thought-form-error">{error}</p>}
        <div className="thought-form-actions">
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting || !content.trim()}>
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </Popup>
  )
}

export default NewThoughtForm
