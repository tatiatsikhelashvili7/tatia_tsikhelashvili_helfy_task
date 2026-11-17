const express = require('express');
const router = express.Router();
const { validateCreate, validateUpdate } = require('../middleware/validateTask');

let tasks = [
  {
    id: 1,
    title: 'Buy groceries',
    description: 'Milk, bread, eggs',
    completed: false,
    createdAt: new Date(),
    priority: 'medium'
  },
  {
    id: 2,
    title: 'Finish weekly report',
    description: 'Send it to the team before Friday',
    completed: false,
    createdAt: new Date(),
    priority: 'high'
  },
  {
    id: 3,
    title: 'Call the dentist',
    description: 'Need to book a checkup',
    completed: true,
    createdAt: new Date(),
    priority: 'low'
  },
  {
    id: 4,
    title: 'Review pull requests',
    description: '',
    completed: false,
    createdAt: new Date(),
    priority: 'high'
  }
];

let nextId = 5;

function findIndexById(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      return i;
    }
  }
  return -1;
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
  const id = Number(req.params.id);
  if (isNaN(id)) {
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
    if (typeof req.body.description === 'string') {
      current.description = req.body.description.trim();
    } else {
      current.description = '';
    }
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
  const id = Number(req.params.id);
  if (isNaN(id)) {
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
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  const index = findIndexById(id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[index].completed = !tasks[index].completed;
  res.json(tasks[index]);
});

module.exports = router;
