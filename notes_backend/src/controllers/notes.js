const notesService = require('../services/notes');

/**
 * Controller for note operations
 */
class NotesController {
  // PUBLIC_INTERFACE
  create(req, res, next) {
    try {
      const userId = req.session.user.id;
      const note = notesService.create(userId, req.body);
      return res.status(201).json({ status: 'ok', note });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  list(req, res, next) {
    try {
      const userId = req.session.user.id;
      const notes = notesService.list(userId);
      return res.status(200).json({ status: 'ok', notes });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  get(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { id } = req.params;
      const note = notesService.get(userId, id);
      if (!note) return res.status(404).json({ status: 'error', message: 'Note not found' });
      return res.status(200).json({ status: 'ok', note });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  update(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { id } = req.params;
      const note = notesService.update(userId, id, req.body);
      if (!note) return res.status(404).json({ status: 'error', message: 'Note not found' });
      return res.status(200).json({ status: 'ok', note });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  remove(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { id } = req.params;
      const ok = notesService.remove(userId, id);
      if (!ok) return res.status(404).json({ status: 'error', message: 'Note not found' });
      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new NotesController();
