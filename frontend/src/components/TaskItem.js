import React from 'react';

function TaskItem({ task, onEdit, onDelete, onToggle }) {
  const created = new Date(task.createdAt);
  const dateText = created.toLocaleDateString();

  let extra = '';
  if (task.completed) {
    extra = ' done';
  }

  return (
    <div className={'card prio-' + task.priority + extra}>
      <div className="card-top">
        <span className={'badge prio-' + task.priority}>{task.priority}</span>
        <span className="date">{dateText}</span>
      </div>

      <h3 className={task.completed ? 'card-title strike' : 'card-title'}>{task.title}</h3>

      {task.description ? (
        <p className="card-desc">{task.description}</p>
      ) : (
        <p className="card-desc gray">No description</p>
      )}

      <div className="card-btns">
        <button type="button" className="btn small" onClick={() => onToggle(task.id)}>
          {task.completed ? 'Mark pending' : 'Complete'}
        </button>
        <button type="button" className="btn small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="btn small btn-red" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
