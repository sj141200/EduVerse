
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Grid } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from 'react';
import { getEnrolledCourses } from '../api/courses';


function Navbar() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    
    let mounted = true;
    async function load() {
      if (!token) { setCourses([]); return; }
      try {
        const res = await getEnrolledCourses(token);
        if (!mounted) return;
        setCourses(Array.isArray(res) ? res : []);
      } catch (e) {
        console.warn('Failed to load enrolled courses', e.message);
        setCourses([]);
      }
    }
    load();
    return () => { mounted = false };
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const basePath = (user && user.role === 'instructor') ? '/ins/dashboard' : '/st/dashboard';

  return (
    <nav className="navbar sticky top-0 z-100 bg-transparent shadow-md px-4 backdrop-blur-xs">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">Eduverse</Link>
      </div>
      <div className="flex-none flex items-center gap-2">
        {!token && (
          <>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}

        {token && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost"> 
              <Grid className="w-5 h-5 mr-2" /> Classroom
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56">
              {courses.length === 0 && <li className="text-sm px-3 py-2">No classes</li>}
              {courses.map(c => (
                <li key={c._id || c.id}>
                  <Link to={`${basePath}/class/${c._id || c.id}`} className="truncate">{c.title}</Link>
                </li>
              ))}
              <li><hr className="my-1" /></li>
              <li><Link to={`${basePath}`}>Open Classroom</Link></li>
            </ul>
          </div>
        )}

        {token && (
          <button
            className="btn btn-ghost btn-circle"
            title="Logout"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
