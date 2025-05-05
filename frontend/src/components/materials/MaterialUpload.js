import React, { useState } from 'react';
import api from '../../services/api';

export default function MaterialUpload({ courseId }) {
  const [file, setFile] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData(); fd.append('file', file);
    await api.post(`/materials/${courseId}`, fd);
    alert('Uploaded');
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={e=>setFile(e.target.files[0])} required />
      <button type="submit">Upload Material</button>
    </form>
  );
}
