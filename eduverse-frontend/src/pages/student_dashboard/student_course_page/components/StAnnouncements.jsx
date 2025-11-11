import { useOutletContext } from 'react-router-dom'

function StAnnouncements(){
  const ctx = useOutletContext() || {}
  const items = ctx.announcements || []

  return (
    <div className="space-y-4">
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

export default StAnnouncements
