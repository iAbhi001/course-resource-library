import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function SubmissionReview({ assignmentId }) {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    api.get(`/submissions/${assignmentId}`).then(r=>setSubs(r.data));
  }, [assignmentId]);

  const review = async (id, comments, grade) => {
    await api.put(`/submissions/${id}`, { comments, grade });
    alert('Reviewed');
  };

  return (
    <ul>
      {subs.map(s => (
        <li key={s._id}>
          <a href={process.env.REACT_APP_API_URL + s.fileUrl} target="_blank" rel="noreferrer">File</a>
          <input placeholder="Comments" onBlur={e=>s.comments=e.target.value} />
          <input type="number" placeholder="Grade" onBlur={e=>s.grade=e.target.value} />
          <button onClick={()=>review(s._id, s.comments, s.grade)}>Save</button>
        </li>
      ))}
    </ul>
  );
}
