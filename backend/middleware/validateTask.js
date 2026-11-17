const PRIORITIES = ['low', 'medium', 'high'];

function validateCreate(req, res, next) {
  const title = req.body.title;
  const description = req.body.description;
  const priority = req.body.priority;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (title.trim().length > 120) {
    return res.status(400).json({ error: 'Title is too long' });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }

  if (typeof description === 'string' && description.length > 500) {
    return res.status(400).json({ error: 'Description is too long' });
  }

  if (priority !== undefined && PRIORITIES.indexOf(priority) === -1) {
    return res.status(400).json({ error: 'Priority must be low, medium or high' });
  }

  next();
}

function validateUpdate(req, res, next) {
  const title = req.body.title;
  const description = req.body.description;
  const priority = req.body.priority;
  const completed = req.body.completed;

  if (
    title === undefined &&
    description === undefined &&
    priority === undefined &&
    completed === undefined
  ) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    if (title.trim().length > 120) {
      return res.status(400).json({ error: 'Title is too long' });
    }
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }

  if (typeof description === 'string' && description.length > 500) {
    return res.status(400).json({ error: 'Description is too long' });
  }

  if (priority !== undefined && PRIORITIES.indexOf(priority) === -1) {
    return res.status(400).json({ error: 'Priority must be low, medium or high' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be true or false' });
  }

  next();
}

module.exports = {
  validateCreate,
  validateUpdate
};
