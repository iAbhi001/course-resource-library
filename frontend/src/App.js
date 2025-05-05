// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage            from './components/LandingPage';
import Login                  from './components/auth/Login';
import Register               from './components/auth/Register';
import PasswordResetRequest   from './components/auth/PasswordResetRequest';
import PasswordReset          from './components/auth/PasswordReset';
import StudentDashboard       from './components/dashboard/StudentDashboard';
import TeacherDashboard       from './components/dashboard/TeacherDashboard';
import CourseList             from './components/courses/CourseList';
import CourseDetail           from './components/courses/CourseDetail';
import StudentCourseDetail    from './components/courses/StudentCourseDetail';
import AssignmentDetail       from './components/assignments/AssignmentDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1) Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* 2) Auth flows */}
        <Route path="/login"                  element={<Login />} />
        <Route path="/register"               element={<Register />} />
        <Route path="/password-reset-request" element={<PasswordResetRequest />} />
        <Route path="/password-reset"         element={<PasswordReset />} />

        {/* 3) Student routes */}
        <Route path="/dashboard/student"   element={<StudentDashboard />} />
        <Route path="/courses/student/:id" element={<StudentCourseDetail />} />
        <Route path="/assignments/:id"     element={<AssignmentDetail />} />

        {/* 4) Teacher routes */}
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="/courses/:id"       element={<CourseDetail />} />

        {/* 5) Shared course listing */}
        <Route path="/courses" element={<CourseList />} />

        {/* 6) Fallback → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
