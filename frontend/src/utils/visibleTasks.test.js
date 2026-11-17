import visibleTasks from './visibleTasks';

const tasks = [
  {
    id: 1,
    title: 'Buy milk',
    description: 'from the store',
    completed: false,
    createdAt: '2026-11-10T08:00:00.000Z',
    priority: 'medium'
  },
  {
    id: 2,
    title: 'Write report',
    description: '',
    completed: true,
    createdAt: '2026-11-12T08:00:00.000Z',
    priority: 'high'
  },
  {
    id: 3,
    title: 'Call mom',
    description: 'after work',
    completed: false,
    createdAt: '2026-11-11T08:00:00.000Z',
    priority: 'low'
  }
];

test('pending filter hides completed tasks', function () {
  const out = visibleTasks(tasks, 'pending', '', 'newest');
  expect(out.map(function (t) { return t.id; })).toEqual([3, 1]);
});

test('search matches title or description', function () {
  const out = visibleTasks(tasks, 'all', 'store', 'newest');
  expect(out).toHaveLength(1);
  expect(out[0].id).toBe(1);
});

test('priority sort puts high first', function () {
  const out = visibleTasks(tasks, 'all', '', 'priority');
  expect(out.map(function (t) { return t.priority; })).toEqual(['high', 'medium', 'low']);
});

test('title sort is alphabetical', function () {
  const out = visibleTasks(tasks, 'all', '', 'title');
  expect(out.map(function (t) { return t.title; })).toEqual(['Buy milk', 'Call mom', 'Write report']);
});
