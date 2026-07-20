// backend/src/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔐 Passport Config Initializing...');

// ============================================
// GOOGLE STRATEGY
// ============================================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔍 Google profile:', profile.id);
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);
        
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
          name: profile.displayName || 'Google User',
          email: email || `${profile.id}@google.com`,
          avatar: profile.photos?.[0]?.value || '',
          authProvider: 'google',
          password: Math.random().toString(36).slice(-12),
        });
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
console.log('✅ Google Strategy Registered');

// ============================================
// GITHUB STRATEGY
// ============================================
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔍 GitHub profile received:', profile.id);
        console.log('🔍 GitHub username:', profile.username);
        
        let user = await User.findOne({ githubId: profile.id });
        if (user) {
          console.log('✅ GitHub user found:', user.email);
          return done(null, user);
        }
        
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.githubId = profile.id;
            user.authProvider = 'github';
            user.avatar = profile.photos?.[0]?.value || user.avatar;
            await user.save();
            console.log('✅ GitHub linked to existing user:', user.email);
            return done(null, user);
          }
        }
        
        const userEmail = email || `${profile.id}@github.com`;
        user = await User.create({
          githubId: profile.id,
          name: profile.displayName || profile.username || 'GitHub User',
          email: userEmail,
          avatar: profile.photos?.[0]?.value || '',
          authProvider: 'github',
          password: Math.random().toString(36).slice(-12),
        });
        console.log('✅ New GitHub user created:', user.email);
        return done(null, user);
      } catch (error) {
        console.error('❌ GitHub strategy error:', error);
        return done(error, null);
      }
    }
  )
);
console.log('✅ GitHub Strategy Registered');

// ============================================
// SERIALIZATION
// ============================================
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

console.log('🔐 All Passport Strategies Loaded');

export default passport;