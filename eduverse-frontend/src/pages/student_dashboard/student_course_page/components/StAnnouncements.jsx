import { useOutletContext } from 'react-router-dom'

function StAnnouncements(){
  const ctx = useOutletContext() || {}
  const items = ctx.announcements || []

  function authorName(a) {
    if (!a) return 'Instructor'
    // if it's a mongo id, try to match it against the loaded course teacher
    if (typeof a === 'string') {
      if (/^[a-f0-9]{24}$/.test(a)) {
        const teacher = ctx.course && (ctx.course.teacher || null)
        if (teacher) {
          const tid = teacher._id || teacher.id || String(teacher)
          if (String(tid) === String(a)) return teacher.name || teacher.username || 'Instructor'
        }
        return 'Instructor'
      }
      return a
    }
    if (typeof a === 'object') {
      return a.name || a.fullName || a.username || `${a.firstName || ''} ${a.lastName || ''}`.trim() || 'Instructor'
    }
    return String(a)
  }

  function contentText(it) {
    return it?.text || it?.content || it?.body || it?.message || it?.title || ''
  }

  function timeText(it) {
    if (it?.time) return it.time
    if (it?.createdAt) {
      try { return new Date(it.createdAt).toLocaleString() } catch(e) { return it.createdAt }
    }
    return ''
  }

  return (
    <div className="space-y-4">
      {items.map((it, idx) => {
        const key = (it && (it._id || it.id)) || it || idx
        const author = authorName(it?.author || it?.createdBy || null)
        const content = (typeof it === 'string') ? it : contentText(it)
        const time = timeText(it)

        const initial = (author && author.length > 0) ? author.charAt(0).toUpperCase() : 'A'

        return (
          <div key={key} className="rounded-lg bg-base-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary text-secondary-content flex items-center justify-center">{initial}</div>
              <div>
                <div className="font-semibold">{author}</div>
                <div className="text-sm text-base-content/70">{content}</div>
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

export default StAnnouncements
