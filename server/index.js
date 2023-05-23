'use strict';

// init express
const express = require('express');
const app = express();
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.text());

const port = 3001;
const SERVER_URL = `http://localhost:3001`

//middlewares
const { passport, session, isLoggedIn, isAdmin } = require('./src/middlewares/login')
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'sdffnj348=()9438tjjf3445454hc44h/"HYY)',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const {cors,morgan} = require('./src/middlewares/middlewares')
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:3002', 'http://localhost', 'http://localhost:8080'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan('dev'));


//routes


const hello = require('./src/routes/hello.js');
app.use('/hello', hello);


const avatars = require('./src/routes/avatars.js');
app.use('/eipiai/avatars', isLoggedIn, avatars);

const labs = require('./src/routes/labs.js');
app.use('/eipiai/labs', isLoggedIn, labs);

const leaderboard = require('./src/routes/leaderboard.js');
app.use('/eipiai/leaderboard',isLoggedIn, leaderboard);

const users = require('./src/routes/users.js');
app.use('/eipiai/users',isLoggedIn, users);

const admin = require('./src/routes/admin.js');
app.use('/eipiai/admin',isLoggedIn, isAdmin, admin);

const login = require('./src/routes/login.js')
app.use('/eipiai/sessions', login);

const gitlab = require('./src/routes/gitlab.js')
app.use('/eipiai/gitlab', gitlab);


// Activate the server
app.listen(port, () => {
  console.log(`Server listening at ${SERVER_URL}`);
});
