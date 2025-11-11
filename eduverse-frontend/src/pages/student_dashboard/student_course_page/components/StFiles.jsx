import { useOutletContext } from 'react-router-dom'

function StFiles(){
  const ctx = useOutletContext() || {}
  const items = ctx.files || []

  return (
    <div className="space-y-3">
      {items.map(it => (
        <div key={it.id} className="flex items-center justify-between bg-base-200 p-3 rounded">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-base-300 flex items-center justify-center">📄</div>
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-base-content/70">{it.size}</div>
            </div>
          </div>
          <div className="text-sm text-base-content/60">Download</div>
        </div>
      ))}
      {items.length === 0 && <div className="text-base-content/70">No files uploaded yet.</div>}
    </div>
  )
}

export default StFiles
