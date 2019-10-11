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
          let emailMessage = ' <div> <p style="color:#ac0d56;"><b>Oi ';
          emailMessage += newUser.username;
          emailMessage += '!</b></p><p style="color:#ac0d56;">É com muita alegria que damos as boas vindas a você. Nós da XX-Tech sabemos que mulher e tecnologia tem tudo a ver, por isso, criamos um portal onde todos podem contribuir pra incentivar a entrada e a manutenção de mulheres em trabalhos relacionados às áreas de engenharia, informática e demais áreas exatas.</p><p>Você é muito importante para que a nossa corrente alcance o seu objetivo.</p><b>A partir de agora você pode sugerir conteúdo para o portal. Para isso, basta: </b> <ul> <li>Fazer o Login</li><li>Clicar no botao "commit to us" </li><li>Adicionar o link da notícia que deseja compartilhar com o título da matéria. </li></ul> <p>Nossa equipe irá ler e adicionar a notícia ao portal. Enquanto a postagem não estiver online, você pode editar como quiser a sua postagem.</p><div style="text-align:center"> Muito obrigada pela sua colaboração.<br>Abraços!<br>XX-Tech<br></div></div>';
          transporter
            .sendMail({
              from: 'XX-TECH <contato.xxtech@gmail.com>',
              //to: 'monicadamasceno@gmail.com',
              to: newUser.email,
              subject: 'Seja bem vindo ao XX-Tech',
              // text: 'message',
              html: emailMessage
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
    message: 'error',
    user: req.user
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
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

module.exports = authRoutes;