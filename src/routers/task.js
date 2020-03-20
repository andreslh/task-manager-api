const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch(error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};

    if (req.query.completed) {
      match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1; 
    }

    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
    res.send(req.user.tasks);
  } catch(error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch(error) {
    res.status(400).send(error)
  }
});

router.patch('/tasks/:id', auth, async(req, res) => {
  try {
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const validOperation = updates.every(key => allowedUpdates.includes(key));

    if (!validOperation) {
      res.status(400).send('Invalid fields');
    }

    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();

    res.send(task);
  } catch(error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, async(req, res) => {
  try{
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch(error) {
    res.status(400).send();
  }
});

module.exports = router;
