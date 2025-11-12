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
      // support async addAnnouncement (backend call)
      const res = addAnnouncement(t)
      if (res && typeof res.then === 'function') {
        res.catch(() => {})
      }
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

      {items.map(it => {
        const key = it._id || it.id || JSON.stringify(it)
        let authorName
        if (typeof it.author === 'string') {
          // if it's a likely object id, show generic label instead of raw id
          if (it.author.length >= 8) authorName = 'Instructor'
          else authorName = it.author
        } else {
          authorName = (it.author && (it.author.name || it.author.username)) || 'Instructor'
        }
        const initial = (authorName && String(authorName).charAt(0)) || 'A'
        const body = it.body || it.text || ''
        const time = it.time || it.createdAt || ''
        return (
          <div key={key} className="rounded-lg bg-base-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary text-secondary-content flex items-center justify-center">{initial}</div>
              <div>
                <div className="font-semibold">{authorName}</div>
                <div className="text-sm text-base-content/70">{body}</div>
              </div>
              <div className="ml-auto text-xs text-base-content/60">{time}</div>
            </div>
          </div>
        )
      })}
      {items.length === 0 && <div className="text-base-content/70">No announcements yet.</div>}
    </div>
  )
}

export default InsAnnouncements
