const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('../daos/user-dao')

//define passport's login strategy
passport.use(new LocalStrategy(
  function (username, password, done) {
    if (username !== 'admin')
      userDao.getUser(username, password).then((user) => {
        if (!user)
          return done(null, false, { message: 'Invalid email and/or password for user.' });
        return done(null, user);
      })
    else
      userDao.getAdmin(username, password).then((admin) => {
        if (!admin)
          return done(null, false, { message: 'Invalid email and/or password for admin.' });
        return done(null, admin);
      })
  }
));
 
// serialize and de-serialize the user (user object <-> session)
passport.serializeUser((user, done) => {
  if (user.username === 'admin')
    done(null, { id: user.id, isAdmin: true });
  else
    done(null, { id: user.id, isAdmin: false });
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((sessionObject, done) => {
  if (sessionObject.isAdmin)
    userDao.getAdminById(sessionObject.id)
      .then(user => {
        done(null, user); // this will be available in req.user
      }).catch(err => {
        done(err, null);
      });
  else
    userDao.getUserById(sessionObject.id)
      .then(user => {
        done(null, user); // this will be available in req.user
      }).catch(err => {
        done(err, null);
      });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'Not authenticated.' });
}

const isAdmin = (req, res, next) => {
  if (req.user.nickname === 'admin') return next();
  return res.status(401).json({ error: 'Not authorized.' });
}

module.exports = { passport, session, isLoggedIn, isAdmin }