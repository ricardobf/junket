var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
const assert = require('assert');

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


  // LDAP Connection Settings
  const server = "orb.sense.dcc.ufmg.br"; // 192.168.1.1
  const userPrincipalName = str.concat(login, "sense.dcc.ufmg.br");
  const adSuffix = "dc=sense,dc=dcc,dc=ufmg,dc=br"; // test.com

  // Create client and bind to AD
  const client = ldap.createClient({
      url: `ldap://${server}`
  });

  client.bind(userPrincipalName,password,err => {
      assert.ifError(err);
  });

  // Search AD for user
  const searchOptions = {
      scope: "sub",
      filter: `(userPrincipalName=${userPrincipalName})`
  };

  client.search(adSuffix,searchOptions,(err,res) => {
      assert.ifError(err);

      res.on('searchEntry', entry => {
          console.log(entry.object.name);
          console.log(entry.object);
      });
      res.on('searchReference', referral => {
          console.log('referral: ' + referral.uris.join());
      });
      res.on('error', err => {
          console.error('error: ' + err.message);
      });
      res.on('end', result => {
          console.log(result);
      });
  });

  // Wrap up
  client.unbind( err => {
      assert.ifError(err);
  });

  res.render("user", {
    title: "Welcome",
    login,
    password
  });
});

