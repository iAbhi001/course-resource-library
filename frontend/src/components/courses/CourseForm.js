// frontend/src/components/courses/CourseForm.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function CourseForm({ onCreated }) {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [allStudents, setAllStudents] = useState([]);
  const [selected, setSelected]       = useState([]);
  const [error, setError]             = useState('');

  // Load list of students when the form mounts
  useEffect(() => {
    api.get('/users?role=student')
      .then(res => setAllStudents(res.data))
      .catch(err => {
        console.error(err);
        setError('Could not load students');
      });
  }, []);

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim()) {
      return setError('Course title is required');
    }
    if (selected.length === 0) {
      return setError('Please select at least one student');
    }
    try {
      const payload = {
        title,
        description,
        students: selected
      };
      const { data } = await api.post('/courses', payload);
      setTitle('');
      setDescription('');
      setSelected([]);
      setError('');
      onCreated(data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not create course');
    }
  };

  // Toggle a student selection
  const toggleStudent = id => {
    setSelected(sel =>
      sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3 style={{ marginBottom: 12 }}>Create New Course</h3>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <div style={{ marginBottom: 12 }}>
        <label>
          <strong>Title:</strong><br/>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Course Title"
            required
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          <strong>Description:</strong><br/>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Course Description"
            rows={3}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Enroll Students:</strong>
        <div style={{ maxHeight: 150, overflowY: 'auto', border: '1px solid #ccc', padding: 8, borderRadius: 4 }}>
          {allStudents.length > 0 ? allStudents.map(s => (
            <label key={s._id} style={{ display: 'block', marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={selected.includes(s._id)}
                onChange={() => toggleStudent(s._id)}
                style={{ marginRight: 6 }}
              />
              {s.name} &lt;{s.email}&gt;
            </label>
          )) : (
            <div style={{ color: '#888' }}>Loading students…</div>
          )}
        </div>
      </div>

      <button
        type="submit"
        style={{
          padding: '10px 16px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Create Course
      </button>
    </form>
  );
}
