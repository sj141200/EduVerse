import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Example wrapper functions
export async function login(credentials){
  const res = await api.post('/auth/login', credentials);
  return res.data;
}

export async function getClasses(){
  const res = await api.get('/classes');
  return res.data;
}

export async function getAssignments(classId){
  const res = await api.get(`/classes/${classId}/assignments`);
  return res.data;
}

export default api;
