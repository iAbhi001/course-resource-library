import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/password-reset', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong.');
    }
  };

  return (
    <Container fluid className="vh-100 bg-light">
      <Row className="h-100 justify-content-center align-items-center">
        <Col xs={12} md={6} lg={5}>
          <Card className="shadow-sm p-4">
            <h3 className="text-center mb-3">Reset Password</h3>

            {sent && (
              <Alert variant="success">
                A reset link has been sent to your email.
              </Alert>
            )}

            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Send Reset Link
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small>
                Already have a token?{' '}
                <Link to="/password-reset">Enter it here</Link>
              </small>
              <br />
              <small>
                <Link to="/login">Back to Login</Link>
              </small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
