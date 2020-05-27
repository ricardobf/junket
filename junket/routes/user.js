var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // const { login, password } = req.body;
  const login = req.session.name;
  const password = req.session.password;
  var memberOf = req.session.memberOf;
  var principalName = req.session.principalName;
  // const accountExpires = req.session.accountExpires;

  var fullname = principalName.split(' ');
  var firstName = fullname[0];

  function ldapToJS(n) {
    return new Date(n/1e4 - 1.16444736e13);
  }
  var accountExpires = ldapToJS(req.session.accountExpires).toISOString();
  accountExpires = accountExpires.substring(0,10);
  // var memberOfGroups = memberOf.substring(0,10);
  // memberOfGroups = memberOfGroups.split('=');
  // memberOfGroups = memberOfGroups[1];

  // sess = req.session;
  
  if(req.session.name) {
      res.render("user/user", {title: "Welcome", login, password, memberOf, firstName, accountExpires});
  }
  else {
      res.status(404);
      res.render("error/notfound");
  }

});

module.exports = router;
