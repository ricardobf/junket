var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // const { login, password } = req.body;
  const login = req.session.name;
  const password = req.session.password;
  const memberOf = req.session.memberOf;
  const principalName = req.session.principalName;
  const adminMail = req.session.adminMail;
  // sess = req.session;
  
  if(req.session.name) {
      res.render("admin/admin", {title: "Welcome", login, password, memberOf, principalName, adminMail});
  }
  else {
      res.write('<h1>Please login first.</h1>');
      res.end('<a href='+'/'+'>Login</a>');
  }

});

module.exports = router;