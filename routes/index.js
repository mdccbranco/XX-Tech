const express = require('express');
const Commit = require('../models/commit');

const router = express.Router();

var ola = 'Bom dia';
d = new Date();
hour = d.getHours();
if (hour < 5) {
  ola = "Boa Noite";
} else
if (hour < 8) {
  ola = "Bom Dia";
} else
if (hour < 12) {
  ola = "Bom Dia!";
} else
if (hour < 18) {
  ola = "Boa tarde";
} else {
  ola = "Boa noite";
}

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
  Commit.find({post: true, category: 'yes'})
  .limit(4)
  .then( yes => {
    res.render('index', { user: req.user, isAdm, isUser, ola, yes})
    // Commit.find({post:true, category: 'bits'})
    // .limit(3)
    // .then( bits => res.render('index', { user: req.user, isAdm, isUser, ola, yes, bits} ))
    // .catch(error => console.log(error));
  })
  .catch(error => console.log(error));
});

router.get('/about-us', (req, res, next) => {
  res.render('about-us');
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
      console.log(commit);
      // res.send(commit);
      res.render('home/yes', {
        commit,
        user: req.user,
        isAdm,
        isUser,
        ola
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
        isUser,
        ola
      });
    })
    .catch(error => console.log(error));
});

module.exports = router;