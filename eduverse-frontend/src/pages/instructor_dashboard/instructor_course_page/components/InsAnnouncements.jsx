import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'

function InsAnnouncements(){
  const ctx = useOutletContext() || {}
  const items = ctx.announcements || []
  const addAnnouncement = ctx.addAnnouncement
  const [text, setText] = useState('')

  function submit(e){
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    if (typeof addAnnouncement === 'function') {
      addAnnouncement(t)
    }
    setText('')
  }

  return (
    <div className="space-y-4">
      {/* Create announcement form for instructors */}
      {typeof addAnnouncement === 'function' && (
        <form onSubmit={submit} className="space-y-2">
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share something with your class..." className="textarea textarea-bordered w-full" rows={3} />
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm">Post announcement</button>
          </div>
        </form>
      )}

      {items.map(it => (
        <div key={it.id} className="rounded-lg bg-base-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary text-secondary-content flex items-center justify-center">{it.author?.charAt(0) || 'A'}</div>
            <div>
              <div className="font-semibold">{it.author}</div>
              <div className="text-sm text-base-content/70">{it.text}</div>
            </div>
            <div className="ml-auto text-xs text-base-content/60">{it.time}</div>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="text-base-content/70">No announcements yet.</div>}
    </div>
  )
}

export default InsAnnouncements
