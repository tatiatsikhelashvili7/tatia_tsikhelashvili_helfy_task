import React, { useState, useEffect } from 'react';

function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
    setErr('');
  }, [task]);

  function submit(e) {
    e.preventDefault();
    if (title.trim() === '') {
      setErr('Please enter a title');
      return;
    }
    setErr('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority: priority
    });
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2 id="task-form-title">{task ? 'Edit Task' : 'New Task'}</h2>

      {err ? (
        <p className="form-err" role="alert">
          {err}
        </p>
      ) : null}

      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={120}
      />

      <label htmlFor="task-desc">Description</label>
      <textarea
        id="task-desc"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={3}
        maxLength={500}
      />

      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <div className="form-btns">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-main">
          {task ? 'Save' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
