// frontend/src/components/materials/MaterialEmail.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function MaterialEmail({ courseId, students }) {
  const [materials, setMaterials]       = useState([]);
  const [selectedMaterial, setSelected] = useState('');
  const [sending, setSending]           = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    api.get(`/materials/${courseId}`)
      .then(res => setMaterials(res.data))
      .catch(err => {
        console.error(err);
        setError('Could not load materials');
      });
  }, [courseId]);

  const handleSend = async () => {
    if (!selectedMaterial) {
      setError('Please pick a material first');
      return;
    }
    setError('');
    setSending(true);
    try {
      const studentIds = students.map(s => s._id);
      await api.post(
        `/materials/${courseId}/${selectedMaterial}/email`,
        { studentIds }
      );
      alert('Emails sent to all enrolled students!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Failed to send emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <label>
        <strong>Choose material:</strong>{' '}
        <select
          value={selectedMaterial}
          onChange={e => setSelected(e.target.value)}
          style={{ marginRight: 8 }}
        >
          <option value="">— select —</option>
          {materials.map(m => (
            <option key={m._id} value={m._id}>{m.title}</option>
          ))}
        </select>
      </label>
      <button
        onClick={handleSend}
        disabled={sending}
        style={{
          padding: '6px 12px',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: sending ? 'not-allowed' : 'pointer'
        }}
      >
        {sending ? 'Sending...' : 'Send Email'}
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  );
}
