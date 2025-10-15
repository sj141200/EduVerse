
import React, {useState} from 'react';
import { register } from '../api';

export default function Register(){
  const [name,setName]=useState('New User');
  const [email,setEmail]=useState('new@example.com');
  const [password,setPassword]=useState('pass');
  const [message,setMessage]=useState('');

  const handle = async (e) => {
    e.preventDefault();
    setMessage('Registering...');
    try{
      const resp = await register({name,email,password,role:'student'});
      setMessage('Registered. You may login.');
    }catch(err){
      setMessage('Register failed: ' + (err.message || err));
    }
  };

  return (
    <div className="card">
      <h3>Register</h3>
      <form onSubmit={handle}>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Register</button>
      </form>
      <p className="small">{message}</p>
    </div>
  );
}
