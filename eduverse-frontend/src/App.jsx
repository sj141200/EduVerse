import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFoundPage from './pages/not_found/NotFoundPage'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LoginPage from './pages/auth/login/LoginPage.jsx'
import RegisterPage from './pages/auth/register/RegisterPage.jsx'



// Student dashboard imports
import StudentDashboardPage, { StudentDashboardHome } from './pages/student_dashboard/StudentDashboardPage.jsx'
import StudentCoursePage from './pages/student_dashboard/student_course_page/StudentCoursePage.jsx'
import StAnnouncements from './pages/student_dashboard/student_course_page/components/StAnnouncements.jsx'
import StAssignments from './pages/student_dashboard/student_course_page/components/StAssignments.jsx'
import StFiles from './pages/student_dashboard/student_course_page/components/StFiles.jsx'


// Instructor dashboard imports
import InstructorDashboardPage, { InstructorDashboardHome } from './pages/instructor_dashboard/InstructorDashboardPage.jsx'
import InsAnnouncements from './pages/instructor_dashboard/instructor_course_page/components/InsAnnouncements.jsx'
import InsAssignments from './pages/instructor_dashboard/instructor_course_page/components/InsAssignments.jsx'
import InsFiles from './pages/instructor_dashboard/instructor_course_page/components/InsFiles.jsx'
import InstructorCoursePage from './pages/instructor_dashboard/instructor_course_page/InstructorCoursePage.jsx'



function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <main className="px-4 py-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student dashboard with nested routes - index renders StudentDashboardHome */}
            <Route path="/st/dashboard" element={<StudentDashboardPage />}>
              <Route index element={<StudentDashboardHome />} />
              {/* Course detail with nested sections */}
              <Route path="class/:id" element={<StudentCoursePage />}>
                <Route index element={<StAnnouncements />} />
                <Route path="announcements" element={<StAnnouncements />} />
                <Route path="assignments" element={<StAssignments />} />
                <Route path="files" element={<StFiles />} />
              </Route>
            </Route>


            {/* Instructor dashboard with nested routes - index renders InstructorDashboardHome */}


            <Route path="/ins/dashboard" element={<InstructorDashboardPage />}>
              <Route index element={<InstructorDashboardHome />} />
              {/* Course detail with nested sections */}
              <Route path="class/:id" element={<InstructorCoursePage />}>
                <Route index element={<InsAnnouncements />} />
                <Route path="announcements" element={<InsAnnouncements />} />
                <Route path="assignments" element={<InsAssignments />} />
                <Route path="files" element={<InsFiles />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />}
             />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
