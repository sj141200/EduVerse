import React, {useState} from 'react'
import { login } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const nav = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    try {
      const data = await login({ email, password })
      // Save token to localStorage (example)
      localStorage.setItem('token', data.token)
      nav('/')
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <div style={{maxWidth:420}}>
      <h2>Sign in</h2>
      <form onSubmit={handle}>
        <div style={{marginBottom:8}}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' style={{width:'100%',padding:8}} />
        </div>
        <div style={{marginBottom:8}}>
          <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' style={{width:'100%',padding:8}} />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}
