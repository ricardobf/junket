var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const login = req.session.name;
  const password = req.session.password;
  const memberOf = req.session.memberOf;
  const principalName = req.session.principalName;
  const firstName = req.session.firstName;
  const accountExpires = req.session.accountExpires;
  
  if(req.session.name) {
      res.render("user/user", {title: "Welcome", login, password, memberOf, firstName, accountExpires});
  }
  else {
      res.status(404);
      res.render("error/notfound");
  }

});

module.exports = router;
