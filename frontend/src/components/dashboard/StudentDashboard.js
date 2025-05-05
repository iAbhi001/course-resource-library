// StudentDashboard.js (With Pagination)
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Card,
  Button,
  ListGroup,
  Spinner,
  Form,
  Pagination
} from 'react-bootstrap';
import api from '../../services/api';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [subsMap, setSubsMap] = useState({});
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [coursePage, setCoursePage] = useState(1);
  const [assignPage, setAssignPage] = useState(1);
  const [annPage, setAnnPage] = useState(1);

  const itemsPerPage = 3;

  const navigate = useNavigate();

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [crsRes, annRes] = await Promise.all([
        api.get('/courses'),
        api.get('/announcements')
      ]);
      setCourses(crsRes.data);
      setAnns(annRes.data);

      const asnsRes = await Promise.all(
        crsRes.data.map(c => api.get(`/assignments/${c._id}`))
      );
      const allAsns = asnsRes
        .flatMap(r => r.data)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setAssignments(allAsns);

      const map = {};
      await Promise.all(
        allAsns.map(async a => {
          const { data: subs } = await api.get(`/submissions/assignment/${a._id}`);
          if (subs.length) map[a._id] = subs[0];
        })
      );
      setSubsMap(map);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    window.addEventListener('focus', fetchAllData);
    return () => window.removeEventListener('focus', fetchAllData);
  }, [fetchAllData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <Container className="vh-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  const paginate = (data, page) => data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const paginatedCourses = paginate(courses, coursePage);
  const paginatedAssignments = paginate(assignments, assignPage);
  const paginatedAnns = paginate(anns, annPage);

  const upcoming = assignments.filter(a => {
    const now = new Date(),
      due = new Date(a.dueDate);
    return (due - now) / (1000 * 60 * 60 * 24) <= 7 && due >= now;
  });

  const renderPagination = (totalItems, currentPage, onPageChange) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <Pagination className="mt-2 justify-content-center">
        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
            onClick={() => onPageChange(idx + 1)}>
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
    );
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard/student">LMS Portal</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="mt-4">
        <Row className="g-4">
          <Col lg={4}>
            <Card className="shadow-sm h-100">
              <Card.Header>My Courses</Card.Header>
              <ListGroup variant="flush">
                {paginatedCourses.length ? paginatedCourses.map(c => (
                  <ListGroup.Item key={c._id} className="d-flex justify-content-between">
                    {c.title}
                    <Button as={Link} to={`/courses/student/${c._id}`} size="sm">View</Button>
                  </ListGroup.Item>
                )) : <ListGroup.Item className="text-muted">No courses enrolled.</ListGroup.Item>}
              </ListGroup>
              {renderPagination(courses.length, coursePage, setCoursePage)}
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm h-100">
              <Card.Header>Assignments</Card.Header>
              <ListGroup variant="flush">
                {paginatedAssignments.length ? paginatedAssignments.map(a => {
                  const sub = subsMap[a._id];
                  return (
                    <ListGroup.Item key={a._id} className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">{a.title}</div>
                        <small className="text-muted">Due {new Date(a.dueDate).toLocaleDateString()}</small>
                        {sub?.grade != null && <div className="mt-1 text-success">Grade: {sub.grade}/100</div>}
                        {sub?.comments && <div className="mt-1 text-wrap" style={{ maxWidth: 200 }}><em>Feedback: {sub.comments}</em></div>}
                      </div>
                      <Button as={Link} to={`/assignments/${a._id}`} size="sm">View</Button>
                    </ListGroup.Item>
                  );
                }) : <ListGroup.Item className="text-muted">No assignments available.</ListGroup.Item>}
              </ListGroup>
              {renderPagination(assignments.length, assignPage, setAssignPage)}
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm h-100">
              <Card.Header>Announcements</Card.Header>
              <ListGroup variant="flush">
                {paginatedAnns.length ? paginatedAnns.map(a => (
                  <ListGroup.Item key={a._id}>
                    <strong>{a.title}</strong><br />
                    <small>{a.content}</small>
                  </ListGroup.Item>
                )) : <ListGroup.Item className="text-muted">No announcements.</ListGroup.Item>}
              </ListGroup>
              {renderPagination(anns.length, annPage, setAnnPage)}
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mt-3">
          <Col lg={6}>
            <Card className="shadow-sm h-100">
              <Card.Header>To‑Do / Action Items</Card.Header>
              <ListGroup variant="flush">
                {upcoming.length ? upcoming.map(a => (
                  <ListGroup.Item key={a._id}>
                    <Form.Check
                      type="checkbox"
                      label={`${a.title} (due ${new Date(a.dueDate).toLocaleDateString()})`}
                    />
                  </ListGroup.Item>
                )) : <ListGroup.Item className="text-muted">No items due in the next week.</ListGroup.Item>}
              </ListGroup>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="shadow-sm h-100">
              <Card.Header>Quick Links</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item action href="https://library.pfw.edu" target="_blank">
                  PFW Library &amp; e‑Textbooks
                </ListGroup.Item>
                <ListGroup.Item action href="mailto:mscs@pfw.edu">
                  Office Hours / Email MSCS Dept.
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}