import React from 'react';

function TaskFilter({ current, onChange }) {
  return (
    <div className="filters">
      <button
        type="button"
        className={current === 'all' ? 'filter-btn on' : 'filter-btn'}
        onClick={() => onChange('all')}
      >
        All
      </button>
      <button
        type="button"
        className={current === 'pending' ? 'filter-btn on' : 'filter-btn'}
        onClick={() => onChange('pending')}
      >
        Pending
      </button>
      <button
        type="button"
        className={current === 'completed' ? 'filter-btn on' : 'filter-btn'}
        onClick={() => onChange('completed')}
      >
        Completed
      </button>
    </div>
  );
}

export default TaskFilter;
