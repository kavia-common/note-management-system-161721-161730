const bcrypt = require('bcryptjs');
const db = require('../db/memory');

/**
 * AuthService encapsulates user operations and password security.
 */
class AuthService {
  // PUBLIC_INTERFACE
  /**
   * Registers a new user with email and password.
   * Returns the user object without password hash.
   */
  async signup(email, password) {
    const existing = db.findUserByEmail(email);
    if (existing) {
      const err = new Error('Email already in use');
      err.status = 409;
      throw err;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.createUser({ email, passwordHash });
    return this.sanitizeUser(user);
  }

  // PUBLIC_INTERFACE
  /**
   * Authenticates a user by email and password.
   * Returns user object without password hash.
   */
  async login(email, password) {
    const user = db.findUserByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }
    return this.sanitizeUser(user);
  }

  // PUBLIC_INTERFACE
  /**
   * Retrieves the user by id (sanitized).
   */
  getUserById(userId) {
    const user = db.findUserById(userId);
    return user ? this.sanitizeUser(user) : null;
  }

  sanitizeUser(user) {
    const { passwordHash, ...safe } = user;
    return safe;
  }
}

module.exports = new AuthService();
