// frontend/src/components/courses/CourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link }            from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Breadcrumb,
  Card,
  ListGroup,
  Form,
  Button
} from 'react-bootstrap';
import api from '../../services/api';
import MaterialEmail from '../materials/MaterialEmail';

export default function CourseDetail() {
  const { id: courseId } = useParams();

  // Core data
  const [course, setCourse]           = useState({});
  const [students, setStudents]       = useState([]);
  const [materials, setMaterials]     = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [anns, setAnns]               = useState([]);

  // Form state
  const [materialFile, setMaterialFile]   = useState(null);
  const [newTitle, setNewTitle]           = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [newDueDate, setNewDueDate]       = useState('');
  const [annTitle, setAnnTitle]           = useState('');
  const [annContent, setAnnContent]       = useState('');

  useEffect(() => {
    async function load() {
      const [
        { data: c },
        { data: mats },
        { data: asns },
        { data: a }
      ] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/materials/${courseId}`),
        api.get(`/assignments/${courseId}`),
        api.get(`/announcements?course=${courseId}`)
      ]);
      setCourse(c);
      setStudents(c.students || []);
      setMaterials(mats);
      setAssignments(asns);
      setAnns(a);
    }
    load().catch(console.error);
  }, [courseId]);

  const uploadMaterial = async e => {
    e.preventDefault();
    if (!materialFile) return alert('Pick a file first');
    const fd = new FormData();
    fd.append('file', materialFile);
    await api.post(`/materials/${courseId}`, fd);
    const { data } = await api.get(`/materials/${courseId}`);
    setMaterials(data);
    setMaterialFile(null);
  };

  const handleCreateAssignment = async e => {
    e.preventDefault();
    if (!newTitle.trim()) return alert('Assignment title is required');
    const payload = { title: newTitle, instructions: newInstructions, dueDate: newDueDate };
    const { data } = await api.post(`/assignments/${courseId}`, payload);
    setAssignments(prev => [...prev, data]);
    setNewTitle(''); setNewInstructions(''); setNewDueDate('');
  };

  const postAnnouncement = async e => {
    e.preventDefault();
    await api.post('/announcements', { title: annTitle, content: annContent, course: courseId });
    const { data } = await api.get(`/announcements?course=${courseId}`);
    setAnns(data);
    setAnnTitle(''); setAnnContent('');
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard/teacher">LMS Portal</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard/teacher">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/courses">All Courses</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="my-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/dashboard/teacher' }}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{course.title}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Course Header */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>{course.title}</Card.Title>
            <Card.Text>{course.description}</Card.Text>
          </Card.Body>
        </Card>

        <Row>
          {/* LEFT COLUMN */}
          <Col md={4}>
            {/* Students */}
            <Card className="mb-4">
              <Card.Header>Students</Card.Header>
              <ListGroup variant="flush">
                {students.length > 0 ? students.map(s =>
                  <ListGroup.Item key={s._id}>
                    {s.name} <span className="text-muted">({s.email})</span>
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item className="text-muted">No students enrolled.</ListGroup.Item>
                )}
              </ListGroup>
            </Card>

            {/* Upload Material */}
            <Card className="mb-4">
              <Card.Header>Upload Material</Card.Header>
              <Card.Body>
                <Form onSubmit={uploadMaterial}>
                  <Form.Group controlId="uploadMaterial" className="mb-3">
                    <Form.Control
                      type="file"
                      onChange={e=>setMaterialFile(e.target.files[0])}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">Upload</Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Email Materials */}
            <Card className="mb-4">
              <Card.Header>Email Materials</Card.Header>
              <Card.Body>
                <MaterialEmail courseId={courseId} students={students} />
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT COLUMN */}
          <Col md={8}>
            {/* Create Assignment */}
            <Card className="mb-4">
              <Card.Header>Create Assignment</Card.Header>
              <Card.Body>
                <Form onSubmit={handleCreateAssignment}>
                  <Form.Group controlId="assignmentTitle" className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={newTitle}
                      onChange={e=>setNewTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="assignmentInstructions" className="mb-3">
                    <Form.Label>Instructions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={newInstructions}
                      onChange={e=>setNewInstructions(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="assignmentDueDate" className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={newDueDate}
                      onChange={e=>setNewDueDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="success" type="submit">Create</Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Existing Assignments */}
            <Card className="mb-4">
              <Card.Header>Assignments</Card.Header>
              <ListGroup variant="flush">
                {assignments.length > 0 ? assignments.map(a =>
                  <ListGroup.Item key={a._id}>
                    <strong>{a.title}</strong> <span className="text-muted">
                      (due {new Date(a.dueDate).toLocaleDateString()})
                    </span>
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item className="text-muted">No assignments yet.</ListGroup.Item>
                )}
              </ListGroup>
            </Card>

            {/* Announcements */}
            <Card className="mb-4">
              <Card.Header>Announcements</Card.Header>
              <Card.Body>
                {anns.length > 0 ? anns.map(a =>
                  <Card className="mb-2" key={a._id}>
                    <Card.Header>{a.title}</Card.Header>
                    <Card.Body>{a.content}</Card.Body>
                  </Card>
                ) : (
                  <p className="text-muted">No announcements yet.</p>
                )}
                <Form onSubmit={postAnnouncement} className="mt-3">
                  <Form.Group controlId="annTitle" className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      value={annTitle}
                      onChange={e=>setAnnTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="annContent" className="mb-2">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Content"
                      value={annContent}
                      onChange={e=>setAnnContent(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="secondary" type="submit">Post</Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Materials List */}
            <Card className="mb-4">
              <Card.Header>Materials</Card.Header>
              <ListGroup variant="flush">
                {materials.length > 0 ? materials.map(m =>
                  <ListGroup.Item key={m._id}>
                    <a
                      href={`${process.env.REACT_APP_API_URL}${m.fileUrl}`}
                      download
                    >
                      {m.title}
                    </a>
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item className="text-muted">No materials yet.</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
