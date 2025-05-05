// frontend/src/components/dashboard/TeacherDashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate }            from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Card,
  Button,
  Table,
  Spinner,
  Modal,
  Alert,
  Form
} from 'react-bootstrap';
import api from '../../services/api';

export default function TeacherDashboard() {
  // dashboard state
  const [courses,       setCourses]       = useState([]);
  const [submissions,   setSubmissions]   = useState([]);
  const [allStudents,   setAllStudents]   = useState([]);
  const [loading,       setLoading]       = useState(true);

  // create‐course form
  const [newTitle,       setNewTitle]       = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStudents,    setNewStudents]    = useState([]);
  const [formError,      setFormError]      = useState('');

  // manage‐students modal
  const [showManageModal,    setShowManageModal]    = useState(false);
  const [activeCourse,       setActiveCourse]       = useState(null);
  const [selectedStudents,   setSelectedStudents]   = useState([]);
  const [manageError,        setManageError]        = useState('');

  // REVIEW feedback modal
  const [showReviewModal,   setShowReviewModal]   = useState(false);
  const [activeSubmission,  setActiveSubmission]  = useState(null);
  const [reviewComments,    setReviewComments]    = useState('');
  const [reviewGrade,       setReviewGrade]       = useState('');
  const [reviewError,       setReviewError]       = useState('');

  const navigate = useNavigate();

  // fetch everything once
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [crsRes, subRes, stuRes] = await Promise.all([
        api.get('/courses'),
        api.get('/submissions'),
        api.get('/users?role=student')
      ]);
      setCourses(crsRes.data);
      setSubmissions(subRes.data);
      setAllStudents(stuRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  // create new course
  const handleCreateCourse = async e => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('A title is required.');
      return;
    }
    try {
      const payload = {
        title:       newTitle,
        description: newDescription,
        students:    newStudents
      };
      const { data: course } = await api.post('/courses', payload);
      setCourses(cs => [course, ...cs]);
      // reset form
      setNewTitle('');
      setNewDescription('');
      setNewStudents([]);
      setFormError('');
    } catch (err) {
      setFormError(err.response?.data?.msg || 'Failed to create course');
    }
  };

  // open manage‐students modal
  const openManage = course => {
    setActiveCourse(course);
    setSelectedStudents(course.students.map(s => s._id));
    setManageError('');
    setShowManageModal(true);
  };

  // save changes to enrolled students
  const saveManage = async () => {
    try {
      await api.put(`/courses/${activeCourse._id}/students`, {
        studentIds: selectedStudents
      });
      setCourses(cs =>
        cs.map(c =>
          c._id === activeCourse._id
            ? {
                ...c,
                students: allStudents.filter(u =>
                  selectedStudents.includes(u._id)
                )
              }
            : c
        )
      );
      setShowManageModal(false);
    } catch (err) {
      setManageError(err.response?.data?.msg || 'Failed to save student changes');
    }
  };

  // open the “Review Feedback” modal
  const openReview = sub => {
    setActiveSubmission(sub);
    setReviewComments(sub.comments || '');
    setReviewGrade(sub.grade != null ? sub.grade : '');
    setReviewError('');
    setShowReviewModal(true);
  };

  // save feedback
  const saveReview = async () => {
    try {
      const payload = {
        comments: reviewComments,
        grade:    Number(reviewGrade)
      };
      const { data: updated } = await api.put(
        `/submissions/${activeSubmission._id}`,
        payload
      );
      // update in place
      setSubmissions(s =>
        s.map(x => (x._id === updated._id ? updated : x))
      );
      setShowReviewModal(false);
    } catch (err) {
      setReviewError(err.response?.data?.msg || 'Failed to save feedback');
    }
  };

  if (loading) {
    return (
      <Container className="vh-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>
      {/* NAVBAR */}
      <Navbar bg="dark" variant="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard/teacher">
            LMS Portal
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="my-5">
        <Row className="gx-4 gy-5">
          {/* LEFT: Create Course */}
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">New Course</h5>
              </Card.Header>
              <Card.Body>
                {formError && <Alert variant="danger">{formError}</Alert>}
                <Form onSubmit={handleCreateCourse}>
                  <Form.Group className="mb-3" controlId="courseTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Course Title"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="courseDesc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Course Description"
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="courseStudents">
                    <Form.Label>Enroll Students</Form.Label>
                    <Form.Control
                      as="select"
                      multiple
                      value={newStudents}
                      onChange={e =>
                        setNewStudents(
                          Array.from(e.target.selectedOptions).map(o => o.value)
                        )
                      }
                      style={{ minHeight: '6rem' }}
                    >
                      {allStudents.map(u => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Button type="submit" className="w-100">
                    Create Course
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT: Recent Submissions */}
          <Col lg={8}>
            <h5 className="mb-3">Recent Submissions</h5>
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-0">
                {submissions.length ? (
                  <Table hover responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Student</th>
                        <th>Assignment</th>
                        <th>Download</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map(s => (
                        <tr key={s._id}>
                          <td>{s.student.name}</td>
                          <td>{s.assignment.title}</td>
                          <td>
                            <Button
                              as="a"
                              href={process.env.REACT_APP_API_URL + s.fileUrl}
                              download
                              variant="outline-primary"
                              size="sm"
                            >
                              Download
                            </Button>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant={s.grade != null ? 'success' : 'outline-secondary'}
                              onClick={() => openReview(s)}
                            >
                              {s.grade != null ? 'Edit Feedback' : 'Add Feedback'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="p-4 text-center text-muted">
                    No submissions yet.
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* My Courses Tiles */}
        <h5 className="mb-4">My Courses</h5>
        <Row xs={1} md={2} className="gx-4 gy-4">
          {courses.length ? (
            courses.map(c => (
              <Col key={c._id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title as="h6">{c.title}</Card.Title>
                    <Card.Text className="flex-grow-1 text-truncate text-muted">
                      {c.description || '—'}
                    </Card.Text>

                    <div className="mt-3 d-flex justify-content-between">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => openManage(c)}
                      >
                        Manage Students
                      </Button>
                      <Button
                        as={Link}
                        to={`/courses/${c._id}`}
                        size="sm"
                        variant="outline-primary"
                      >
                        Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-muted">No courses yet.</p>
            </Col>
          )}
        </Row>
      </Container>

      {/* Manage Students Modal */}
      <Modal show={showManageModal} onHide={() => setShowManageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Manage Students for «{activeCourse?.title}»</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {manageError && <Alert variant="danger">{manageError}</Alert>}
          <Form.Group controlId="manageStudentsSelect">
            <Form.Label>Select Students to Enroll</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={selectedStudents}
              onChange={e =>
                setSelectedStudents(
                  Array.from(e.target.selectedOptions).map(o => o.value)
                )
              }
              style={{ minHeight: '8rem' }}
            >
              {allStudents.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowManageModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveManage}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Review Feedback Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Feedback for «{activeSubmission?.assignment.title}»
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewError && <Alert variant="danger">{reviewError}</Alert>}
          <Form.Group className="mb-3" controlId="reviewComments">
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reviewComments}
              onChange={e => setReviewComments(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="reviewGrade">
            <Form.Label>Grade</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="100"
              value={reviewGrade}
              onChange={e => setReviewGrade(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveReview}>
            Save Feedback
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
