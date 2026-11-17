import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from '../services/api';
import '../styles/App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Could not load tasks');
    }
    setLoading(false);
  }

  let visible = tasks;
  if (filter === 'completed') {
    visible = tasks.filter(function (t) {
      return t.completed;
    });
  } else if (filter === 'pending') {
    visible = tasks.filter(function (t) {
      return !t.completed;
    });
  }

  async function addTask(formData) {
    try {
      const newTask = await createTask(formData);
      setTasks(function (prev) {
        return prev.concat(newTask);
      });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveTask(formData) {
    try {
      const updated = await updateTask(editingTask.id, formData);
      setTasks(function (prev) {
        const next = [];
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].id === updated.id) {
            next.push(updated);
          } else {
            next.push(prev[i]);
          }
        }
        return next;
      });
      setEditingTask(null);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeTask(id) {
    if (!window.confirm('Delete this task?')) {
      return;
    }

    try {
      await deleteTask(id);
      setTasks(function (prev) {
        const next = [];
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].id !== id) {
            next.push(prev[i]);
          }
        }
        return next;
      });
      if (editingTask && editingTask.id === id) {
        setEditingTask(null);
        setShowForm(false);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleComplete(id) {
    try {
      const updated = await toggleTask(id);
      setTasks(function (prev) {
        const next = [];
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].id === updated.id) {
            next.push(updated);
          } else {
            next.push(prev[i]);
          }
        }
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  }

  function openNew() {
    setEditingTask(null);
    setShowForm(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTask(null);
  }

  let pendingCount = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (!tasks[i].completed) {
      pendingCount = pendingCount + 1;
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-inner">
          <h1>Task Manager</h1>
          <p>
            {loading ? 'Loading...' : pendingCount + ' pending · ' + tasks.length + ' total'}
          </p>
        </div>
      </header>

      <div className="app">
        <div className="top-bar">
          <TaskFilter current={filter} onChange={setFilter} />
          <button className="btn btn-main" type="button" onClick={openNew}>
            + New Task
          </button>
        </div>

        {error ? (
          <div className="error-box">
            {error}
            <button type="button" className="error-close" onClick={() => setError('')}>
              x
            </button>
          </div>
        ) : null}

        {showForm ? (
          <div className="overlay" onClick={closeForm}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? saveTask : addTask}
                onCancel={closeForm}
              />
            </div>
          </div>
        ) : null}

        {loading ? (
          <p className="center-text">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={visible}
            onEdit={openEdit}
            onDelete={removeTask}
            onToggle={toggleComplete}
          />
        )}
      </div>
    </div>
  );
}

export default App;
