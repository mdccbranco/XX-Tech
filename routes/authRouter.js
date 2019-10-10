const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/user');
const GitHubStrategy = require('passport-github').Strategy;
const nodemailer = require('nodemailer');

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next) => {
  const {
    username,
    password,
    role,
    email
  } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', {
      message: 'Indicate username and password'
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', {
          message: 'The username already exists'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashPass,
        role
      });

      newUser.save(err => {
        if (err) {
          res.render('auth/signup', {
            message: 'Something went wrong'
          });
        } else {
          //pegar o email do formulário
          let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_ID,
              pass: process.env.EMAIL_SECRET
            }
          });
          transporter.sendMail({
              from: "XX-TECH <contato.xxtech@gmail.com>",
              //to: 'monicadamasceno@gmail.com', 
              to: newUser.email,
              subject: 'Seja bem vindo ao XX-Tech',
              // text: 'message',
              html: `<b>Obrigada por se inscrever no XX Tech.</b><br> Estamos muito felizes com a sua presença, a partir de agora voce pode logar no nosso site e sugerir conteúdo relacionado a presença feminina no mercado de trabalho das exatas e tecnologias.`
            })
            .then(info => res.redirect('/'))
            .catch(error => console.log(error));
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login', {
    message: 'error', user: req.user
  });
});

authRoutes.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
);

//github
authRoutes.get('/auth/github', passport.authenticate('github'));

authRoutes.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  })
);

module.exports = authRoutes;