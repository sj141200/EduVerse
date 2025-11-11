import { useOutletContext } from 'react-router-dom'

function StAssignments(){
  const ctx = useOutletContext() || {}
  const items = ctx.assignments || []

  return (
    <div className="space-y-4">
      {items.map(it => (
        <div key={it.id} className="rounded-lg bg-base-200 p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold">{it.title}</div>
            <div className="text-sm text-base-content/70">Due: {it.due}</div>
          </div>
          <div className="text-sm font-medium text-primary">{it.status}</div>
        </div>
      ))}
      {items.length === 0 && <div className="text-base-content/70">No assignments yet.</div>}
    </div>
  )
}

export default StAssignments
