import React, { useState } from 'react';
import api from '../../services/api';

export default function AnnouncementForm({ courseId }) {
  const [title, setTitle]   = useState('');
  const [content, setContent] = useState('');

  const send = async e => {
    e.preventDefault();
    await api.post('/announcements', { title, content, course: courseId || null });
    alert('Posted');
  };

  return (
    <form onSubmit={send}>
      <input value={title}    onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" required />
      <button type="submit">Post</button>
    </form>
  );
}
