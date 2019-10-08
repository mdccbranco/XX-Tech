const express = require('express');
const Commit = require('../models/commit');

const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/yes-she-can', (req, res, next) => {
  Commit.find({post: true})
    .populate('owner')
    .then(commit => {
      res.render('home/yes', {commit});
    })
    .catch(error => console.log(error));
});

module.exports = router;
