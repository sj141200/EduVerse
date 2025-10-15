
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import AddCourse from './components/AddCourse';

export default function App(){
  return (
    <div className="app">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/add-course">Add Course</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<h2>Welcome to Azure Learning Platform (Frontend)</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/add-course" element={<AddCourse />} />
        </Routes>
      </main>
    </div>
  );
}
