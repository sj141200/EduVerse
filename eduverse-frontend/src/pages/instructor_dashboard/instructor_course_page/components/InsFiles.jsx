import { useOutletContext } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { useMessage } from '../../../../context/MessageContext.jsx'
import { getFiles, getDownloadUrl } from '../../../../api/files'
import { getToken } from '../../../../api/auth'

function InsFiles(){
  const ctx = useOutletContext() || {}
  const ctxFiles = ctx.files || []
  const [items, setItems] = useState(ctxFiles || [])
  const uploadFile = ctx.uploadFile
  const deleteFile = ctx.deleteFile
  const inputRef = useRef()

  // fetch canonical files from server for this course
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const course = ctx.course || {}
        const courseId = course._id || course.id || course
        if (!courseId) return
        const token = getToken()
        const remote = await getFiles(courseId, token)
        if (!mounted) return
        // remote may be array of UploadedFile docs or course.meta.files entries
        const mapped = (remote || []).map(r => {
          return {
            id: r.id || r._id || String(r.uploadedFileId || r._id),
            name: r.name || r.filename || r.originalName || r._id,
            size: typeof r.size === 'number' ? `${Math.round(r.size/1024)} KB` : (r.size || '—'),
            downloadUrl: r.downloadUrl || r.url || r.downloadUrl,
            url: r.url,
            blobName: r.blobName,
            uploading: false
          }
        })
        // merge with any optimistic local entries (ctxFiles)
        const all = [...(ctxFiles || []), ...mapped]
        // dedupe by id, keep first occurrence
        const seen = new Set()
        const dedup = []
        for (const it of all) {
          const key = String(it.id || it.name || Math.random())
          if (seen.has(key)) continue
          seen.add(key)
          dedup.push(it)
        }
        setItems(dedup)
      } catch (e) {
        const { showMessage } = useMessage() || {}
        if (showMessage) showMessage('Failed to load files: ' + (e && (e.message || e)), 'error')
      }
    }
    load()
    return () => { mounted = false }
  }, [ctx.course, ctxFiles])

  function onPick(e){
    const f = e.target.files && e.target.files[0]
    if (!f) return
    if (typeof uploadFile === 'function') uploadFile(f)
    // reset input so same file can be picked again
    if (inputRef.current) inputRef.current.value = ''
  }

  // helper to trigger download with filename (attempts anchor download, falls back to fetch+blob)
  async function triggerDownloadWithName(url, filename) {
    try {
      const sameOrigin = new URL(url, window.location.href).origin === window.location.origin;
      if (sameOrigin) {
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        return
      }
      // cross-origin: try fetch and blob
      const r = await fetch(url, { method: 'GET' })
      if (!r.ok) throw new Error(`Fetch failed: ${r.status}`)
      const blob = await r.blob()
      const objUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = objUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(objUrl)
      document.body.removeChild(a)
    } catch (e) {
      window.open(url, '_blank', 'noopener')
    }
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
              {it.uploading && (
                <div className="mt-2">
                  <progress className="progress w-40" value={it.progress || 0} max="100"></progress>
                  <div className="text-xs text-base-content/60">{it.progress || 0}%</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {it.blobName || it.downloadUrl || it.url ? (
              <button className="btn btn-xs" onClick={async () => {
                try {
                  const course = ctx.course || {}
                  const courseId = course._id || course.id || course
                  if (!courseId) return
                  const token = getToken()
                  const resp = await getDownloadUrl(courseId, it.id, token)
                  const downloadUrl = (resp && resp.downloadUrl) ? resp.downloadUrl : it.url
                  const filename = it.name || it.filename || it.originalName || 'file'
                  await triggerDownloadWithName(downloadUrl, filename)
                } catch (e) {
                  const { showMessage } = useMessage() || {}
                  if (showMessage) showMessage('Download failed: ' + (e && (e.message || e)), 'error')
                  if (it.url) await triggerDownloadWithName(it.url, it.name || it.filename || it.originalName || 'file')
                }
              }}>Download</button>
            ) : (
              <button className="btn btn-xs btn-ghost" disabled>Processing…</button>
            )}
            <button className="btn btn-xs btn-error" onClick={() => { if (typeof deleteFile === 'function') deleteFile(it.id) }}>Delete</button>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="text-base-content/70">No files uploaded yet.</div>}
    </div>
  )
}

export default InsFiles
