import React, { useState } from 'react';
import axios from 'axios';

export default function VideoUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const onFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please choose a video file');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title);
      formData.append('description', description);
      const res = await axios.post(`${process.env.REACT_APP_VIDEO_SERVICE || 'http://localhost:5005'}/api/videos/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Uploaded: ' + (res.data.url || 'success'));
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{maxWidth:700, margin:'0 auto'}}>
      <h2>Upload Video Lecture</h2>
      <form onSubmit={handleUpload}>
        <div style={{marginBottom:10}}>
          <input type="file" accept="video/*" onChange={onFileChange} />
        </div>
        <div style={{marginBottom:10}}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{width:'100%'}} />
        </div>
        <div style={{marginBottom:10}}>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{width:'100%'}} rows={3} />
        </div>
        <button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
      </form>
    </div>
  );
}
