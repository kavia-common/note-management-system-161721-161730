const authService = require('../services/auth');

/**
 * Controller for authentication endpoints.
 */
class AuthController {
  // PUBLIC_INTERFACE
  /**
   * Signup a new user
   */
  async signup(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.signup(email, password);
      req.session.user = { id: user.id, email: user.email };
      return res.status(201).json({ status: 'ok', user });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ status: 'error', message: err.message });
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      req.session.user = { id: user.id, email: user.email };
      return res.status(200).json({ status: 'ok', user });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ status: 'error', message: err.message });
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Logout current session
   */
  async logout(req, res, next) {
    try {
      if (!req.session) return res.status(200).json({ status: 'ok' });
      req.session.destroy((e) => {
        if (e) return next(e);
        res.clearCookie(process.env.SESSION_NAME || 'sid');
        return res.status(200).json({ status: 'ok' });
      });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get current session user
   */
  me(req, res) {
    if (!req.session || !req.session.user) {
      return res.status(200).json({ authenticated: false, user: null });
    }
    const user = authService.getUserById(req.session.user.id);
    return res.status(200).json({ authenticated: !!user, user: user || null });
  }
}

module.exports = new AuthController();
