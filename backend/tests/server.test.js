// tests/server.test.js
const request = require('supertest');
const app = require('../server');

describe('Basic Server Tests', () => {
  it('should return 404 on undefined route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(404);
  });
});
