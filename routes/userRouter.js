const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');
