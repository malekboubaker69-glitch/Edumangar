import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginStudent from './pages/LoginStudent';
import RegisterStudent from './pages/RegisterStudent';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Students from './pages/Students';
import Sessions from './pages/Sessions';
import Attendance from './pages/Attendance';
import StudentDashboard from './pages/StudentDashboard';
import CourseContent from './pages/CourseContent';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route - User Type Selection */}
        <Route path="/" element={<Home />} />

        {/* Login Routes - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/student" element={<LoginStudent />} />

        {/* Registration Routes - No Layout */}
        <Route path="/register/student" element={<RegisterStudent />} />

        {/* Student Routes - Dedicated View */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/course/:sessionId" element={<CourseContent />} />

        {/* Protected Routes - With Layout */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/groups" element={<Layout><Groups /></Layout>} />
        <Route path="/students" element={<Layout><Students /></Layout>} />
        <Route path="/sessions" element={<Layout><Sessions /></Layout>} />
        <Route path="/attendance" element={<Layout><Attendance /></Layout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
