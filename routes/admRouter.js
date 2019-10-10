const express = require('express');
const admRouter = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Commit = require('../models/commit');
const Linking = require('../models/linking');
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
      res.render('adm/pull', {
        arrCommit,
        user: req.user
      });
    })
    .catch(err => console.log(`error: ${err}`));
});

admRouter.post('/commit', checkRoles('adm'), (req, res, next) => {
  console.log('req', req.body);
  let location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };
  if (req.body.category === 'linking') {
    const {
      title,
      url,
      category,
      description,
      owner,
      anonymous,
      date,
      address,
      location
    } = req.body;
    const addEvent = new Linking({
      title,
      url,
      category,
      description,
      owner,
      anonymous,
      date,
      address,
      location
    });
    addEvent
      .save()
      .then(data => {
        console.log('data', data);
        res.redirect('/adm/pull');
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    const {url, category, description, owner, anonymous} = req.body;
    const addCommit = new Commit({
      url,
      category,
      description,
      owner,
      anonymous
    });
    addCommit
      .save()
      .then(data => {
        res.redirect('/adm/pull');
      })
      .catch(error => {
        console.log(error);
      });
  }
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
      res.render('adm/edit', {
        commit
      });
    })
    .catch(error => {
      console.log('Error in edit: ', error);
    });
});

admRouter.post('/:id', (req, res, next) => {
  const {url, description} = req.body;
  Commit.updateOne(
    {
      _id: req.params.id
    },
    {
      url,
      description
    }
  )
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
      // res.send(commit);
      res.render('adm/post', {
        commit
      });
    })
    .catch(error => {
      console.log('Error in edit: ', error);
    });
});

admRouter.post('/:id/post', uploadCloud.single('photo'), (req, res, next) => {
  console.log('======>', req.body);
  const {url, description, category} = req.body;
  if (req.body.changePhoto === 'yes') {
    const imgPath = req.file.url;
    const imgName = req.file.originalname;
    Commit.updateOne(
      {_id: req.params.id},
      {url, description, post: true, category, imgPath, imgName}
    )
      .then(() => {
        Commit.find()
          .populate('owner')
          .then(() => {
            res.redirect('/adm/pull');
          })
          .catch(err => console.log(`error: ${err}`));
      })
      .catch(error => console.log(error));
  } else {
    Commit.updateOne(
      {_id: req.params.id},
      {url, description, post: true, category}
    )
      .then(() => {
        Commit.find()
          .populate('owner')
          .then(() => {
            res.redirect('/adm/pull');
          })
          .catch(err => console.log(`error: ${err}`));
      })
      .catch(error => console.log(error));
  }
});

admRouter.get('/:id/post/edit', (req, res, next) => {
  Commit.updateOne({_id: req.params.id}, {post: false})
    .then(() => {
      res.redirect('/adm/pull');
    })
    .catch(error => console.log(error));
});

admRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = admRouter;
