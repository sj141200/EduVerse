import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { getSubmissions } from '../../../../api/assignments'
import { getToken } from '../../../../api/auth'

function InsAssignments(){
  const ctx = useOutletContext() || {}
  const items = ctx.assignments || []
  const gradeAssignment = ctx.gradeAssignment
  const addAssignment = ctx.addAssignment
  const [editing, setEditing] = useState(null)
  const [gradeValue, setGradeValue] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newDue, setNewDue] = useState('')
  const [openAssignment, setOpenAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])

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
      console.error('Failed to load submissions', e)
    }
  }

  function saveGrade(id){
    if (!id) return
    if (typeof gradeAssignment === 'function') gradeAssignment(id, gradeValue)
    setEditing(null)
  }

  function createAssignment(e){
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    if (typeof addAssignment === 'function') addAssignment(title, newDue || 'TBD')
    setNewTitle('')
    setNewDue('')
  }

  return (
    <div className="space-y-4">
      {typeof addAssignment === 'function' && (
        <form onSubmit={createAssignment} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Assignment title" className="input input-sm input-bordered w-full md:col-span-2" />
            <input value={newDue} onChange={e => setNewDue(e.target.value)} placeholder="Due (e.g. 2025-12-01)" className="input input-sm input-bordered w-full" />
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary btn-sm" type="submit">Create assignment</button>
          </div>
        </form>
      )}
              {items.map(it => (
        <div key={it.id} className="rounded-lg bg-base-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-base-content/70">Due: {it.due}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">{it.status}{it.grade ? ` • Grade: ${it.grade}` : ''}</div>
              {editing === it.id ? (
                <div className="flex items-center gap-2">
                  <input value={gradeValue} onChange={e => setGradeValue(e.target.value)} className="input input-sm input-bordered w-24" placeholder="e.g. 85" />
                  <button className="btn btn-sm btn-primary" onClick={() => saveGrade(it.id)}>Save</button>
                  <button className="btn btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm" onClick={() => openEditor(it.id, it.grade)}>Grade</button>
                  <button className="btn btn-sm" onClick={() => openSubmissions(it._id || it.id)}>Submissions</button>
                </div>
              )}
            </div>
          </div>
          {/* Submissions panel for this assignment */}
          {openAssignment && (openAssignment === (it._id || it.id)) && (
            <div className="mt-3 space-y-2">
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
                      } catch (e) { console.error(e) }
                    }}>Save</button>
                  </div>
                </div>
              ))}
              {submissions.length === 0 && <div className="text-sm text-base-content/70">No submissions yet.</div>}
            </div>
          )}
        </div>
      ))}
      {items.length === 0 && <div className="text-base-content/70">No assignments yet.</div>}
    </div>
  )
}

export default InsAssignments
