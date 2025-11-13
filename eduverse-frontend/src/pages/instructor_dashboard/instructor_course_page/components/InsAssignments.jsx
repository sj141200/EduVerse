import { useOutletContext } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSubmissions, getAssignments, createAssignment, updateAssignment } from '../../../../api/assignments'
import { useMessage } from '../../../../context/MessageContext.jsx'
import { getToken } from '../../../../api/auth'

function InsAssignments(){
  const ctx = useOutletContext() || {}
  const items = ctx.assignments || []
  const gradeAssignment = ctx.gradeAssignment
  // local state will fetch from API so UI stays current
  const [localAssignments, setLocalAssignments] = useState(ctx.assignments || [])
  const addAssignment = ctx.addAssignment
  const [editing, setEditing] = useState(null)
  const [gradeValue, setGradeValue] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newDue, setNewDue] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPoints, setNewPoints] = useState('')
  const [openAssignment, setOpenAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function openEditor(id, current) {
    setEditing(id)
    setGradeValue(current || '')
  }

  async function openSubmissions(assignmentId) {
    try {
      const course = ctx.course || {}
      const courseId = course._id || course.id || course
      if (!courseId) return
      const token = getToken()
      const subs = await getSubmissions(courseId, assignmentId, token)
      setOpenAssignment(assignmentId)
      setSubmissions(subs || [])
    } catch (e) {
      const { showMessage } = useMessage() || {}
      if (showMessage) showMessage('Failed to load submissions: ' + (e && (e.message || e)), 'error')
    }
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      const course = ctx.course || {}
      const courseId = course._id || course.id || course
      if (!courseId) return
      setLoading(true)
      setError(null)
      try {
        const token = getToken()
        const data = await getAssignments(courseId, token)
        const list = Array.isArray(data) ? data : (data && data.assignments) ? data.assignments : []
        if (!mounted) return
        setLocalAssignments(list)
      } catch (e) {
        const { showMessage } = useMessage() || {}
        if (showMessage) showMessage('Failed to load assignments: ' + (e && (e.message || e)), 'error')
        if (mounted) setError(e.message || 'Failed to load assignments')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [ctx.course])

  function saveGrade(id){
    if (!id) return
    if (typeof gradeAssignment === 'function') gradeAssignment(id, gradeValue)
    setEditing(null)
  }

  function createAssignmentTrigger(e){
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    const course = ctx.course || {}
    const courseId = course._id || course.id || course
    const payload = { title, due: newDue || 'TBD', description: newDescription || '', totalPoints: newPoints ? Number(newPoints) : undefined }
    // optimistic local add
    if (typeof addAssignment === 'function') addAssignment(title, newDue || 'TBD')
    setNewTitle('')
    setNewDue('')
    setNewDescription('')
    setNewPoints('')
    // call server to create and refresh local list
    ;(async () => {
      try {
        if (!courseId) return
        const token = getToken()
        await createAssignment(courseId, payload, token)
        const data = await getAssignments(courseId, token)
        const list = Array.isArray(data) ? data : (data && data.assignments) ? data.assignments : []
        setLocalAssignments(list)
      } catch (e) {
        const { showMessage } = useMessage() || {}
        if (showMessage) showMessage('Failed to create assignment: ' + (e && (e.message || e)), 'error')
      }
    })()
  }

  async function saveAssignmentUpdate(assignmentId, updates) {
    try {
      const course = ctx.course || {}
      const courseId = course._id || course.id || course
      if (!courseId || !assignmentId) return
      const token = getToken()
      await updateAssignment(courseId, assignmentId, updates, token)
      const data = await getAssignments(courseId, token)
      const list = Array.isArray(data) ? data : (data && data.assignments) ? data.assignments : []
      setLocalAssignments(list)
      setOpenAssignment(null)
    } catch (e) {
      const { showMessage } = useMessage() || {}
      if (showMessage) showMessage('Failed to save assignment changes: ' + (e && (e.message || e)), 'error')
    }
  }

  return (
    <div className="space-y-4">
      {typeof addAssignment === 'function' && (
        <form onSubmit={createAssignmentTrigger} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Assignment title" className="input input-sm input-bordered w-full md:col-span-3" />
            <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Description (optional)" className="textarea textarea-sm textarea-bordered w-full md:col-span-3" />
            <input value={newDue} onChange={e => setNewDue(e.target.value)} placeholder="Due (e.g. 2025-12-01)" className="input input-sm input-bordered w-full md:col-span-2" />
            <input value={newPoints} onChange={e => setNewPoints(e.target.value)} placeholder="Total points" className="input input-sm input-bordered w-full" />
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => { setNewTitle(''); setNewDue(''); setNewDescription(''); setNewPoints('') }}>Reset</button>
            <button className="btn btn-primary btn-sm" type="submit">Create assignment</button>
          </div>
        </form>
      )}
              { (localAssignments || []).map(it => (
        <div key={it._id || it.id} className="rounded-lg bg-base-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-base-content/70">Due: {it.due}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">{it.status}{it.grade ? ` • Grade: ${it.grade}` : ''}</div>
              {editing === (it._id || it.id) ? (
                <div className="flex items-center gap-2">
                  <input value={gradeValue} onChange={e => setGradeValue(e.target.value)} className="input input-sm input-bordered w-24" placeholder="e.g. 85" />
                  <button className="btn btn-sm btn-primary" onClick={() => saveGrade(it.id)}>Save</button>
                  <button className="btn btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm" onClick={() => openEditor(it.id, it.grade)}>Grade</button>
                  <button className="btn btn-sm" onClick={() => openSubmissions(it._id || it.id)}>Submissions</button>
                  <button className="btn btn-sm" onClick={() => setOpenAssignment(it._id || it.id)}>Edit</button>
                </div>
              )}
            </div>
          </div>
          {/* Submissions panel for this assignment */}
          {openAssignment && (openAssignment === (it._id || it.id)) && (
            <div className="mt-3 space-y-3">
              <div className="p-3 bg-base-100 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input defaultValue={it.title} id={`asg_title_${it._id}`} className="input input-sm input-bordered md:col-span-3" />
                  <textarea defaultValue={it.description || ''} id={`asg_desc_${it._id}`} className="textarea textarea-sm textarea-bordered md:col-span-3" />
                  <input defaultValue={it.due || ''} id={`asg_due_${it._id}`} className="input input-sm input-bordered" placeholder="Due date" />
                  <input defaultValue={it.totalPoints || ''} id={`asg_pts_${it._id}`} className="input input-sm input-bordered" placeholder="Total points" />
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button className="btn btn-sm" onClick={() => setOpenAssignment(null)}>Close</button>
                  <button className="btn btn-primary btn-sm" onClick={async () => {
                    try {
                      const updates = {
                        title: document.getElementById(`asg_title_${it._id}`).value,
                        description: document.getElementById(`asg_desc_${it._id}`).value,
                        due: document.getElementById(`asg_due_${it._id}`).value,
                        totalPoints: Number(document.getElementById(`asg_pts_${it._id}`).value || 0)
                      }
                      await saveAssignmentUpdate(it._id || it.id, updates)
                    } catch (e) { const { showMessage } = useMessage() || {}; if (showMessage) showMessage('Failed to save assignment changes: ' + (e && (e.message || e)), 'error') }
                  }}>Save changes</button>
                </div>
              </div>

              <div className="space-y-2">
                {submissions.map(s => (
                  <div key={s._id || s.id} className="p-2 bg-base-100 rounded flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{(s.student && (s.student.name || s.student.username)) || 'Student'}</div>
                      <div className="text-xs text-base-content/70">Submitted: {new Date(s.uploadedAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input defaultValue={s.grade || ''} id={`grade_${s._id}`} className="input input-sm input-bordered w-20" />
                      <button className="btn btn-sm btn-primary" onClick={async () => {
                        try {
                          const val = document.getElementById(`grade_${s._id}`).value
                          if (!val) return
                          if (typeof ctx.gradeSubmission === 'function') {
                            await ctx.gradeSubmission(it._id || it.id, s._id || s.id, { grade: Number(val) })
                            // refresh submissions
                            await openSubmissions(it._id || it.id)
                          }
                        } catch (e) { const { showMessage } = useMessage() || {}; if (showMessage) showMessage('Failed to save assignment submission grade: ' + (e && (e.message || e)), 'error') }
                      }}>Save</button>
                      {/* File download link if present */}
                      {s.content && s.content.file && s.content.file.downloadUrl && (
                        <a className="btn btn-sm btn-outline" href={s.content.file.downloadUrl} target="_blank" rel="noopener noreferrer">Download</a>
                      )}
                    </div>
                  </div>
                ))}
                {submissions.length === 0 && <div className="text-sm text-base-content/70">No submissions yet.</div>}
              </div>
            </div>
          )}
        </div>
      ))}
      { (localAssignments || []).length === 0 && <div className="text-base-content/70">No assignments yet.</div>}
    </div>
  )
}

export default InsAssignments
