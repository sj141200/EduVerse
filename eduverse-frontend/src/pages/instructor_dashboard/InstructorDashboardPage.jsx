import Sidebar from './components/Sidebar';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import CourseCard from './components/CourseCard'
import { getEnrolledCourses, createCourse } from '../../api/courses';


function InstructorDashboardHome() {
  const navigate = useNavigate();
  const { user, token } = useAuth() || {};
  const [query, setQuery] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (token) {
          const res = await getEnrolledCourses(token);
          if (!mounted) return;
          const mapped = (Array.isArray(res) ? res : []).map(c => ({ id: c._id || c.id, title: c.title, teacher: (c.teacher && (c.teacher.name || c.teacher.username)) || c.teacher || 'Unknown', color: (c.meta && c.meta.color) || '#1f2937' }));
          setClasses(mapped);
          return;
        }
      } catch (e) {
        console.warn('Failed to fetch enrolled', e.message);
      }

      // Fallback demo classes (offline/dev)
      const demo = [
        { id: 'c1', title: 'Tele Communication', term: 'July-November 2025', teacher: 'Tonisha Guin', color: '#d97706', seed: 11 },
        { id: 'c2', title: 'CSL7620: Machine Learning', term: 'Angshuman Paul', teacher: 'Angshuman Paul', color: '#1e40af', seed: 12 },
      ];
      if (mounted) setClasses(demo);
    }
    load();
    return () => { mounted = false };
  }, [token]);

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
            <div>
              <button
                className="btn btn-sm btn-primary"
                onClick={async () => {
                  // create course via API
                  try {
                    const created = await createCourse(token, { title: 'New Class', term: 'Term TBD' });
                    const mapped = { id: created._id || created.id, title: created.title, teacher: (created.teacher && (created.teacher.name || created.teacher.username)) || 'You', color: (created.meta && created.meta.color) || '#06b6d4' };
                    setClasses(prev => [mapped, ...prev]);
                    navigate(`/ins/dashboard/class/${mapped.id}`);
                  } catch (e) {
                    console.error('Failed to create course', e.message);
                  }
                }}
              >
                Create class
              </button>
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

function InstructorDashboardPage() {
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

export default InstructorDashboardPage;
export { InstructorDashboardHome };
