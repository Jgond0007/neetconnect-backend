const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// Get all questions (mentor/admin)
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('aspirant', 'name email')
      .populate('mentor', 'name')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my questions (aspirant)
router.get('/mine', auth, async (req, res) => {
  try {
    const questions = await Question.find({ aspirant: req.user.id })
      .populate('mentor', 'name')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a question (aspirant)
router.post('/', auth, async (req, res) => {
  try {
    const { subject, text, mentorId } = req.body;
    const question = new Question({ subject, text, aspirant: req.user.id, mentor: mentorId });
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Answer a question (mentor)
router.put('/:id/answer', auth, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { answer: req.body.answer, mentor: req.user.id, status: 'answered' },
      { new: true }
    );
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;