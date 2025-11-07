import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import CreateClass from './pages/CreateClassroom'; // <-- updated path
// ...existing code...
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Classes from './pages/Classes'
import Assignments from './pages/Assignments'
import Discussions from './pages/Discussions'

export default function App(){
  return (
    <div>
      <nav style={{padding:'12px',borderBottom:'1px solid #ddd'}}>
        <Link to='/' style={{marginRight:12}}>Home</Link>
        <Link to='/classes' style={{marginRight:12}}>Classes</Link>
        <Link to='/assignments' style={{marginRight:12}}>Assignments</Link>
        <Link to='/discussions' style={{marginRight:12}}>Discussions</Link>
      </nav>
      <div style={{padding:20}}>
        <Routes>
          <Route path="/create-class" element={<CreateClass />} />
          <Route path='/' element={<Dashboard/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/classes' element={<Classes/>} />
          <Route path='/assignments' element={<Assignments/>} />
          <Route path='/discussions' element={<Discussions/>} />
        </Routes>
      </div>
    </div>
  )
}
