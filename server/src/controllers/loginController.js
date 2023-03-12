const { passport, session, isLoggedIn } = require('../middlewares/login')
const userService = require('../services/userService')

//POST 
exports.register = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body.user);
    res.status(200).json(result);
  } catch (e) {
    console.log(e)
    res.status(e.code).end(e.message);
  }
}

// POST /sessions/
//login
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);
      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
}

// GET /sessions/current
// check whether the user is logged in or not
exports.getSession = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
};

// DELETE /sessions/current 
// logout
exports.logout = (req, res) => {
  req.logout(() => { res.end(); });
}

