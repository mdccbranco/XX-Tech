const express = require('express');
const Commit = require('../models/commit');

const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/yes-she-can', (req, res, next) => {
  Commit.find({post: true, category: 'yes'})  
    .populate('owner')
    .then(commit => {
      // res.send(commit);
     res.render('home/yes', {commit});
    })
    .catch(error => console.log(error));
});

router.get('/inspiration-bits', (req, res, next) => {
  Commit.find({post: true, category: 'bits'})
  // Commit.find()
    .populate('owner')
    .then(commit => {
      // console.log(commit);
      res.render('home/bits', {commit});
    })
    .catch(error => console.log(error));
});

module.exports = router;
