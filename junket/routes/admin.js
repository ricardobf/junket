var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const login = req.session.name;
  const password = req.session.password;
  const memberOf = req.session.memberOf;
  const principalName = req.session.principalName;
  const adminMail = req.session.adminMail;
  
  if(req.session.name) {
      res.render("admin/admin", {title: "Welcome", login, password, memberOf, principalName, adminMail});
  }
  else {
    res.status(404);
    res.render("error/notfound");
  }

});

module.exports = router;