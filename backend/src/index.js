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
import Case from './models/Case.js';
import Reference from './models/Reference.js';
import Client from './models/Client.js';

import authRoutes from './routes/authRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import referenceRoutes from './routes/referenceRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import proceedingRoutes from './routes/proceedingRoutes.js';
import partyRoutes from './routes/partyRoutes.js';

console.log('📦 Loading environment variables...');
dotenv.config();

console.log('📦 Connecting to database...');
connectDB();

console.log('📦 Setting up Express...');
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS CONFIGURATION - ULTIMATE FIX
// ============================================
console.log('📦 Setting up CORS...');

// ✅ Allow all origins for development/ngrok
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow all origins in development
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, ngrok-skip-browser-warning');
  res.header('Access-Control-Expose-Headers', 'Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔄 Preflight request handled for:', req.url);
    return res.status(200).end();
  }
  
  next();
});

// Also use cors middleware as backup
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins in development
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Allow-Origin', 'ngrok-skip-browser-warning'],
  exposedHeaders: ['Authorization', 'Content-Length', 'X-Requested-With'],
  maxAge: 86400,
}));

console.log('✅ CORS configured');

console.log('📦 Setting up Body Parser...');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// SESSION MIDDLEWARE
// ============================================
console.log('📦 Setting up Session...');
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'jurisflow_session_secret_2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true only in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  })
);

// ============================================
// PASSPORT INITIALIZATION
// ============================================
console.log('📦 Registering Passport strategies...');

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

console.log('✅ Passport strategies configured');

// ============================================
// PASSPORT MIDDLEWARE
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

// Request logging with CORS info
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// ============================================
// TEST ROUTES (NO AUTH REQUIRED)
// ============================================
console.log('📦 Setting up Test Routes...');

app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test/cases', async (req, res) => {
  try {
    console.log('📥 TEST: Fetching all cases without auth...');
    const cases = await Case.find({}).sort({ createdAt: -1 });
    console.log(`📊 TEST: Found ${cases.length} cases`);
    
    const formattedCases = cases.map(c => {
      const obj = c.toJSON();
      return {
        ...obj,
        id: obj._id.toString()
      };
    });
    
    res.json({
      success: true,
      count: formattedCases.length,
      data: formattedCases
    });
  } catch (error) {
    console.error('❌ TEST Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/test/clients', async (req, res) => {
  try {
    console.log('👥 TEST: Fetching all clients without auth...');
    const clients = await Client.find({}).sort({ createdAt: -1 });
    console.log(`👥 TEST: Found ${clients.length} clients`);
    
    const formattedClients = clients.map(client => {
      const obj = client.toJSON();
      return {
        ...obj,
        id: obj._id.toString()
      };
    });
    
    res.json({
      success: true,
      count: formattedClients.length,
      data: formattedClients
    });
  } catch (error) {
    console.error('❌ TEST Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/test/references', async (req, res) => {
  try {
    console.log('📚 TEST: Fetching all references without auth...');
    const references = await Reference.find({}).sort({ createdAt: -1 });
    console.log(`📚 TEST: Found ${references.length} references`);
    
    const formattedReferences = references.map(ref => {
      const obj = ref.toJSON();
      return {
        ...obj,
        id: obj._id.toString()
      };
    });
    
    res.json({
      success: true,
      count: formattedReferences.length,
      data: formattedReferences
    });
  } catch (error) {
    console.error('❌ TEST Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
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
    cors: 'enabled'
  });
});

// ============================================
// ROUTES
// ============================================
console.log('📦 Setting up Routes...');

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/references', referenceRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/proceedings', proceedingRoutes);
app.use('/api/parties', partyRoutes);

// ============================================
// ERROR HANDLER
// ============================================
app.use(errorHandler);

// 404 Handler
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
  console.log(`🧪 Test Cases: http://localhost:${PORT}/api/test/cases`);
  console.log(`👥 Test Clients: http://localhost:${PORT}/api/test/clients`);
  console.log(`📚 Test References: http://localhost:${PORT}/api/test/references`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`\n🔧 CORS: All origins allowed (development mode)`);
  console.log(`\n📌 API Routes:`);
  console.log(`  /api/auth - Auth routes`);
  console.log(`  /api/cases - Case routes`);
  console.log(`  /api/clients - Client routes`);
  console.log(`  /api/events - Event routes`);
  console.log(`  /api/references - Reference routes`);
  console.log(`  /api/proceedings - Proceeding routes`);
  console.log(`  /api/parties - Party routes ✨ NEW`);
});