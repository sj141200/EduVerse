import React from 'react';
import VideoUpload from '../components/VideoUpload';
import VideoList from '../components/VideoList';

export default function VideosPage() {
  return (
    <div style={{padding:20}}>
      <h1>EduVerse — Video Lectures</h1>
      <VideoUpload />
      <hr style={{margin:'24px 0'}} />
      <VideoList />
    </div>
  );
}
