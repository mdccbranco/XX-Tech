const express = require('express');
const admRouter = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Commit = require('../models/commit');
const uploadCloud = require('../middleware/cloudinary');

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }
    res.redirect('/login');
  };
}

admRouter.get('/pull', checkRoles('adm'), (req, res, next) => {
  Commit.find()
    .populate('owner')
    .then(arrCommit => {
      res.render('adm/pull', {arrCommit, user: req.user});
    })
    .catch(err => console.log(`error: ${err}`));
});

admRouter.post('/commit', checkRoles('adm'), (req, res, next) => {
  const {url, description, owner, anonymous} = req.body;
  const addCommit = new Commit({url, description, owner, anonymous});
  addCommit
    .save()
    .then(() => {
      res.redirect('/adm/pull');
    })
    .catch(error => {
      console.log(error);
    });
});

admRouter.post('/:id/delete', checkRoles('adm'), (req, res, next) => {
  Commit.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/adm/pull');
    })
    .catch(error => {
      console.log('Error in delete: ', error);
    });
});

admRouter.get('/:id/edit', (req, res, next) => {
  Commit.findById(req.params.id)
    .then(commit => {
      res.render('adm/edit', {commit});
    })
    .catch(error => {
      console.log('Error in edit: ', error);
    });
});

admRouter.post('/:id',  (req, res, next) => {
  const {url, description} = req.body;
  Commit.updateOne({_id: req.params.id}, {url, description})
    .then(() => {
      res.redirect('/adm/pull');
    })
    .catch(error => {
      console.log('Error in edit: ', error);
    });
});

admRouter.get('/:id/post', (req, res, next) => {
  Commit.findById(req.params.id)
    .then(commit => {
      res.render('adm/post', {commit});
    })
    .catch(error => {
      console.log('Error in edit: ', error);
    });
});

admRouter.post('/:id/post', (req, res, next) => {
  const {url, description} = req.body;
  Commit.updateOne({_id: req.params.id}, {url, description, post: true})
    .then(() => {
      res.redirect('/yes-she-can');
    })
    .catch(error => console.log(error));
});

admRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = admRouter;
