import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { prisma } from './prisma.js';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';
import bcrypt from 'bcryptjs';

const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const appSession = session({
  store: sessionStore,
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
});

const localStrat = new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: 'Incorrect password' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

const serialize = (user, done) => {
  done(null, user.id);
};

const deserialize = async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
};

const login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureMessage: 'Incorrect email/password',
});

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

const storeUserInLocalObject = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

passport.use(localStrat);
passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

export default { appSession, login, logout, storeUserInLocalObject, passport };
