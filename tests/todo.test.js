// todo.test.js - Automated tests for the To-Do API

const request = require('supertest');
const app = require('../src/app');
const { resetTodos } = require('../src/todoService');

beforeEach(() => resetTodos());

describe('GET /api/todos', () => {
  test('should return empty array initially', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/todos', () => {
  test('should create a new todo', async () => {
    const res = await request(app).post('/api/todos').send({ title: 'Buy groceries' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Buy groceries');
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBeDefined();
  });

  test('should reject empty title', async () => {
    const res = await request(app).post('/api/todos').send({ title: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  test('should reject missing title', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /api/todos/:id', () => {
  test('should mark todo as completed', async () => {
    const create = await request(app).post('/api/todos').send({ title: 'Study DevOps' });
    const id = create.body.id;
    const res = await request(app).put(`/api/todos/${id}`).send({ completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test('should return 404 for non-existing todo', async () => {
    const res = await request(app).put('/api/todos/999').send({ completed: true });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/todos/:id', () => {
  test('should delete a todo', async () => {
    const create = await request(app).post('/api/todos').send({ title: 'Delete me' });
    const id = create.body.id;
    const res = await request(app).delete(`/api/todos/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Deleted successfully');
  });

  test('should return 404 for non-existing todo', async () => {
    const res = await request(app).delete('/api/todos/999');
    expect(res.statusCode).toBe(404);
  });
});
