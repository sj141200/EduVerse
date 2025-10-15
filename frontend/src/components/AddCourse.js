
import React, {useState} from 'react';
import { addCourse, uploadToBlob } from '../api';

export default function AddCourse(){
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [instructor,setInstructor]=useState('Instructor');
  const [file,setFile]=useState(null);
  const [msg,setMsg]=useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('Submitting...');
    try{
      let videoUrl = '';
      if(file){
        setMsg('Uploading file...');
        const res = await uploadToBlob(file, file.name);
        videoUrl = res.url;
      }
      const r = await addCourse({title, description: desc, instructor, videoUrl});
      setMsg('Course added: ' + (r.data.id || 'id-n/a'));
      setTitle(''); setDesc(''); setFile(null);
    }catch(e){
      setMsg('Failed: ' + e.message);
    }
  };

  return (
    <div className="card">
      <h3>Add Course (Instructor)</h3>
      <form onSubmit={handleSubmit}>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <input className="input" value={instructor} onChange={e=>setInstructor(e.target.value)} placeholder="Instructor" />
        <textarea className="input" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" />
        <div className="small">Upload video (optional) — requires REACT_APP_BLOB_SAS configured or backend SAS endpoint.</div>
        <input className="input" type="file" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit">Add Course</button>
      </form>
      <p className="small">{msg}</p>
    </div>
  );
}
