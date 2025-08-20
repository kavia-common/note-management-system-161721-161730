const db = require('../db/memory');

/**
 * NotesService manages creating, reading, updating and deleting notes.
 */
class NotesService {
  // PUBLIC_INTERFACE
  /**
   * Creates a note for a specific user.
   */
  create(userId, { title, content }) {
    return db.createNote({ userId, title, content });
  }

  // PUBLIC_INTERFACE
  /**
   * Lists notes for a user.
   */
  list(userId) {
    return db.listNotesByUser(userId);
  }

  // PUBLIC_INTERFACE
  /**
   * Gets a note by id, validates ownership.
   */
  get(userId, noteId) {
    const note = db.getNoteById(noteId);
    if (!note || note.userId !== userId) return null;
    return note;
  }

  // PUBLIC_INTERFACE
  /**
   * Updates a user's note. Returns null if not found/unauthorized.
   */
  update(userId, noteId, { title, content }) {
    const note = db.getNoteById(noteId);
    if (!note || note.userId !== userId) return null;
    return db.updateNote(noteId, { title, content });
  }

  // PUBLIC_INTERFACE
  /**
   * Deletes a user's note. Returns boolean.
   */
  remove(userId, noteId) {
    const note = db.getNoteById(noteId);
    if (!note || note.userId !== userId) return false;
    return db.deleteNote(noteId);
  }
}

module.exports = new NotesService();
