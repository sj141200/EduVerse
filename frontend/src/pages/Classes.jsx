// filepath: d:\EduVerse\EduVerse\frontend\src\pages\Classes.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]); // refetch when navigation happens

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/classes`);
      setClasses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('fetchClasses error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = () => navigate('/create-class');

  if (loading) return <div className="p-6 text-center">Loading classes...</div>;
  if (error) return (
    <div className="p-6 text-center">
      <div className="text-red-600 mb-4">Error: {error}</div>
      <button onClick={fetchClasses} className="px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <button onClick={handleCreateClass} className="bg-blue-600 text-white px-4 py-2 rounded">Create New Class</button>
      </div>

      {classes.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded">
          <p className="text-gray-600">No classes yet.</p>
          <button onClick={handleCreateClass} className="mt-4 text-blue-600">Create your first class</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(c => (
            <div key={c._id || c.id} className="border rounded p-4 shadow-sm">
              <h3 className="text-lg font-semibold">{c.name || c.title}</h3>
              <p className="text-sm text-gray-600">Subject: {c.subject || '—'}</p>
              <p className="text-sm text-gray-600">Students: {(c.students && c.students.length) || 0}</p>
              <div className="mt-3">
                <Link to={`/classes/${c._id || c.id}`} className="text-blue-600">View details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}