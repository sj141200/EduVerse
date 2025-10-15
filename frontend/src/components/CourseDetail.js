
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { getCourse } from '../api';

export default function CourseDetail(){
  const { id } = useParams();
  const [course,setCourse]=useState(null);
  const [msg,setMsg]=useState('');

  useEffect(()=>{
    (async()=>{
      try{
        const r = await getCourse(id);
        setCourse(r.data);
      }catch(e){
        setMsg('Failed to load course: ' + e.message);
      }
    })();
  },[id]);

  if(!course) return <div className="card"><p>Loading...</p><p className="small">{msg}</p></div>;

  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p className="small">Instructor: {course.instructor}</p>
      <p>{course.description}</p>
      {course.videoUrl ? (
        <video className="video" controls src={course.videoUrl} />
      ) : (
        <div className="video small">No video available</div>
      )}
      <div style={{marginTop:12}}>
        <strong>Enrollments:</strong> {course.enrollments ? course.enrollments.length : 0}
      </div>
    </div>
  );
}
