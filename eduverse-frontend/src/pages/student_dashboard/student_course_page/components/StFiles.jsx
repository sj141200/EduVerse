import { useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMessage } from '../../../../context/MessageContext.jsx'
import { getFiles, getDownloadUrl } from '../../../../api/files'
import { getToken } from '../../../../api/auth'

function StFiles(){
  const ctx = useOutletContext() || {}
  const ctxFiles = ctx.files || []
  const [items, setItems] = useState(ctxFiles || [])

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
        const mapped = (remote || []).map(r => ({
          id: r.id || r._id || String(r.uploadedFileId || r._id),
          name: r.name || r.filename || r.originalName || r._id,
          size: typeof r.size === 'number' ? `${Math.round(r.size/1024)} KB` : (r.size || '—'),
          downloadUrl: r.downloadUrl || r.url,
          url: r.url,
          blobName: r.blobName,
          uploading: false
        }))
        const all = [...(ctxFiles || []), ...mapped]
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

  async function handleDownload(it) {
    try {
      const course = ctx.course || {}
      const courseId = course._id || course.id || course
      if (!courseId) return
      const token = getToken()
      const resp = await getDownloadUrl(courseId, it.id, token)
      if (resp && resp.downloadUrl) {
        await triggerDownloadWithName(resp.downloadUrl, it.name || it.filename || it.originalName || 'file')
      } else if (it.url) {
        await triggerDownloadWithName(it.url, it.name || it.filename || it.originalName || 'file')
      }
    } catch (e) {
      const { showMessage } = useMessage() || {}
      if (showMessage) showMessage('Download failed: ' + (e && (e.message || e)), 'error')
      if (it.url) await triggerDownloadWithName(it.url, it.name || it.filename || it.originalName || 'file')
    }
  }

  // Try to trigger a download using a hidden <a download> tag. If the URL is cross-origin
  // and the browser does not honor the download attribute, fall back to fetching the file
  // and creating a blob URL so the download starts with the original filename.
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

      // For cross-origin URLs, try to fetch the file and force download using a blob URL
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
      // Last resort: open in new tab
      window.open(url, '_blank', 'noopener')
    }
  }

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
          <div>
            {it.blobName || it.downloadUrl || it.url ? (
              <button className="btn btn-xs" onClick={() => handleDownload(it)}>Download</button>
            ) : (
              <span className="text-sm text-base-content/60">Preparing…</span>
            )}
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="text-base-content/70">No files uploaded yet.</div>}
    </div>
  )
}

export default StFiles
