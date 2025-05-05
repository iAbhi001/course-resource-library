// frontend/src/components/auth/Register.js
import React, { useState } from 'react';
import { useNavigate }     from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';
import api from '../../services/api';

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('student');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = { name, email, password, role };
      if (role === 'teacher') payload.adminKey = adminKey;
      await api.post('/users/register', payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <Container fluid className="vh-100 bg-light">
      <Row className="h-100">
        {/* Left marketing column (hidden on xs) */}
        <Col md={6} className="d-none d-md-flex align-items-center justify-content-center bg-white">
          <div className="text-center px-4">
            <h1 className="display-5">LMS Portal</h1>
            <p className="lead text-muted">
              Track courses, assignments, and announcements<br/>
              all in one place—whether you’re a Student or Teacher.
            </p>
          </div>
        </Col>

        {/* Right form column */}
        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
          <Card style={{ maxWidth: 400, width: '100%' }} className="shadow-sm my-4">
            <Card.Body>
              <h3 className="mb-4 text-center">Sign Up</h3>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="floatingName"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  <Form.Label htmlFor="floatingName">Name</Form.Label>
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <Form.Control
                    type="email"
                    id="floatingEmail"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <Form.Label htmlFor="floatingEmail">Email address</Form.Label>
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <Form.Control
                    type="password"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <Form.Label htmlFor="floatingPassword">Password</Form.Label>
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <Form.Select
                    id="floatingRole"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </Form.Select>
                  <Form.Label htmlFor="floatingRole">Role</Form.Label>
                </Form.Floating>

                {role === 'teacher' && (
                  <Form.Floating className="mb-4">
                    <Form.Control
                      type="password"
                      id="floatingAdminKey"
                      placeholder="Admin Key"
                      value={adminKey}
                      onChange={e => setAdminKey(e.target.value)}
                      required
                    />
                    <Form.Label htmlFor="floatingAdminKey">Admin Key</Form.Label>
                  </Form.Floating>
                )}

                <Button variant="primary" type="submit" className="w-100 py-2">
                  Create Account
                </Button>

                <div className="text-center mt-3">
                  <small>
                    Already have an account?{' '}
                    <a href="/login">Log in</a>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
