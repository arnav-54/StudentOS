import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Serialize user into session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
const googleClientId = process.env.GOOGLE_CLIENT_ID || 'mock-google-id';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || 'mock-google-secret';

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: 'http://localhost:5001/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email found in Google profile'), undefined);

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // Register new user
          user = await prisma.user.create({
            data: {
              email,
              password: '', // OAuth accounts do not use passwords
              name: profile.displayName || profile.username || 'Google User',
            },
          });

          // Create empty profile
          await prisma.profile.create({
            data: {
              userId: user.id,
              avatar: profile.photos?.[0]?.value || '',
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

// GitHub Strategy
const githubClientId = process.env.GITHUB_CLIENT_ID || 'mock-github-id';
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || 'mock-github-secret';

passport.use(
  new GitHubStrategy(
    {
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: 'http://localhost:5001/api/auth/github/callback',
      passReqToCallback: true,
    },
    async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github-placeholder.com`;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              password: '',
              name: profile.displayName || profile.username || 'GitHub User',
            },
          });

          await prisma.profile.create({
            data: {
              userId: user.id,
              avatar: profile.photos?.[0]?.value || '',
              githubUrl: profile.profileUrl || `https://github.com/${profile.username}`,
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

export default passport;
