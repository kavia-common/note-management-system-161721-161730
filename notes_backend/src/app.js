require('dotenv').config();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const healthRoutes = require('./routes');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

// Initialize express app
const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? '*' : [corsOrigin],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);

// Sessions
const sessionName = process.env.SESSION_NAME || 'sid';
const sessionSecret = process.env.SESSION_SECRET || 'development_secret_change_me';
const sessionMaxAge = parseInt(process.env.SESSION_MAX_AGE_MS || '1209600000', 10); // 14 days default

app.use(session({
  name: sessionName,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true when behind https
    maxAge: sessionMaxAge,
  },
}));

// Swagger docs with dynamic server
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Auth', description: 'User authentication and session' },
      { name: 'Notes', description: 'Notes CRUD operations' },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

// Error handling middleware
// PUBLIC_INTERFACE
/**
 * Global error handler.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
