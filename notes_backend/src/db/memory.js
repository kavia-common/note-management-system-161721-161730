const { v4: uuidv4 } = require('uuid');

/**
 * Simple in-memory storage for demo and development.
 * In production, replace with a real database adapter implementing the same interface.
 */
class MemoryDB {
  constructor() {
    this.users = new Map(); // key: userId, value: user object
    this.usersByEmail = new Map(); // key: email, value: userId

    this.notes = new Map(); // key: noteId, value: note object
    this.notesByUser = new Map(); // key: userId, value: Set(noteId)
  }

  // Users
  createUser({ email, passwordHash }) {
    const now = new Date().toISOString();
    const id = uuidv4();
    const user = { id, email: email.toLowerCase(), passwordHash, createdAt: now, updatedAt: now };
    this.users.set(id, user);
    this.usersByEmail.set(user.email, id);
    return { ...user };
  }

  findUserByEmail(email) {
    const id = this.usersByEmail.get(email.toLowerCase());
    if (!id) return null;
    return { ...this.users.get(id) };
  }

  findUserById(id) {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  // Notes
  createNote({ userId, title, content }) {
    const now = new Date().toISOString();
    const id = uuidv4();
    const note = { id, userId, title, content, createdAt: now, updatedAt: now };
    this.notes.set(id, note);
    if (!this.notesByUser.has(userId)) this.notesByUser.set(userId, new Set());
    this.notesByUser.get(userId).add(id);
    return { ...note };
  }

  listNotesByUser(userId) {
    const ids = this.notesByUser.get(userId);
    if (!ids) return [];
    return Array.from(ids).map((id) => ({ ...this.notes.get(id) }));
  }

  getNoteById(noteId) {
    const note = this.notes.get(noteId);
    return note ? { ...note } : null;
  }

  updateNote(noteId, { title, content }) {
    const note = this.notes.get(noteId);
    if (!note) return null;
    const updated = { ...note, title, content, updatedAt: new Date().toISOString() };
    this.notes.set(noteId, updated);
    return { ...updated };
  }

  deleteNote(noteId) {
    const note = this.notes.get(noteId);
    if (!note) return false;
    this.notes.delete(noteId);
    const set = this.notesByUser.get(note.userId);
    if (set) set.delete(noteId);
    return true;
  }
}

module.exports = new MemoryDB();
