import { useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAssignments, submitAssignment, getSubmissions } from '../../../../api/assignments'
import { uploadFileWithProgress } from '../../../../api/files'
import { getToken } from '../../../../api/auth'
import { useMessage } from '../../../../context/MessageContext'

function StAssignments(){
  const ctx = useOutletContext() || {}
  const course = ctx.course || {}
  const courseId = course._id || course.id || course

  const [items, setItems] = useState(ctx.assignments || [])
  const [mySubmissions, setMySubmissions] = useState({}) // { [assignmentId]: [submissions] }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { showMessage } = useMessage() || {}

  // drafts: { [assignmentId]: { file: File|null, text: string, uploading: boolean, uploadedFileId: string|null, progress: number } }
  const [drafts, setDrafts] = useState({})

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!courseId) return
      setLoading(true)
      setError(null)
      try {
        const token = getToken()
        const data = await getAssignments(courseId, token)
        if (!mounted) return
        // assignments API may return array or object with assignments
        const list = Array.isArray(data) ? data : (data && data.assignments) ? data.assignments : []
        setItems(list)
      } catch (e) {
        setError(e.message || 'Failed to load assignments')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [courseId])

  if (loading) return <div>Loading assignments…</div>
  if (error) return <div className="text-error">{error}</div>

  return (
    <div className="space-y-4">
      {items.map(it => (
        <div key={it._id || it.id} className="rounded-lg bg-base-200 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              {it.description && <div className="text-sm text-base-content/70 mt-1">{it.description}</div>}
              <div className="text-sm text-base-content/70 mt-2">Due: {it.due || 'TBD'}</div>
              {typeof it.totalPoints !== 'undefined' && <div className="text-sm text-base-content/70">Points: {it.totalPoints}</div>}
            </div>
            <div className="text-sm font-medium text-primary text-right">
              <div>{it.status || 'Open'}</div>
              {it.grade !== undefined && <div className="mt-1">Grade: {it.grade}</div>}
            </div>
          </div>
          {/* Submission UI for student */}
          <div className="mt-3 bg-base-100 p-3 rounded">
            <div className="text-sm mb-2">Submit your work</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
              <input type="file" onChange={e => {
                const f = e.target.files && e.target.files[0]
                setDrafts(prev => ({ ...prev, [it._id || it.id]: { ...(prev[it._id || it.id] || {}), file: f, uploadedFileId: null, progress: 0 } }))
              }} className="file-input file-input-sm file-input-bordered md:col-span-2" />
              <input value={(drafts[it._id || it.id] && drafts[it._id || it.id].text) || ''} onChange={e => setDrafts(prev => ({ ...prev, [it._id || it.id]: { ...(prev[it._id || it.id] || {}), text: e.target.value } }))} placeholder="Notes (optional)" className="input input-sm input-bordered" />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button className="btn btn-sm" onClick={() => setDrafts(prev => ({ ...prev, [it._id || it.id]: {} }))}>Reset</button>
              <button
                className={`btn btn-primary btn-sm ${drafts[it._id || it.id] && drafts[it._id || it.id].uploading ? 'loading' : ''}`}
                onClick={async () => {
                  try {
                    const d = drafts[it._id || it.id] || {}
                    if (!d.file && !d.text) return showMessage && showMessage('Please add a file or notes before submitting', 'warning')

                    setDrafts(prev => ({ ...prev, [it._id || it.id]: { ...(prev[it._id || it.id] || {}), uploading: true, progress: prev => (prev && prev.progress) || 0 } }))

                    const token = getToken()

                    let uploadedFileId = d.uploadedFileId || null

                    // If there's a file and it hasn't been uploaded yet, upload to Azure first
                    if (d.file && !uploadedFileId) {
                      try {
                        // show progress callback
                        const onProgress = (percent) => {
                          setDrafts(prev => ({ ...prev, [it._id || it.id]: { ...(prev[it._id || it.id] || {}), progress: percent } }))
                        }
                        const resp = await uploadFileWithProgress(courseId, d.file, token, onProgress)
                        // resp should contain uploadedFileId
                        uploadedFileId = (resp && (resp.uploadedFileId || resp.id || resp._id)) ? (resp.uploadedFileId || resp.id || resp._id) : null
                        setDrafts(prev => ({ ...prev, [it._id || it.id]: { ...(prev[it._id || it.id] || {}), uploadedFileId, progress: 100 } }))
                      } catch (upErr) {
                        setDrafts(prev => ({ ...prev, [it._id || it.id]: { ...(prev[it._id || it.id] || {}), uploading: false } }))
                        return showMessage && showMessage('File upload failed: ' + (upErr && (upErr.message || upErr)), 'error')
                      }
                    }

                    // Now submit assignment with either uploadedFileId or without file
                    const payload = { text: d.text || null }
                    if (uploadedFileId) payload.uploadedFileId = uploadedFileId

                    await submitAssignment(courseId, it._id || it.id, payload, token)

                    // refresh student's submissions for this assignment
                    try {
                      const subs = await getSubmissions(courseId, it._id || it.id, token)
                      // filter to mine (backend marks mine=true)
                      const mine = (subs || []).filter(s => s && s.mine)
                      setMySubmissions(prev => ({ ...prev, [it._id || it.id]: mine }))
                    } catch (e) {
                      // ignore refresh failures
                    }

                    setDrafts(prev => ({ ...prev, [it._id || it.id]: { file: null, text: '', uploading: false, uploadedFileId: null, progress: 0 } }))
                    showMessage && showMessage('Submission uploaded', 'success')
                  } catch (e) {
                    setDrafts(prev => ({ ...prev, [it._id || it.id]: { ...(prev[it._id || it.id] || {}), uploading: false } }))
                    showMessage && showMessage('Submission failed: ' + (e && (e.message || e)), 'error')
                  }
                }}
              >Submit</button>
              {/* show student's submission(s) if available from either backend or local refresh */}
              {(() => {
                const aid = it._id || it.id
                const subsFromState = mySubmissions[aid] && mySubmissions[aid].length > 0 ? mySubmissions[aid] : null
                const subsFromAssignment = it.mySubmission ? [it.mySubmission] : null
                const submissionsToShow = subsFromState || subsFromAssignment
                if (!submissionsToShow) return null
                return (
                  <div className="mt-3 space-y-2">
                    <div className="text-sm font-medium">Your submission</div>
                    {submissionsToShow.map(s => (
                      <div key={s._id || s.id} className="p-2 bg-base-100 rounded">
                        {s.content && s.content.text && <div className="text-sm">Notes: {s.content.text}</div>}
                        {s.content && s.content.file && s.content.file.downloadUrl && (
                          <div className="mt-2"><a className="link" href={s.content.file.downloadUrl} target="_blank" rel="noopener noreferrer">Download submitted file</a></div>
                        )}
                        {typeof s.grade !== 'undefined' && <div className="text-sm mt-2">Grade: {s.grade}</div>}
                        {s.feedback && <div className="text-sm mt-1">Feedback: {s.feedback}</div>}
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="text-base-content/70">No assignments yet.</div>}
    </div>
  )
}

export default StAssignments
