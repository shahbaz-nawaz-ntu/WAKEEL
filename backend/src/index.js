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
import Client from './models/Client.js'; // ✅ ADD THIS

// Import Routes
import authRoutes from './routes/authRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import referenceRoutes from './routes/referenceRoutes.js';
import proceedingRoutes from './routes/proceedingRoutes.js';

console.log('📦 Loading environment variables...');
dotenv.config();

console.log('📦 Connecting to database...');
connectDB();

console.log('📦 Setting up Express...');
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS CONFIGURATION
// ============================================
console.log('📦 Setting up CORS...');

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

console.log('✅ CORS configured');

console.log('📦 Setting up Body Parser...');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      secure: process.env.NODE_ENV === 'production',
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

// Request logging
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

// ✅ TEST CLIENTS ROUTE (NO AUTH REQUIRED)
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

app.get('/api/debug/cases', async (req, res) => {
  try {
    const allCases = await Case.find({});
    console.log('🔍 All cases in DB:', allCases.length);
    
    const formattedCases = allCases.map(c => {
      const obj = c.toJSON();
      return {
        ...obj,
        id: obj._id.toString()
      };
    });
    
    res.json({
      success: true,
      count: formattedCases.length,
      data: formattedCases,
      sample: formattedCases.length > 0 ? formattedCases[0] : null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ DEBUG CLIENTS ROUTE
app.get('/api/debug/clients', async (req, res) => {
  try {
    const allClients = await Client.find({});
    console.log('🔍 All clients in DB:', allClients.length);
    
    const formattedClients = allClients.map(client => {
      const obj = client.toJSON();
      return {
        ...obj,
        id: obj._id.toString()
      };
    });
    
    res.json({
      success: true,
      count: formattedClients.length,
      data: formattedClients,
      sample: formattedClients.length > 0 ? formattedClients[0] : null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/debug/references', async (req, res) => {
  try {
    const allReferences = await Reference.find({});
    console.log('🔍 All references in DB:', allReferences.length);
    
    const formattedReferences = allReferences.map(ref => {
      const obj = ref.toJSON();
      return {
        ...obj,
        id: obj._id.toString()
      };
    });
    
    res.json({
      success: true,
      count: formattedReferences.length,
      data: formattedReferences,
      sample: formattedReferences.length > 0 ? formattedReferences[0] : null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'JurisFlow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: {
      origins: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174']
    }
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
app.use('/api/proceedings', proceedingRoutes);

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
  console.log(`🔍 Debug: http://localhost:${PORT}/api/debug/passport`);
  console.log(`🧪 Test Cases: http://localhost:${PORT}/api/test/cases`);
  console.log(`👥 Test Clients: http://localhost:${PORT}/api/test/clients`);
  console.log(`📚 Test References: http://localhost:${PORT}/api/test/references`);
  console.log(`🔍 Debug Clients: http://localhost:${PORT}/api/debug/clients`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`\n📌 Available Routes:`);
  console.log(`  GET  /test - Test route`);
  console.log(`  GET  /api/test/cases - Test cases (no auth)`);
  console.log(`  GET  /api/test/clients - Test clients (no auth)`);
  console.log(`  GET  /api/test/references - Test references (no auth)`);
  console.log(`  GET  /api/debug/cases - Debug cases`);
  console.log(`  GET  /api/debug/clients - Debug clients`);
  console.log(`  GET  /api/debug/references - Debug references`);
  console.log(`  POST /api/auth/register - Register user`);
  console.log(`  POST /api/auth/login - Login user`);
  console.log(`  GET  /api/auth/google - Google Login`);
  console.log(`  GET  /api/auth/github - GitHub Login`);
  console.log(`  GET  /api/cases - Get all cases (auth required)`);
  console.log(`  GET  /api/clients - Get all clients (auth required)`);
  console.log(`  GET  /api/references - Get all references (auth required)`);
  console.log(`  POST /api/references - Create reference (auth required)`);
  console.log(`  GET  /api/proceedings - Get all proceedings (auth required)`);
  console.log(`  POST /api/proceedings - Create proceeding (auth required)`);
  console.log(`\n🔧 CORS allowed origins:`);
  console.log(`  http://localhost:3000`);
  console.log(`  http://localhost:5173`);
  console.log(`  http://localhost:5174`);
});