var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const { login, password } = req.body;
  // SE TIVER LOGADO
  res.render("admin/admin", {
    title: "Welcome",
    login,
    password
  });
  // SENAO
  // res.redirect('/auth/signin');
});

module.exports = router;