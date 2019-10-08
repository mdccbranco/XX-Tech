const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/user');
const GitHubStrategy = require('passport-github').Strategy;

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next) => {
  const {username, password, role, email} = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', {message: 'Indicate username and password'});
    return;
  }

  User.findOne({username})
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', {message: 'The username already exists'});
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashPass,
        role
      });

      newUser.save(err => {
        if (err) {
          res.render('auth/signup', {message: 'Something went wrong'});
        } else {
          res.redirect('/');
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login', {message: 'error'});
});

authRoutes.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
);

//github
authRoutes.get('/auth/github', passport.authenticate('github'));

authRoutes.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  })
);

module.exports = authRoutes;
