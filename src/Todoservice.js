// todoService.js - Business logic for To-Do operations

let todos = [];
let nextId = 1;

const getAllTodos = () => todos;

const getTodoById = (id) => todos.find(t => t.id === parseInt(id));

const createTodo = (title) => {
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }
  const todo = { id: nextId++, title: title.trim(), completed: false };
  todos.push(todo);
  return todo;
};

const updateTodo = (id, updates) => {
  const todo = getTodoById(id);
  if (!todo) return null;
  if (updates.title !== undefined) todo.title = updates.title;
  if (updates.completed !== undefined) todo.completed = updates.completed;
  return todo;
};

const deleteTodo = (id) => {
  const index = todos.findIndex(t => t.id === parseInt(id));
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
};

const resetTodos = () => { todos = []; nextId = 1; };

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo, resetTodos };