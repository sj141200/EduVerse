import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_VIDEO_SERVICE || 'http://localhost:5005'}/api/videos/list`);
        setVideos(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load videos');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading videos…</div>;

  return (
    <div style={{maxWidth:900, margin:'0 auto'}}>
      <h2>Video Lectures</h2>
      {videos.length === 0 && <p>No videos uploaded yet.</p>}
      {videos.map(v => (
        <div key={v._id} style={{border:'1px solid #ddd', padding:12, marginBottom:12}}>
          <h3>{v.filename}</h3>
          {v.url && (
            <video controls width="640" style={{display:'block', marginBottom:8}}>
              <source src={v.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <p>Uploaded: {new Date(v.uploadedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
