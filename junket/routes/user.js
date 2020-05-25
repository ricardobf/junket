var express = require('express');
var router = express.Router();



router.post('/', function(req, res, next) {
  const { login, password } = req.body;


  res.render("user/user", {
    title: "Welcome",
    login,
    password
  });
});

module.exports = router;
