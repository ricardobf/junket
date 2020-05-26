var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const { login, password } = req.body;
  sess = req.session;
  if(sess.email) {
      // res.write(`<h1>Hello ${sess.email} </h1><br>`);
      res.render("user/user", {title: "Welcome", login,password});
  }
  else {
      res.write('<h1>Please login first.</h1>');
      res.end('<a href='+'/'+'>Login</a>');
  }











  // const { login, password } = req.body;
  // // SE TIVER LOGADO
  // res.render("user/user", {
  //   title: "Welcome",
  //   login,
  //   password
  // });
  // // SENAO
  // // res.redirect('/auth/signin');
});

module.exports = router;
