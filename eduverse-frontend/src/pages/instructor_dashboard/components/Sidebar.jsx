import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Home, History, ListTodo, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getEnrolledCourses } from '../../../api/courses';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, user } = useAuth() || {};
  const links = [
    { to: '/ins/dashboard', label: 'Dashboard Home', icon: <Home size={18} /> },
    { to: '/ins/dashboard/profile', label: 'Profile', icon: <Settings size={18} /> },
  ];

  const [createdCourses, setCreatedCourses] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) return;
      try {
        const res = await getEnrolledCourses(token);
        if (!mounted) return;
        const arr = Array.isArray(res) ? res : [];
        // normalize
        const mapped = arr.map(c => ({ id: c._id || c.id, title: c.title, teacher: (c.teacher && (c.teacher.name || c.teacher.username)) || c.teacher, raw: c }));
        // created courses: where current user is teacher
        const created = mapped.filter(c => {
          const t = c.raw && c.raw.teacher;
          const tid = (t && (t._id || t.id)) || t;
          return user && (String(tid) === String(user.id || user._id || user._id));
        });
        // enrolled: exclude created
        const enrolled = mapped.filter(c => !created.find(x => x.id === c.id));
        setCreatedCourses(created);
        setEnrolledCourses(enrolled);
      } catch (e) {
        console.warn('Failed to load courses for sidebar', e.message);
      }
    }
    load();
    return () => { mounted = false };
  }, [token, user]);

  return (
    <>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMenuOpen(false)}></div>
      )}
      {/* Side Panel */}
      <aside
        className={`bg-base-200 shadow-lg flex flex-col gap-2 py-8 px-4 z-50
        fixed md:static top-0 left-0 h-full w-64 transition-transform duration-200
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ minHeight: '100vh' }}
      >
        <nav className="flex flex-col gap-2 mt-8 md:mt-0">
          {links.map(link => (
            <button
              key={link.to}
              className={`btn btn-ghost justify-start text-left ${location.pathname === link.to ? 'btn-active bg-primary/10' : ''}`}
              onClick={() => { setMenuOpen(false); navigate(link.to); }}
            >
              <span className="mr-2">{link.icon}</span>{link.label}
            </button>
          ))}
        </nav>

        <details className="collapse bg-base-100 border border-base-300" name="my-accordion-det-1" open>
          <summary className="collapse-title font-semibold">Created Courses</summary>
          <div className="divider"></div>
          <div className="collapse-content text-sm">
            {createdCourses.length === 0 && <div className="text-sm px-2 py-1">No created courses</div>}
            {createdCourses.map(cls => (
              <button
                key={cls.id}
                className="btn btn-ghost justify-start text-left w-full"
                onClick={() => { setMenuOpen(false); navigate(`/ins/dashboard/class/${cls.id}`); }}
              >
                {cls.title}
              </button>
            ))}
          </div>
        </details>
      </aside>
    </>
  );
}

export default Sidebar;