
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

const mockDelay = (ms=300) => new Promise(r=>setTimeout(r, ms));

let mockState = {
  users: [{id:1,name:'Test User',email:'test@example.com',password:'pass',role:'student'}],
  courses: [
    {id:1, title:'Intro to Azure', description:'Learn basics of Azure', instructor:'Admin', videoUrl:'', enrollments:[]}
  ],
  enrollments: []
};

export async function register(user){
  if(!API_BASE){
    await mockDelay();
    const id = Date.now();
    mockState.users.push({...user,id});
    return {data: {id, ...user}};
  }
  return axios.post(`${API_BASE}/register`, user);
}

export async function login(credentials){
  if(!API_BASE){
    await mockDelay();
    const user = mockState.users.find(u=>u.email===credentials.email && u.password===credentials.password);
    if(!user) throw new Error('Invalid credentials (mock)');
    // simple token
    return {data: {token: 'mock-token', user}};
  }
  return axios.post(`${API_BASE}/login`, credentials);
}

export async function getCourses(){
  if(!API_BASE){
    await mockDelay();
    return {data: mockState.courses};
  }
  return axios.get(`${API_BASE}/courses`);
}

export async function getCourse(id){
  if(!API_BASE){
    await mockDelay();
    const c = mockState.courses.find(x=>String(x.id)===String(id));
    return {data: c};
  }
  return axios.get(`${API_BASE}/courses/${id}`);
}

export async function addCourse(course){
  if(!API_BASE){
    await mockDelay();
    const id = Date.now();
    const newc = {...course, id, enrollments:[]};
    mockState.courses.push(newc);
    return {data: newc};
  }
  return axios.post(`${API_BASE}/courses`, course);
}

export async function enroll(courseId, userId){
  if(!API_BASE){
    await mockDelay();
    const c = mockState.courses.find(x=>x.id===Number(courseId));
    if(!c) throw new Error('Course not found');
    c.enrollments = c.enrollments || [];
    if(!c.enrollments.includes(userId)) c.enrollments.push(userId);
    return {data: {success:true}};
  }
  return axios.post(`${API_BASE}/courses/${courseId}/enroll`, {userId});
}

// upload using direct SAS URL if provided
export async function uploadToBlob(file, filename){
  const sas = process.env.REACT_APP_BLOB_SAS || '';
  if(!sas) throw new Error('No REACT_APP_BLOB_SAS configured in env');
  const uploadUrl = sas.includes('?') ? `${sas}&sv=...&name=${encodeURIComponent(filename)}` : `${sas}?name=${encodeURIComponent(filename)}`;
  // Many SAS endpoints require PUT with correct headers. This is a helper but your exact backend/SAS will differ.
  const resp = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type || 'application/octet-stream'
    },
    body: file
  });
  if(!resp.ok) throw new Error('Upload failed');
  // Return a URL (note: compose correctly for your SAS/token)
  return {url: uploadUrl.split('?')[0]};
}
