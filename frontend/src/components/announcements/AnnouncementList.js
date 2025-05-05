import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AnnouncementList({ courseId }) {
  const [anns, setAnns] = useState([]);

  useEffect(() => {
    const url = courseId ? `/announcements?course=${courseId}` : '/announcements';
    api.get(url).then(r=>setAnns(courseId
      ? r.data.filter(a=>a.course===courseId)
      : r.data
    ));
  }, [courseId]);

  return (
    <ul>
      {anns.map(a=> <li key={a._id}>{a.title}: {a.content}</li> )}
    </ul>
  );
}
