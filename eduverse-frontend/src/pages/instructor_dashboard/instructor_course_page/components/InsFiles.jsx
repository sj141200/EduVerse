import { useOutletContext } from 'react-router-dom'
import { useRef } from 'react'

function InsFiles(){
  const ctx = useOutletContext() || {}
  const items = ctx.files || []
  const uploadFile = ctx.uploadFile
  const inputRef = useRef()

  function onPick(e){
    const f = e.target.files && e.target.files[0]
    if (!f) return
    if (typeof uploadFile === 'function') uploadFile(f)
    // reset input so same file can be picked again
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {typeof uploadFile === 'function' && (
        <div className="flex items-center gap-3">
          <input ref={inputRef} type="file" onChange={onPick} className="file-input file-input-sm file-input-bordered" />
        </div>
      )}

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

export default InsFiles
