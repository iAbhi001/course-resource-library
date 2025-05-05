import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AssignmentSubmit({ courseId }) {
  const [asns, setAsns] = useState([]);
  const [file, setFile] = useState(null);
  const [sel, setSel]   = useState('');
  useEffect(() => {
    api.get(`/assignments/${courseId}`).then(r=>setAsns(r.data));
  }, [courseId]);

  const submit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('file', file);
    await api.post(`/submissions/${sel}`, fd);
    alert('Submitted');
  };

  return (
    <form onSubmit={submit}>
      <select onChange={e=>setSel(e.target.value)} required>
        <option value="">Select Assignment</option>
        {asns.map(a=> <option key={a._id} value={a._id}>{a.title}</option> )}
      </select>
      <input type="file" onChange={e=>setFile(e.target.files[0])} required />
      <button type="submit">Submit</button>
    </form>
  );
}
