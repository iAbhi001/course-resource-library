// Login.js (With Forgot Password)
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate(data.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 bg-light">
      <Row className="h-100">
        <Col md={6} className="d-none d-md-flex align-items-center justify-content-center bg-white">
          <div className="text-center px-4">
            <h1 className="display-5">Welcome Back</h1>
            <p className="lead text-muted">
              Sign in to access your courses, assignments, and announcements.<br />
              Whether you’re a student or teacher, we’ve got you covered!
            </p>
          </div>
        </Col>

        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
          <Card style={{ maxWidth: 400, width: '100%' }} className="shadow-sm my-4">
            <Card.Body>
              <h3 className="mb-4 text-center">Log In</h3>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="email"
                    id="floatingEmail"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Form.Label htmlFor="floatingEmail">Email address</Form.Label>
                </Form.Floating>

                <Form.Floating className="mb-4">
                  <Form.Control
                    type="password"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Form.Label htmlFor="floatingPassword">Password</Form.Label>
                </Form.Floating>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Log In'}
                </Button>

                <div className="text-center mt-3">
                  <small>
                    Don’t have an account?{' '}
                    <Link to="/register">Sign up</Link>
                  </small><br />
                  <small>
                    <Link to="/password-reset-request">Forgot password?</Link>
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

