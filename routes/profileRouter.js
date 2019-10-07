const express = require('express');
const profileRouter = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');

profileRouter.get('/', ensureLogin.ensureLoggedIn('/profile'), (req, res) => {
  if (req.user.role === 'adm') {
    res.render('profile/profile', {user: req.user, isAdm: true});
  } else if (req.user.role === 'user') {
    res.render('profile/profile', {user: req.user, isUser: true});
  }
});

module.exports = profileRouter;
