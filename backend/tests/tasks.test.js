const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');
const taskRoutes = require('../routes/tasks');

test('GET /api/tasks returns the seed list', async function () {
  taskRoutes.resetTasks();
  const res = await request(app).get('/api/tasks');
  assert.equal(res.status, 200);
  assert.equal(res.body.length, 4);
  assert.equal(typeof res.body[0].createdAt, 'string');
  assert.notEqual(res.body[0].createdAt, res.body[1].createdAt);
});

test('POST /api/tasks creates a task', async function () {
  taskRoutes.resetTasks();
  const res = await request(app)
    .post('/api/tasks')
    .send({ title: 'Walk the dog', description: 'evening', priority: 'low' });
  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'Walk the dog');
  assert.equal(res.body.completed, false);
  assert.equal(res.body.priority, 'low');
});

test('POST /api/tasks rejects a missing title', async function () {
  const res = await request(app).post('/api/tasks').send({ title: '' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'Title is required');
});

test('POST /api/tasks rejects a non-string description', async function () {
  const res = await request(app)
    .post('/api/tasks')
    .send({ title: 'Nope', description: null });
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'Description must be a string');
});

test('PUT /api/tasks/:id updates a task', async function () {
  taskRoutes.resetTasks();
  const res = await request(app)
    .put('/api/tasks/1')
    .send({ title: 'Buy groceries tonight', priority: 'high' });
  assert.equal(res.status, 200);
  assert.equal(res.body.title, 'Buy groceries tonight');
  assert.equal(res.body.priority, 'high');
});

test('PUT /api/tasks/:id rejects description null', async function () {
  taskRoutes.resetTasks();
  const res = await request(app).put('/api/tasks/1').send({ description: null });
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'Description must be a string');
});

test('PUT /api/tasks/1.5 is an invalid id', async function () {
  const res = await request(app).put('/api/tasks/1.5').send({ title: 'x' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'Invalid task id');
});

test('PATCH /api/tasks/:id/toggle flips completed', async function () {
  taskRoutes.resetTasks();
  const res = await request(app).patch('/api/tasks/3/toggle');
  assert.equal(res.status, 200);
  assert.equal(res.body.completed, false);
});

test('DELETE /api/tasks/:id removes a task', async function () {
  taskRoutes.resetTasks();
  const res = await request(app).delete('/api/tasks/2');
  assert.equal(res.status, 200);
  assert.equal(res.body.message, 'Task deleted');
  const list = await request(app).get('/api/tasks');
  assert.equal(list.body.length, 3);
});

test('unknown routes return 404', async function () {
  const res = await request(app).get('/nope');
  assert.equal(res.status, 404);
  assert.equal(res.body.error, 'Route not found');
});
