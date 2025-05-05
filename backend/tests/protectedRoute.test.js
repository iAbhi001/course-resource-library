// tests/protectedRoute.test.js
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

let token;

beforeAll(async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Protected User',
    email: 'secure@example.com',
    password: 'securepass123',
    role: 'student'
  });
  token = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
});

describe('Protected Routes', () => {
  it('should deny access to /api/courses without token', async () => {
    const res = await request(app).get('/api/courses');
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should allow access to /api/courses with valid token', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
