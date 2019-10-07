require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./models/user');
const flash = require('connect-flash');

mongoose
  .connect('mongodb://localhost/xxTech', {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(
  `${app_name}:${path.basename(__filename).split('.')[0]}`
);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());

app.use(
  session({
    secret: 'woman',
    resave: true,
    saveUninitialized: true
  })
);

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// default value for title local
app.locals.title = 'XX Tech';

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

app.use(flash());

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({username}, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, {message: 'Incorrect username'});
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, {message: 'Incorrect password'});
      }
      return next(null, user);
    });
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({githubId: profile.id}, function(err, user) {
        return cb(err, user);
      });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

const index = require('./routes/index');
const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const userRouter = require('./routes/userRouter');

app.use('/', index);
app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/user', userRouter);

module.exports = app;
