var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/signin', function(req, res, next) {
  res.render('auth/signin', { title: 'Junket' });
});

router.post('/signin', function(req, res, next) {
  const { login, password } = req.body;

  // if auth ldap.js
  res.redirect('/user');
  // else(){
  //   erro
  //   res.render('index', { title: 'Junket' });
  // }
});

router.get('/signup', function(req, res, next) {
  res.render('auth/signup', { title: 'Junket' });
});

router.post('/signup', function(req, res, next) {
  const { login, password } = req.body;


  res.render("auth/signup", {
    title: "Welcome",
    login,
    password
  });
});

module.exports = router;


