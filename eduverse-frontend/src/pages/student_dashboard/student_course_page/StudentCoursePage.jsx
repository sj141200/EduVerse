
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMessage } from '../../../context/MessageContext'
import { useAuth } from '../../../context/AuthContext'
import { fetchCourseDetails, joinCourse } from '../../../api/courses'
import { getAnnouncements } from '../../../api/announcements'
import { getUserById } from '../../../api/users'

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
  const { user, token } = useAuth() || {}
  const navigate = useNavigate()
  const [enrolled, setEnrolled] = useState(false)
  const [joinLoading, setJoinLoading] = useState(false)
  const { showMessage } = useMessage()

  const [announcements, setAnnouncements] = useState([])
  const [assignments, setAssignments] = useState([])
  const [files, setFiles] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await fetchCourseDetails(id, token)
        if (!mounted) return
        setCourse(data.course)
        // If course.teacher is present as an id (not populated), fetch the public profile
        try {
          const teacherVal = data.course && (data.course.teacher || (data.course.teacher === 0 ? 0 : null))
          if (teacherVal && typeof teacherVal === 'string' && /^[a-f0-9]{24}$/.test(teacherVal)) {
            try {
              const teacherProfile = await getUserById(teacherVal, token)
              if (teacherProfile) {
                // merge populated teacher into course object
                setCourse(prev => ({ ...(prev || {}), teacher: teacherProfile }))
              }
            } catch (e) {
              // ignore - leave course.teacher as id
            }
          }
        } catch (e) {}
        // announcements returned by the course endpoint may be full objects
        // or just an array of announcement ids. If we detect ids, fetch
        // the full announcement objects from the announcements endpoint.
        try {
          const rawAnns = data.announcements || []
          if (Array.isArray(rawAnns) && rawAnns.length > 0 && typeof rawAnns[0] !== 'object') {
            // fetch full announcements list for this course
            try {
              const res = await getAnnouncements(id, token)
              const fetched = Array.isArray(res) ? res : (res && (res.announcements || res.data) ? (res.announcements || res.data) : [])
              setAnnouncements(fetched || rawAnns)
            } catch (e) {
              setAnnouncements(rawAnns)
            }
          } else {
            setAnnouncements(rawAnns)
          }
        } catch (e) {
          setAnnouncements(data.announcements || [])
        }
        setAssignments(data.assignments || [])
        setFiles(data.files || [])
        // determine if current user is enrolled or is teacher
        try {
          const uid = user && (user._id || user.id)
          const students = (data.course && data.course.students) || []
          const isTeacher = data.course && data.course.teacher && (String(data.course.teacher._id || data.course.teacher) === String(uid))
          const isStudent = students.some(s => String(s) === String(uid) || (s && (s._id && String(s._id) === String(uid))))
          setEnrolled(Boolean(isTeacher || isStudent))
        } catch (e) {
          setEnrolled(false)
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
          {enrolled ? (
            <div className="p-4 bg-base-100 rounded-b-lg shadow">
              {/* The nested routes will render here */}
              <Outlet context={{ course, announcements, assignments, files }} />
            </div>
          ) : (
            <div className="p-6 bg-base-100 rounded-b-lg shadow space-y-4">
              <div className="text-lg font-semibold">You are not enrolled in this class</div>
              <div className="text-sm text-base-content/70">To view the classroom content, enter the class join code or contact the instructor.</div>
              {token ? (
                <div className="flex items-center gap-2">
                  <button className={`btn btn-primary btn-sm ${joinLoading ? 'loading' : ''}`} onClick={async () => {
                    setJoinLoading(true)
                    try {
                      const res = await joinCourse(id, token)
                      if (res && res.success) {
                        const data = await fetchCourseDetails(id, token)
                        setCourse(data.course)
                        setAnnouncements(data.announcements || [])
                        setAssignments(data.assignments || [])
                        setFiles(data.files || [])
                        setEnrolled(true)
                        showMessage('Joined class successfully', 'success')
                        setJoinLoading(false)
                        navigate(`/st/dashboard/class/${id}`)
                        return
                      }
                      showMessage('Failed to join the class', 'error')
                    } catch (err) {
                      showMessage(err.message || 'Join failed', 'error')
                    } finally { setJoinLoading(false) }
                  }}>Join class</button>
                </div>
              ) : (
                <div className="text-sm">Please log in to join this class.</div>
              )}
              {/* Errors are displayed using global MessageContext */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentCoursePage
