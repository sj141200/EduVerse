
import { Outlet, NavLink, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCourseDetails } from '../../../utils/courseApi'

function TabLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `px-4 py-2 rounded-t-lg ${isActive ? 'bg-base-100 border-b-2 border-primary font-semibold' : 'text-base-content/70'}`}
    >
      {children}
    </NavLink>
  )
}

function InstructorCoursePage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)

  const [classCode, setClassCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const [announcements, setAnnouncements] = useState([])
  const [assignments, setAssignments] = useState([])
  const [files, setFiles] = useState([])

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editSeed, setEditSeed] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await fetchCourseDetails(id)
        if (!mounted) return

        // set base course
        setCourse(data.course)

        // load/generate class code (persisted in meta)
        try {
          const keyMeta = `eduverse_course_${id}_meta`
          const rawMeta = localStorage.getItem(keyMeta)
          const meta = rawMeta ? JSON.parse(rawMeta) : {}
          if (meta.classCode) {
            setClassCode(meta.classCode)
          } else {
            const code = (Math.random().toString(36).slice(2,10)).toUpperCase()
            meta.classCode = code
            localStorage.setItem(keyMeta, JSON.stringify(meta))
            setClassCode(code)
          }
        } catch (e) {
          // ignore
        }

        // merge persisted local edits (dev-friendly) with remote data
        try {
          const annKey = `eduverse_course_${id}_announcements`
          const fileKey = `eduverse_course_${id}_files`
          const assignKey = `eduverse_course_${id}_assignments`
          const savedAnn = JSON.parse(localStorage.getItem(annKey) || '[]')
          const savedFiles = JSON.parse(localStorage.getItem(fileKey) || '[]')
          const savedAssign = JSON.parse(localStorage.getItem(assignKey) || '[]')

          setAnnouncements([...(savedAnn || []), ...(data.announcements || [])])
          setFiles([...(savedFiles || []), ...(data.files || [])])
          setAssignments([...(savedAssign || []), ...(data.assignments || [])])
        } catch (e) {
          setAnnouncements(data.announcements || [])
          setAssignments(data.assignments || [])
          setFiles(data.files || [])
        }
      } catch (err) {
        // fallback to localStorage/demo
        try {
          const raw = localStorage.getItem('eduverse_enrolled')
          if (raw) {
            const arr = JSON.parse(raw)
            const found = arr.find(c => c.id === id)
            if (found) {
              setCourse(found)
              return
            }
          }
        } catch (e) {}
        setCourse({ id, title: 'Distributed Database Systems [CSL7750] - Fall 2025', bannerSeed: 42 })
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  if (!course) return null

  function startEdit() {
    setEditTitle(course.title || '')
    setEditSeed(String(course.bannerSeed || ''))
    setEditing(true)
  }

  function copyCode() {
    if (!classCode || !navigator?.clipboard) return
    navigator.clipboard.writeText(classCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }

  function copyLink() {
    if (!classCode || !navigator?.clipboard) return
    const url = `${window.location.origin}/st/dashboard/class/${classCode}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 1500)
    }).catch(() => {})
  }

  function saveEdit() {
    const updates = { title: editTitle, bannerSeed: Number(editSeed) || course.bannerSeed }
    setCourse(prev => ({ ...prev, ...updates }))
    try {
      const key = `eduverse_course_${id}_meta`
      const raw = localStorage.getItem(key)
      const meta = raw ? JSON.parse(raw) : {}
      localStorage.setItem(key, JSON.stringify({ ...meta, ...updates }))
    } catch (e) {}
    setEditing(false)
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-4">
      <div className="rounded-lg overflow-hidden mb-4">
        <div className="w-full h-44 bg-cover bg-center flex items-end" style={{ backgroundImage: `url(https://picsum.photos/1200/300?random=${course.bannerSeed || 42})` }}>
          <div className="p-6 bg-linear-to-t from-black/50 to-transparent w-full flex items-start justify-between gap-4">
            <div className="flex-1">
              {editing ? (
                <div className="space-y-2">
                  <input className="input input-sm input-bordered w-full text-lg" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                  <div className="flex items-center gap-2">
                    <input className="input input-sm input-bordered w-40" value={editSeed} onChange={e => setEditSeed(e.target.value)} placeholder="bannerSeed" />
                    <button className="btn btn-sm btn-primary" onClick={saveEdit}>Save</button>
                    <button className="btn btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <h1 className="text-2xl md:text-3xl text-white font-bold truncate">{course.title}</h1>
              )}
            </div>

            {!editing && (
              <div>
                <button className="btn btn-ghost btn-sm text-white" onClick={startEdit}>Edit</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-start">

        {/* Left info column (class code, upcoming) */}
        <div className="w-80 hidden lg:block">
          <div className="space-y-4">
            <div className="rounded-lg bg-base-200 p-4">
              <div className="font-semibold">Class code</div>
              <div className="flex items-center gap-3 mt-2">
                <div className="text-lg font-mono tracking-wider">{classCode || '—'}</div>
                <button className="btn btn-sm" onClick={copyCode}>{copied ? 'Copied' : 'Copy'}</button>
              </div>
            </div>

            <div className="rounded-lg bg-base-200 p-4">
              <div className="font-semibold">Share</div>
              <div className="text-sm text-base-content/70 mt-2">Share this link so students can join your class</div>
              <div className="mt-3 flex items-center gap-2">
                <a className="text-sm break-all" target="_blank" rel="noreferrer" href={`${window.location.origin}/st/dashboard/class/${classCode}`}>{`${window.location.origin}/st/dashboard/class/${classCode}`}</a>
                <button className="btn btn-sm" onClick={copyLink}>{copiedLink ? 'Copied' : 'Copy link'}</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="tabs bg-base-200 rounded-t-lg px-2">
            <TabLink to="announcements">Announcements</TabLink>
            <TabLink to="assignments">Assignments</TabLink>
            <TabLink to="files">Files</TabLink>
          </div>

          <div className="p-4 bg-base-100 rounded-b-lg shadow">
            {/* Provide mutation helpers for instructor actions via outlet context */}
            <Outlet context={{
              course,
              announcements,
              assignments,
              files,
              addAnnouncement: (text, author = 'Instructor') => {
                const a = { id: Date.now().toString(), author, text, time: new Date().toLocaleString() }
                setAnnouncements(prev => [a, ...prev])
                // persist lightly for dev convenience
                try {
                  const key = `eduverse_course_${id}_announcements`
                  const raw = localStorage.getItem(key)
                  const arr = raw ? JSON.parse(raw) : []
                  localStorage.setItem(key, JSON.stringify([a, ...arr]))
                } catch (e) {}
              },
              uploadFile: (file) => {
                if (!file) return
                const f = { id: Date.now().toString(), name: file.name || String(file), size: file.size ? `${Math.round(file.size/1024)} KB` : '—', uploadedAt: new Date().toLocaleString() }
                setFiles(prev => [f, ...prev])
                try {
                  const key = `eduverse_course_${id}_files`
                  const raw = localStorage.getItem(key)
                  const arr = raw ? JSON.parse(raw) : []
                  localStorage.setItem(key, JSON.stringify([f, ...arr]))
                } catch (e) {}
              },
              addAssignment: (title, due) => {
                const asg = { id: Date.now().toString(), title: title || 'New Assignment', due: due || 'TBD', status: 'Open' }
                setAssignments(prev => [asg, ...prev])
                try {
                  const key = `eduverse_course_${id}_assignments`
                  const raw = localStorage.getItem(key)
                  const arr = raw ? JSON.parse(raw) : []
                  localStorage.setItem(key, JSON.stringify([asg, ...arr]))
                } catch (e) {}
              },
              gradeAssignment: (assignmentId, grade) => {
                setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, grade, status: 'Graded' } : a))
                try {
                  const key = `eduverse_course_${id}_assignments`
                  const raw = localStorage.getItem(key)
                  const arr = raw ? JSON.parse(raw) : []
                  const updated = arr.map(a => a.id === assignmentId ? { ...a, grade, status: 'Graded' } : a)
                  localStorage.setItem(key, JSON.stringify(updated))
                } catch (e) {}
              },
              updateCourseDetails: (updates) => {
                setCourse(prev => ({ ...prev, ...updates }))
                try {
                  const key = `eduverse_course_${id}_meta`
                  const raw = localStorage.getItem(key)
                  const meta = raw ? JSON.parse(raw) : {}
                  localStorage.setItem(key, JSON.stringify({ ...meta, ...updates }))
                } catch (e) {}
              }
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorCoursePage
