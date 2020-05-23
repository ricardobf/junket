var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Junket' });
});

module.exports = router;

router.post("/subscribe", function(req, res, next) {
  const { login, password } = req.body;

  // 1. Validate the user data
  // 2. Subscribe the user to the mailing list
  // 3. Send a confirmation email

  res.render("subscribed", {
    title: "You are subscribed",
    login,
    password
  });
});

router.post("/admin", function(req, res, next) {
  const { name, email } = req.body;

  // 1. Validate the user data
  // 2. Subscribe the user to the mailing list
  // 3. Send a confirmation email

  res.render("admin", {
    title: "Welcome",
    name,
    email
  });
});

router.post("/user", function(req, res, next) {
  const { login, password } = req.body;

  
  var client = ldap.createClient({
    url: 'ldap://orb.sense.dcc.ufmg.br:389'
  });

  client.bind('cn=ricardobarbosa', 'Junketws4', function(err) {
    assert.ifError(err);
  });

  res.render("user", {
    title: "Welcome",
    login,
    password
  });
});

