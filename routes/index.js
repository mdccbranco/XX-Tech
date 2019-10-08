const express = require('express');
const Commit = require('../models/commit');

const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  let isAdm = false;
  let isUser = false;
  if (req.user !== undefined) {
    if (req.user.role === 'adm') {
      isAdm = true;
    } else if (req.user.role === 'user') {
      isUser = true;
    }
  }
    res.render('index', {
      user: req.user,
      isAdm,
      isUser
    });
});

router.get('/yes-she-can', (req, res, next) => {
  let isAdm = false;
  let isUser = false;
  if (req.user !== undefined) {
    if (req.user.role === 'adm') {
      isAdm = true;
    } else if (req.user.role === 'user') {
      isUser = true;
    }
  }
  Commit.find({
      post: true,
      category: 'yes'
    })
    .populate('owner')
    .then(commit => {
      // res.send(commit);
      res.render('home/yes', {
        commit,
        user: req.user,
        isAdm,
        isUser
      });
    })
    .catch(error => console.log(error));
});

router.get('/inspiration-bits', (req, res, next) => {
  let isAdm = false;
  let isUser = false;
  if (req.user !== undefined) {
    if (req.user.role === 'adm') {
      isAdm = true;
    } else if (req.user.role === 'user') {
      isUser = true;
    }
  }
  Commit.find({
      post: true,
      category: 'bits'
    })
    .populate('owner')
    .then(commit => {
      // res.send(commit);
      res.render('home/bits', {
        commit,
        user: req.user,
        isAdm,
        isUser
      });
    })
    .catch(error => console.log(error));
});



module.exports = router;