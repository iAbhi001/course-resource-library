// src/components/LandingPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function LandingPage() {
  const navigate = useNavigate();
  const go = path => () => navigate(path);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <Container>
        <Row className="align-items-center">
          {/* Brand & headline */}
          <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
            <h1 style={{ fontSize: '3.5rem', fontWeight: 600, color: '#007aff', marginBottom: '1rem' }}>
              LMS Portal
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#333', lineHeight: 1.6, maxWidth: 440 }}>
              All your courses, assignments, and submissions in one place.
              A frictionless, modern experience—whether you’re teaching or learning.
            </p>
          </Col>

          {/* Two big action buttons */}
          <Col lg={4} className="mx-auto">
            <Card
              style={{
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(255,255,255,0.75)',
                borderRadius: 16,
                boxShadow: '0 16px 32px rgba(0,0,0,0.1)'
              }}
            >
              <Card.Body className="text-center" style={{ padding: '2rem' }}>
                <Button
                  variant="primary"
                  onClick={go('/login')}
                  className="w-100 mb-3"
                  style={{ padding: '0.75rem', fontSize: '1.1rem' }}
                >
                  Log In
                </Button>
                <Button
                  variant="success"
                  onClick={go('/register')}
                  className="w-100"
                  style={{ padding: '0.75rem', fontSize: '1.1rem' }}
                >
                  Create New Account
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
