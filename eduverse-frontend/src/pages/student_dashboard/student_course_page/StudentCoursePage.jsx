
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

function StudentCoursePage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)

  const [announcements, setAnnouncements] = useState([])
  const [assignments, setAssignments] = useState([])
  const [files, setFiles] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await fetchCourseDetails(id)
        if (!mounted) return
        setCourse(data.course)
        setAnnouncements(data.announcements || [])
        setAssignments(data.assignments || [])
        setFiles(data.files || [])
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

  return (
    <div className="w-full max-w-7xl mx-auto py-4">
      <div className="rounded-lg overflow-hidden mb-4">
        <div className="w-full h-44 bg-cover bg-center flex items-end" style={{ backgroundImage: `url(https://picsum.photos/1200/300?random=${course.bannerSeed || 42})` }}>
          <div className="p-6 bg-linear-to-t from-black/50 to-transparent w-full">
            <h1 className="text-2xl md:text-3xl text-white font-bold truncate">{course.title}</h1>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-start">

        <div className="flex-1">
          <div className="tabs bg-base-200 rounded-t-lg px-2">
            <TabLink to="announcements">Announcements</TabLink>
            <TabLink to="assignments">Assignments</TabLink>
            <TabLink to="files">Files</TabLink>
          </div>

          <div className="p-4 bg-base-100 rounded-b-lg shadow">
            {/* The nested routes will render here */}
            <Outlet context={{ course, announcements, assignments, files }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCoursePage
