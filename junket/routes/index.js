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
  const userPrincipalName = login.concat("@sense.dcc.ufmg.br");
  const adSuffix = "dc=sense,dc=dcc,dc=ufmg,dc=br"; // test.com
  var information = {accountExpires: '', principalName: '', memberOf: ''};

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
          console.log(entry.object.givenName);
          // console.log(entry.object);
          // console.log(entry.object.accountExpires);
          // accountExpires = Date(entry.object.accountExpires/1e4 - 1.16444736e13).toISOString();
          
          information.accountExpires = entry.object.accountExpires;
          information.principalName = entry.object.name;
          information.memberOf = entry.object.memberOf;
          // console.log(information.memberOf);
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

  // if(information.memberOf == 'CN=Administrators,CN=Builtin,DC=sense,DC=dcc,DC=ufmg,DC=br') {
  //   res.render("admin", {
  //     title: "Welcome",
  //     login,
  //     password,
  //     information
  //   });
  // }
  // else {
  //   res.render("user", {
  //     title: "Welcome",
  //     login,
  //     password,
  //     information
  //   });
  // }

  res.render("user", {
    title: "Welcome",
    login,
    password,
    information
  });
});

