// frontend/src/components/assignments/AssignmentDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link }           from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import api from '../../services/api';

export default function AssignmentDetail() {
  const { id: assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    api.get(`/assignments/${assignmentId}/details`)
      .then(res => {
        setAssignment(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load assignment details');
        setLoading(false);
      });
  }, [assignmentId]);

  if (loading) {
    return (
      <Container className="vh-75 d-flex align-items-center justify-content-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="pt-5">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/dashboard/student" variant="outline-primary">
          ← Back to Dashboard
        </Button>
      </Container>
    );
  }

  // render the bare‐bones detail view
  return (
    <Container style={{ maxWidth: 700 }} className="py-4">
      <Button
        as={Link}
        to="/dashboard/student"
        variant="secondary"
        className="mb-3"
      >
        ← Back to Dashboard
      </Button>

      <h2>{assignment.title}</h2>
      <p className="text-muted">
        Due {new Date(assignment.dueDate).toLocaleDateString()}
      </p>
      {assignment.instructions && (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {assignment.instructions}
        </div>
      )}
    </Container>
  );
}
