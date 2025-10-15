
import React, {useEffect, useState} from 'react';
import { getCourses, enroll } from '../api';
import { Link } from 'react-router-dom';

export default function Courses(){
  const [courses,setCourses]=useState([]);
  const [msg,setMsg]=useState('');

  useEffect(()=>{
    (async()=>{
      try{
        const r = await getCourses();
        setCourses(r.data || []);
      }catch(e){
        setMsg('Failed to load courses: ' + e.message);
      }
    })();
  },[]);

  const handleEnroll = async (id) => {
    try{
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await enroll(id, user.id || 1);
      setMsg('Enrolled (mock). Refreshing list...');
      const r = await getCourses();
      setCourses(r.data || []);
    }catch(e){
      setMsg('Enroll failed: ' + e.message);
    }
  };

  return (
    <div>
      <h3>Courses</h3>
      {msg && <p className="small">{msg}</p>}
      {courses.map(c=>(
        <div className="card" key={c.id}>
          <h4>{c.title}</h4>
          <p className="small">{c.description}</p>
          <div className="flex">
            <Link to={`/courses/${c.id}`}><button>View</button></Link>
            <button onClick={()=>handleEnroll(c.id)}>Enroll</button>
          </div>
        </div>
      ))}
    </div>
  );
}
