const express = require('express');
const router = express.Router();

const users = require('./modules/users');
const home = require('./modules/home');
const todos = require('./modules/todos');
const auth = require('./modules/auth');

const authenticator = (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('warning_msg', 'Login first plaese!');
  res.redirect('/users/login');
};

router.use('/users', users);
router.use('/auth', auth);
router.use('/todos', authenticator, todos);
router.use('/', authenticator, home);

module.exports = router;
