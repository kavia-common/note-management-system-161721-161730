const Joi = require('joi');

/**
 * Ensures a session user exists; otherwise returns 401.
 */
// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ status: 'error', message: 'Unauthorized' });
}

// PUBLIC_INTERFACE
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }
    req.body = value;
    next();
  };
}

const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({ 'string.email': 'Invalid email' }),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const noteSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  content: Joi.string().allow('').default(''),
});

module.exports = {
  requireAuth,
  validateBody,
  schemas: { signupSchema, loginSchema, noteSchema },
};
