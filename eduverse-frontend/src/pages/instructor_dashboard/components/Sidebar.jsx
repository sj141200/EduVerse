import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Home, History, ListTodo, Settings } from 'lucide-react';
import { useState } from 'react';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { to: '/ins/dashboard', label: 'Dashboard Home', icon: <Home size={18} /> },
  ];

  const createdCourses = [
    { "name": "Technical Communication", "id": "c1" },
    { "name": "CSL7620: Machine Learning", "id": "c2" },
    { "name": "Mathematical Foundations", "id": "c3" },
    { "name": "ADSA CSL7560 2025-26", "id": "c4" },
    { "name": "CSL7090 Software and Data Eng", "id": "c5" },
    { "name": "Distributed Database Systems", "id": "c6" },
  ];
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
            {createdCourses.map(cls => (
              <button
                key={cls.id}
                className="btn btn-ghost justify-start text-left w-full"
                onClick={() => { setMenuOpen(false); navigate(`/ins/dashboard/class/${cls.id}`); }}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </details>
      </aside>
    </>
  );
}

export default Sidebar;