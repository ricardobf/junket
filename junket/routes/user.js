var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const login = req.session.name;
  const password = req.session.password;
  const memberOf = req.session.memberOf;
  const firstName = req.session.firstName;
  const adminMail = req.session.adminMail;
  
  if(req.session.name) {
      res.render("user/user", {title: "Welcome", login, password, memberOf, firstName, adminMail});
  }
  else {
      res.status(404);
      res.render("error/notfound");
  }

});

module.exports = router;
