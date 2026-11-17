const PRIO = {
  high: 0,
  medium: 1,
  low: 2
};

function matchesSearch(task, q) {
  if (!q) {
    return true;
  }
  const hay = (task.title + ' ' + (task.description || '')).toLowerCase();
  return hay.indexOf(q) !== -1;
}

function visibleTasks(tasks, filter, search, sort) {
  const q = (search || '').trim().toLowerCase();
  const out = [];

  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    if (filter === 'completed' && !t.completed) {
      continue;
    }
    if (filter === 'pending' && t.completed) {
      continue;
    }
    if (!matchesSearch(t, q)) {
      continue;
    }
    out.push(t);
  }

  out.sort(function (a, b) {
    if (sort === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sort === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sort === 'priority') {
      const pa = PRIO[a.priority];
      const pb = PRIO[b.priority];
      return (pa === undefined ? 9 : pa) - (pb === undefined ? 9 : pb);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return out;
}

export default visibleTasks;
