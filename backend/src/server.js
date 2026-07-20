// backend/src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import User from './models/User.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

console.log('📦 Loading environment variables...');
dotenv.config();

console.log('📦 Connecting to database...');
connectDB();

console.log('📦 Setting up Express...');
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// ✅ REGISTER PASSPORT STRATEGIES IMMEDIATELY
// ============================================
console.log('📦 Registering Passport strategies...');

// Check if credentials exist
console.log('🔍 Google Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('🔍 GitHub Client ID:', process.env.GITHUB_CLIENT_ID ? '✅ Set' : '❌ Missing');

// Google Strategy
console.log('  Registering Google strategy...');
try {
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
        callbackURL: 'http://localhost:5000/api/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔍 Google profile received:', profile.id);
          let user = await User.findOne({ googleId: profile.id });
          
          if (user) {
            return done(null, user);
          }
          
          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              await user.save();
              return done(null, user);
            }
          }
          
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
            email: email || `${profile.id}@google.com`,
            avatar: profile.photos?.[0]?.value || '',
            isEmailVerified: true,
            authProvider: 'google',
            password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12),
          });
          
          return done(null, user);
        } catch (error) {
          console.error('❌ Google strategy error:', error);
          return done(error, null);
        }
      }
    )
  );
  console.log('  ✅ Google strategy registered');
} catch (error) {
  console.error('  ❌ Failed to register Google strategy:', error);
}

// GitHub Strategy
console.log('  Registering GitHub strategy...');
try {
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || 'dummy',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy',
        callbackURL: 'http://localhost:5000/api/auth/github/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔍 GitHub profile received:', profile.id);
          let user = await User.findOne({ githubId: profile.id });
          
          if (user) {
            return done(null, user);
          }
          
          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.githubId = profile.id;
              await user.save();
              return done(null, user);
            }
          }
          
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: email || `${profile.id}@github.com`,
            avatar: profile.photos?.[0]?.value || '',
            isEmailVerified: email ? true : false,
            authProvider: 'github',
            password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12),
          });
          
          return done(null, user);
        } catch (error) {
          console.error('❌ GitHub strategy error:', error);
          return done(error, null);
        }
      }
    )
  );
  console.log('  ✅ GitHub strategy registered');
} catch (error) {
  console.error('  ❌ Failed to register GitHub strategy:', error);
}

// Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Log registered strategies
console.log('🔍 Registered strategies:', Object.keys(passport._strategies || {}));
console.log('✅ Passport strategies configured');

// ============================================
// MIDDLEWARE
// ============================================

console.log('📦 Setting up CORS...');
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

console.log('📦 Setting up Body Parser...');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// SESSION MIDDLEWARE (BEFORE PASSPORT)
// ============================================
console.log('📦 Setting up Session...');
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'jurisflow_session_secret_2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ============================================
// PASSPORT INITIALIZATION
// ============================================
console.log('📦 Initializing Passport...');
app.use(passport.initialize());
app.use(passport.session());
console.log('✅ Passport middleware initialized!');

// ============================================
// RATE LIMITING & LOGGING
// ============================================
console.log('📦 Setting up Rate Limiter...');
app.use('/api', rateLimiter);

app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ============================================
// ROUTES
// ============================================
console.log('📦 Setting up Routes...');

// ✅ TEST ROUTE
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ DEBUG ROUTE
app.get('/api/debug/passport', (req, res) => {
  console.log('🔍 Debug endpoint called');
  try {
    const strategies = Object.keys(passport._strategies || {});
    res.json({
      success: true,
      strategies: strategies,
      hasGoogle: strategies.includes('google'),
      hasGithub: strategies.includes('github'),
      totalStrategies: strategies.length,
      passportInitialized: !!passport._strategies,
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not Set',
      githubClientId: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not Set',
      message: 'Debug endpoint working'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'JurisFlow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Mount your routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/events', eventRoutes);

// ============================================
// ERROR HANDLER
// ============================================
app.use(errorHandler);

// 404 Handler - MUST BE LAST
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}`,
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Test route: http://localhost:${PORT}/test`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Debug: http://localhost:${PORT}/api/debug/passport`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`\n📌 Available Routes:`);
  console.log(`  GET  /test - Test route`);
  console.log(`  GET  /api/debug/passport - Debug Passport`);
  console.log(`  GET  /api/health - Health check`);
  console.log(`  POST /api/auth/register - Register user`);
  console.log(`  POST /api/auth/login - Login user`);
  console.log(`  GET  /api/auth/google - Google Login`);
  console.log(`  GET  /api/auth/github - GitHub Login`);
  console.log(`  GET  /api/cases - Get all cases`);
  console.log(`  POST /api/cases - Create case`);
  console.log(`  GET  /api/clients - Get all clients`);
  console.log(`  POST /api/clients - Create client`);
  console.log(`  GET  /api/events - Get all events`);
  console.log(`  POST /api/events - Create event`);
});