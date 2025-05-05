import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function PasswordReset() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/password-reset/confirm', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong.');
    }
  };

  return (
    <Container fluid className="vh-100 bg-light">
      <Row className="h-100 justify-content-center align-items-center">
        <Col xs={12} md={6} lg={5}>
          <Card className="shadow-sm p-4">
            <h3 className="text-center mb-4">Reset Your Password</h3>

            {success && <Alert variant="success">Password reset successful! Redirecting to login...</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formToken" className="mb-3">
                <Form.Label>Reset Token</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the token from your email"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-4">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter a new password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Reset Password
              </Button>

              <div className="text-center mt-3">
                <small>
                  <a href="/login">Back to Login</a>
                </small>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
