import React, { useState, useEffect, useRef } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from '../services/api';
import visibleTasks from '../utils/visibleTasks';
import { readStore, writeStore } from '../utils/storage';
import '../styles/App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(function () {
    return readStore('tm-filter', 'all');
  });
  const [search, setSearch] = useState(function () {
    return readStore('tm-search', '');
  });
  const [sort, setSort] = useState(function () {
    return readStore('tm-sort', 'newest');
  });
  const [theme, setTheme] = useState(function () {
    const saved = readStore('tm-theme', 'light');
    document.body.classList.add('theme-' + saved);
    return saved;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const modalRef = useRef(null);

  useEffect(function () {
    fetchTasks();
  }, []);

  useEffect(
    function () {
      writeStore('tm-filter', filter);
    },
    [filter]
  );

  useEffect(
    function () {
      writeStore('tm-search', search);
    },
    [search]
  );

  useEffect(
    function () {
      writeStore('tm-sort', sort);
    },
    [sort]
  );

  useEffect(
    function () {
      writeStore('tm-theme', theme);
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add('theme-' + theme);
    },
    [theme]
  );

  useEffect(
    function () {
      if (!showForm) {
        return;
      }

      const box = modalRef.current;
      if (!box) {
        return;
      }

      const focusable = box.querySelectorAll('input, textarea, select, button');
      if (focusable[0]) {
        focusable[0].focus();
      }

      function onKey(e) {
        if (e.key === 'Escape') {
          closeForm();
          return;
        }

        if (e.key !== 'Tab' || focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }

      document.addEventListener('keydown', onKey);
      return function () {
        document.removeEventListener('keydown', onKey);
      };
    },
    [showForm, editingTask]
  );

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

  const shown = visibleTasks(tasks, filter, search, sort);

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

  function toggleTheme() {
    setTheme(function (current) {
      if (current === 'dark') {
        return 'light';
      }
      return 'dark';
    });
  }

  let pendingCount = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (!tasks[i].completed) {
      pendingCount = pendingCount + 1;
    }
  }

  return (
    <div className={'page theme-' + theme}>
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
          <div className="top-actions">
            <button
              type="button"
              className="btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button className="btn btn-main" type="button" onClick={openNew}>
              + New Task
            </button>
          </div>
        </div>

        <div className="tools">
          <input
            className="search"
            type="search"
            value={search}
            onChange={function (e) {
              setSearch(e.target.value);
            }}
            placeholder="Search tasks"
            aria-label="Search tasks"
          />
          <select
            className="sort"
            value={sort}
            onChange={function (e) {
              setSort(e.target.value);
            }}
            aria-label="Sort tasks"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">Priority</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        {error ? (
          <div className="error-box" role="alert">
            {error}
            <button
              type="button"
              className="error-close"
              onClick={function () {
                setError('');
              }}
              aria-label="Dismiss error"
            >
              x
            </button>
          </div>
        ) : null}

        {showForm ? (
          <div className="overlay" onClick={closeForm}>
            <div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="task-form-title"
              ref={modalRef}
              onClick={function (e) {
                e.stopPropagation();
              }}
            >
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
            tasks={shown}
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
