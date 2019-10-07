const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Commit = require('../models/commit');

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
    .populate('owner')
    .then(arrCommit => {
      console.log(arrCommit);
      res.render('user/commit', {arrCommit: arrCommit, user: req.user});
    })
    .catch(err => console.log(`error: ${err}`));
});

userRouter.post('/commit', checkRoles('user'), (req, res, next) => {
  const {url, description, owner, anonymous} = req.body;
  const addCommit = new Commit({url, description, owner, anonymous});
  addCommit
    .save()
    .then(() => {
      res.redirect('/user/commit');
    })
    .catch(error => {
      console.log(error);
    });
});

userRouter.post('/:id/delete', checkRoles('user'), (req, res, next) => {
  Commit.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/user/commit');
    })
    .catch(error => {
      console.log('Error in delete: ', error);
    });
});

userRouter.get('/:id/edit', (req, res, next) => {
  Commit.findById(req.params.id)
    .then(commit => {
      res.render('user/edit', {commit});
    })
    .catch(error => {
      console.log('Error in edit: ', error);
    });
});

userRouter.post('/:id', (req, res, next) => {
  const {url, description} = req.body;
  Commit.updateOne({_id: req.params.id}, {url, description})
    .then(() => {
      res.redirect('/user/commit');
    })
    .catch(error => {
      console.log('Error in edit: ', error);
    });
});

userRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = userRouter;
