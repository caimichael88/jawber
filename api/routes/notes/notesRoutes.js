const express = require('express')
const { getNotesByUser, createNote } = require('./notesService');
const { verifyToken } = require('../../middleware/verifyToken');

const router = express.Router();
router.use(verifyToken);
router.route('/')
  .get(async (req, res) => {
    const { user } = req;
    try {
      const notes = await getNotesByUser(user.id);
      res.json({ data: notes });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }
  })
  .post(async (req, res) => {
    try {
      const { body } = req;
      if (!body.text || body.text === '') {
        res.status(400).json({ message: 'text must be provided' });
      }
      const newNote = {
        user: req.user.id,
        text: body.text,
      }
      const id = await createNote(newNote)
      res.json({ data: { id }});
    } catch(err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }

  });

module.exports = router;