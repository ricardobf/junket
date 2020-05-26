var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/signin', function(req, res, next) {
  res.render('auth/signin', { title: 'Junket' });
});

router.post('/signin', function(req, res, next) {
  const { login, password } = req.body;

  // sess = req.session;
  // if(sess.email) {
  //   res.redirect('/user', login, password);
  // }
  // //mandar erro e:
  // res.render('auth/signin', { title: 'Junket' });

  sess = req.session;
  sess.email = login;
  // res.end('done');
  res.redirect('/user', login, password);

  // if auth ldap.js (se tiver logado)
  // res.redirect('/user', 
  // login,
  // password);
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
  res.render('auth/signup', { title: 'Junket' });
});

router.get('/changepwd', function(req, res, next) {
  // if auth ldap.js (se tiver logado)
  res.render('auth/changepwd', { title: 'Change Password' });
  // else(){
  //   erro
  //   res.render('index', { title: 'Junket' });
  // }
});

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/');
  });

});

module.exports = router;


