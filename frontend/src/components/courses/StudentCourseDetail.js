// frontend/src/components/courses/StudentCourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams }                    from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Button
} from 'react-bootstrap';
import api from '../../services/api';

export default function StudentCourseDetail() {
  const { id: courseId } = useParams();

  const [course, setCourse]             = useState({});
  const [materials, setMaterials]       = useState([]);
  const [anns, setAnns]                 = useState([]);
  const [assignments, setAssignments]   = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [file, setFile]                 = useState(null);

  useEffect(() => {
    (async () => {
      // load course, materials, announcements
      const [{ data: c }, { data: mats }, { data: a }] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/materials/${courseId}`),
        api.get(`/announcements?course=${courseId}`)
      ]);
      setCourse(c);
      setMaterials(mats);
      setAnns(a);

      // load assignments
      const { data: asns } = await api.get(`/assignments/${courseId}`);
      setAssignments(asns);
    })();
  }, [courseId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedAssignment) return alert('Please select an assignment');
    if (!file)               return alert('Please choose a file');
    const fd = new FormData();
    fd.append('file', file);
    await api.post(`/submissions/${selectedAssignment}`, fd);
    alert('Your assignment has been submitted!');
    setSelectedAssignment('');
    setFile(null);
  };

  return (
    <Container className="py-4">
      {/* Course title & description */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-2">{course.title}</h2>
          <p className="text-secondary">{course.description}</p>
        </Col>
      </Row>

      {/* Materials & Submission side by side */}
      <Row className="g-4">
        {/* Materials */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5">Materials</Card.Header>
            <ListGroup variant="flush">
              {materials.length > 0 ? materials.map(m => (
                <ListGroup.Item key={m._id}>
                  <a
                    href={`${process.env.REACT_APP_API_URL}/api${m.fileUrl}`}
                    download
                    className="text-decoration-none"
                  >
                    {m.title}
                  </a>
                </ListGroup.Item>
              )) : (
                <ListGroup.Item className="text-muted">
                  No materials yet.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* Submit Assignment */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5">Submit Assignment</Card.Header>
            <Card.Body>
              {assignments.length > 0 ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Assignment</Form.Label>
                    <Form.Select
                      value={selectedAssignment}
                      onChange={e => setSelectedAssignment(e.target.value)}
                      required
                    >
                      <option value="">— Choose an assignment —</option>
                      {assignments.map(a => (
                        <option key={a._id} value={a._id}>
                          {a.title} (due {new Date(a.dueDate).toLocaleDateString()})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Upload Your File</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={e => setFile(e.target.files[0])}
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100">
                    Upload &amp; Submit
                  </Button>
                </Form>
              ) : (
                <p className="text-muted mb-0">
                  No assignments have been created yet.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Announcements */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h5">Announcements</Card.Header>
            <ListGroup variant="flush">
              {anns.length > 0 ? anns.map(a => (
                <ListGroup.Item key={a._id}>
                  <strong>{a.title}</strong>
                  <div>{a.content}</div>
                </ListGroup.Item>
              )) : (
                <ListGroup.Item className="text-muted">
                  No announcements.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
