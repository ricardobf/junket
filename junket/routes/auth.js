var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
const assert = require('assert');


const server = "orb.sense.dcc.ufmg.br"; // 10.167.232.60s
// const server = "10.167.232.60";

const adSuffix = "dc=sense,dc=dcc,dc=ufmg,dc=br"; //dc=sms,dc=br
// const adSuffix = "dc=sms,dc=br"; 

// Create client and bind to AD
var client = ldap.createClient({
  url: `ldap://${server}`
});


/* GET home page. */
router.get('/signin', (req, res, next) => {
  res.render('auth/signin', { title: 'Junket' });
});

router.post('/signin', (req, res, next) => {
  const { login, password } = req.body;
  const userPrincipalName = login.concat("@sense.dcc.ufmg.br"); // sms.br
  // const userPrincipalName = login.concat("@sms.br"); // sms.br

  client.bind(userPrincipalName, password, (err) => {
    assert.ifError(err);
  });

  // Search AD for user
  var searchOptions = {
      scope: 'sub',
      filter: `(userPrincipalName=${userPrincipalName})`
  };

  client.search(adSuffix, searchOptions, (err,data) => {
    assert.ifError(err);

    data.on('searchEntry', entry => {
      // console.log(entry.object.givenName);
      // console.log(entry.object);
      // console.log(entry.object.accountExpires);          

      req.session.name = login;
      req.session.password = password;
      req.session.memberOf = entry.object.memberOf;
      req.session.principalName = entry.object.name;
      req.session.accountExpires = entry.object.accountExpires;

      // If user:
      res.redirect('/user');
      // If admin:
      // res.redirect('/admin');
    });
    
    data.on('searchReference', referral => {
      console.log('referral: ' + referral.uris.join());
    });
    data.on('error', err => {
      console.error('error: ' + err.message);
    });
    data.on('end', result => {
      console.log(result);
    });
  });




  //MOSTRAR MENSAGEM DE ERRO

  
  // res.write('<h1>Wrong login credentials.</h1>');
  // res.end('<a href='+'/'+'>Login</a>');

});

router.get('/signup', function(req, res, next) {
  res.render('auth/signup', { title: 'Junket' });
});

router.post('/signup', function(req, res, next) {
  const { login, password } = req.body;
  res.render('auth/signup', { title: 'Junket' });
});

router.get('/changepwd', function(req, res, next) {
  if(req.session.name) {
    res.render('auth/changepwd', { title: 'Change Password' });
  }
  else {
    res.status(404);
    res.render("error/notfound");
}
});

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      // Wrap up
      client.unbind((err) => {
        assert.ifError(err);
        console.log("OIII");
      });
      res.redirect('/');
  });

});

module.exports = router;


