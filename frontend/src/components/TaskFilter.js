import React from 'react';

function TaskFilter({ current, onChange }) {
  const options = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <div className="filters" role="group" aria-label="Filter tasks">
      {options.map(function (opt) {
        const on = current === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            className={on ? 'filter-btn on' : 'filter-btn'}
            aria-pressed={on}
            onClick={function () {
              onChange(opt.key);
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default TaskFilter;
