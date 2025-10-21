// ...existing code...
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Courses from "./components/Courses";
import AddCourse from "./components/AddCourse";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateClassroom from "./components/CreateClassroom";
import JoinClassroom from "./components/JoinClassroom";
<Route path="/join-classroom" element={<JoinClassroom />} />

// ...existing code...
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/add-course" element={<AddCourse />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-classroom" element={<CreateClassroom />} />
    </Routes>
  );
}

export default App;
// ...existing code...