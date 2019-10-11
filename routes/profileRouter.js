const express = require('express');
const profileRouter = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');

profileRouter.get('/', ensureLogin.ensureLoggedIn('/'), (req, res) => {
  if (req.user.role === 'adm') {
    res.render('/', {user: req.user, isAdm: true});
  } else if (req.user.role === 'user') {
    res.render('/', {user: req.user, isUser: true});
  }
});

module.exports = profileRouter;
