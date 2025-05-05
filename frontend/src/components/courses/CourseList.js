import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  useEffect(() => { api.get('/courses').then(r=>setCourses(r.data)); }, []);
  return (
    <div>
      <h2>All Courses</h2>
      <ul>{courses.map(c =>
        <li key={c._id}><Link to={`/courses/${c._id}`}>{c.title}</Link></li>
      )}</ul>
    </div>
  );
}
