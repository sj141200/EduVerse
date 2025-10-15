
import React, {useState} from 'react';
import { login } from '../api';

export default function Login(){
  const [email,setEmail]=useState('test@example.com');
  const [password,setPassword]=useState('pass');
  const [message,setMessage]=useState('');

  const handle = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    try{
      const resp = await login({email,password});
      // store token in localStorage for demo
      localStorage.setItem('token', resp.data.token || 'mock-token');
      localStorage.setItem('user', JSON.stringify(resp.data.user || {email}));
      setMessage('Login successful');
    }catch(err){
      setMessage('Login failed: ' + (err.message || err));
    }
  };

  return (
    <div className="card">
      <h3>Login</h3>
      <form onSubmit={handle}>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Login</button>
      </form>
      <p className="small">{message}</p>
    </div>
  );
}
