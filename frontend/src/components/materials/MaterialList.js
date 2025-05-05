import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function MaterialList({ courseId }) {
  const [materials, setMaterials] = useState([]);
  useEffect(() => {
    api.get(`/materials/${courseId}`).then(r=>setMaterials(r.data));
  }, [courseId]);
  return (
    <ul>
      {materials.map(m =>
        <li key={m._id}>
          <a href={process.env.REACT_APP_API_URL + m.fileUrl} target="_blank" rel="noreferrer">
            {m.title}
          </a>
        </li>
      )}
    </ul>
  );
}
