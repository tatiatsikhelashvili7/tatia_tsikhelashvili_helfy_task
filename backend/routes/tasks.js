const express = require('express');
const router = express.Router();
const { validateCreate, validateUpdate } = require('../middleware/validateTask');

function parseId(raw) {
  // 1.5 / abc -> invalid, not 404
  if (typeof raw !== 'string' || !/^[0-9]+$/.test(raw)) {
    return null;
  }
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

function seedTasks() {
  return [
    {
      id: 1,
      title: 'Buy groceries',
      description: 'Milk, bread, eggs',
      completed: false,
      createdAt: new Date('2026-11-10T08:15:00.000Z'),
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Finish weekly report',
      description: 'Send it to the team before Friday',
      completed: false,
      createdAt: new Date('2026-11-12T14:00:00.000Z'),
      priority: 'high'
    },
    {
      id: 3,
      title: 'Call the dentist',
      description: 'Need to book a checkup',
      completed: true,
      createdAt: new Date('2026-11-14T09:45:00.000Z'),
      priority: 'low'
    },
    {
      id: 4,
      title: 'Review pull requests',
      description: '',
      completed: false,
      createdAt: new Date('2026-11-16T18:20:00.000Z'),
      priority: 'high'
    }
  ];
}

let tasks = seedTasks();
let nextId = 5;

function findIndexById(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      return i;
    }
  }
  return -1;
}

function resetTasks() {
  tasks = seedTasks();
  nextId = 5;
}

router.get('/', function (req, res) {
  res.json(tasks);
});

router.post('/', validateCreate, function (req, res) {
  let desc = '';
  if (typeof req.body.description === 'string') {
    desc = req.body.description.trim();
  }

  let prio = 'medium';
  if (req.body.priority) {
    prio = req.body.priority;
  }

  const task = {
    id: nextId,
    title: req.body.title.trim(),
    description: desc,
    completed: false,
    createdAt: new Date(),
    priority: prio
  };

  nextId = nextId + 1;
  tasks.push(task);
  res.status(201).json(task);
});

router.put('/:id', validateUpdate, function (req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  const index = findIndexById(id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const current = tasks[index];

  if (req.body.title !== undefined) {
    current.title = req.body.title.trim();
  }
  if (req.body.description !== undefined) {
    current.description = req.body.description.trim();
  }
  if (req.body.priority !== undefined) {
    current.priority = req.body.priority;
  }
  if (req.body.completed !== undefined) {
    current.completed = req.body.completed;
  }

  tasks[index] = current;
  res.json(current);
});

router.delete('/:id', function (req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  const index = findIndexById(id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const removed = tasks.splice(index, 1)[0];
  res.json({ message: 'Task deleted', task: removed });
});

router.patch('/:id/toggle', function (req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  const index = findIndexById(id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[index].completed = !tasks[index].completed;
  res.json(tasks[index]);
});

router.resetTasks = resetTasks;

module.exports = router;
