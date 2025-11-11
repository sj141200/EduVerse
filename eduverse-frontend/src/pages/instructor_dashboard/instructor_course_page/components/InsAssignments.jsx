import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'

function InsAssignments(){
  const ctx = useOutletContext() || {}
  const items = ctx.assignments || []
  const gradeAssignment = ctx.gradeAssignment
  const addAssignment = ctx.addAssignment
  const [editing, setEditing] = useState(null)
  const [gradeValue, setGradeValue] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newDue, setNewDue] = useState('')

  function openEditor(id, current) {
    setEditing(id)
    setGradeValue(current || '')
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
                <button className="btn btn-sm" onClick={() => openEditor(it.id, it.grade)}>Grade</button>
              )}
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="text-base-content/70">No assignments yet.</div>}
    </div>
  )
}

export default InsAssignments
