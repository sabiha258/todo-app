// app.js - Main Express application

const express = require('express');
const todoService = require('./todoService');

const app = express();
app.use(express.json());

// Serve a simple HTML frontend
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>To-Do App - CI/CD Demo</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        h1 { color: #2c3e50; }
        input { padding: 8px; width: 70%; border: 1px solid #ddd; border-radius: 4px; }
        button { padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #2980b9; }
        li { padding: 8px; margin: 4px 0; background: #f9f9f9; border-radius: 4px; display: flex; justify-content: space-between; }
        .done { text-decoration: line-through; color: #aaa; }
        .badge { background: #27ae60; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>📝 To-Do App <span class="badge">CI/CD Demo</span></h1>
      <div>
        <input type="text" id="taskInput" placeholder="Enter a new task..." />
        <button onclick="addTask()">Add Task</button>
      </div>
      <ul id="taskList"></ul>
      <script>
        async function loadTasks() {
          const res = await fetch('/api/todos');
          const todos = await res.json();
          const list = document.getElementById('taskList');
          list.innerHTML = todos.map(t =>
            '<li><span class="' + (t.completed ? 'done' : '') + '">' + t.title + '</span>' +
            '<div>' +
            '<button onclick="toggleTask(' + t.id + ')">' + (t.completed ? 'Undo' : 'Done') + '</button> ' +
            '<button onclick="deleteTask(' + t.id + ')" style="background:#e74c3c">Delete</button>' +
            '</div></li>'
          ).join('');
        }
        async function addTask() {
          const input = document.getElementById('taskInput');
          if (!input.value.trim()) return;
          await fetch('/api/todos', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title: input.value }) });
          input.value = '';
          loadTasks();
        }
        async function toggleTask(id) {
          const res = await fetch('/api/todos/' + id);
          const todo = await res.json();
          await fetch('/api/todos/' + id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ completed: !todo.completed }) });
          loadTasks();
        }
        async function deleteTask(id) {
          await fetch('/api/todos/' + id, { method: 'DELETE' });
          loadTasks();
        }
        loadTasks();
      </script>
    </body>
    </html>
  `);
});

// API Routes
app.get('/api/todos', (req, res) => res.json(todoService.getAllTodos()));

app.get('/api/todos/:id', (req, res) => {
  const todo = todoService.getTodoById(req.params.id);
  todo ? res.json(todo) : res.status(404).json({ error: 'Todo not found' });
});

app.post('/api/todos', (req, res) => {
  try {
    const todo = todoService.createTodo(req.body.title);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/todos/:id', (req, res) => {
  const todo = todoService.updateTodo(req.params.id, req.body);
  todo ? res.json(todo) : res.status(404).json({ error: 'Todo not found' });
});

app.delete('/api/todos/:id', (req, res) => {
  const deleted = todoService.deleteTodo(req.params.id);
  deleted ? res.json({ message: 'Deleted successfully' }) : res.status(404).json({ error: 'Todo not found' });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`To-Do App running at http://localhost:${PORT}`));
}

module.exports = app;