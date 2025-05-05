import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AssignmentList({ courseId }) {
  const [asns, setAsns] = useState([]);
  useEffect(() => {
    api.get(`/assignments/${courseId}`).then(r=>setAsns(r.data));
  }, [courseId]);
  return (
    <ul>
      {asns.map(a =>
        <li key={a._id}>{a.title} (Due: {new Date(a.dueDate).toLocaleDateString()})</li>
      )}
    </ul>
  );
}
