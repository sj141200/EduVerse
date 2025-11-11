import Sidebar from './components/Sidebar';
import { Outlet, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import CourseCard from './components/CourseCard'


function StudentDashboardHome() {
  const navigate = useNavigate();
  // const { user } = useAuth() || {};
  const [query, setQuery] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Try to load enrolled classes from localStorage (dev-friendly). If none, use sample data.
    try {
      const raw = localStorage.getItem('eduverse_enrolled')
      if (raw) {
        setClasses(JSON.parse(raw))
        return
      }
    } catch (e) {
      // ignore
    }

    // Sample demo classes to resemble the Google Classroom screenshot
    const demo = [
      { id: 'c1', title: 'Tele Communication', term: 'July-November 2025', teacher: 'Tonisha Guin', color: '#d97706', seed: 11 },
      { id: 'c2', title: 'CSL7620: Machine Learning', term: 'Angshuman Paul', teacher: 'Angshuman Paul', color: '#1e40af', seed: 12 },
      { id: 'c3', title: 'Mathematical Foundations', term: 'Anand Mishra', teacher: 'Anand Mishra', color: '#111827', seed: 13 },
      { id: 'c4', title: 'ADSA CSL7560 2025-26', term: 'Vimal Raj Sharma', teacher: 'Vimal Raj Sharma', color: '#0f172a', seed: 14 },
      { id: 'c5', title: 'CSL7090 Software and Data Eng', term: 'PG July 2025', teacher: 'Sumit Kalra', color: '#1e40af', seed: 15 },
      { id: 'c6', title: 'Distributed Database Systems', term: 'Romi Banerjee', teacher: 'Romi Banerjee', color: '#2dd4bf', seed: 16 },
    ];
    setClasses(demo);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter(c => (c.title + ' ' + (c.teacher || '') + ' ' + (c.term || '')).toLowerCase().includes(q));
  }, [classes, query]);

  return (
    <div className="flex flex-col items-center py-6 px-4 w-full">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Classroom</h1>
            <p className="text-sm text-base-content/60">Welcome back{"Test User" ? `, ${"Test User".split(' ')[0]}` : ''} — pick a class to get started.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="form-control">
              <input type="text" placeholder="Search classes" value={query} onChange={e => setQuery(e.target.value)} className="input input-sm input-bordered w-72" />
            </div>
            <div className="avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">{("Test User" || 'A').charAt(0)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cls) => (
            <CourseCard key={cls.id} course={cls} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-base-100 flex">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen w-full transition-all duration-200 justify-center">
        <div className="flex-1 flex flex-col items-center justify-start w-full px-2 py-4">
          <div className="w-full max-w-6xl mx-auto">
            {/* Nested routes render here */}
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboardPage;
export { StudentDashboardHome };
