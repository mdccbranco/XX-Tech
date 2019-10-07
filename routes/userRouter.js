const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const User = require('../models/user');

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }
    res.redirect('/login');
  };
}

userRouter.get('/commit', checkRoles('user'), (req, res, next) => {
  Commit.find()
    .then(arrCommit => {
      res.render('user/commit', {arrCommit, isUser: true});
    })
    .catch(err => console.log(`error: ${err}`));
});

userRouter.post('/commit', checkRoles('user'), (req, res, next) => {
  const {title, url, description} = req.body;
  const addCommit = new Course({title, url, description});
  addCommit
    .save()
    .then(() => {
      res.redirect('/user/add');
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = userRouter;
