var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
const assert = require('assert');
var moment = require('moment');


const ldap_server = "www.zflexldap.com";
const ldap_port = 389;
const ldap_bind_dn = "cn=ro_admin,ou=sysadmins,dc=zflexsoftware,dc=com"
const ldap_bind_password = "zflexpass";

var client = ldap.createClient({ 
  url: `ldap://${ldap_server}:${ldap_port}`
});

/* GET home page. */
router.get('/signin', (req, res, next) => {
  res.render('auth/signin', { title: 'Junket' });
});

router.post('/signin', (req, res, next) => {
  const { login, password } = req.body;

  client.bind(ldap_bind_dn, ldap_bind_password, (err) => {
    assert.ifError(err);
  });

  // // Search AD for user
  var searchOptions = {
      scope: 'base'
  };

  client.search(ldap_bind_dn, searchOptions, (err,data) => {
    assert.ifError(err);

    data.on('searchEntry', entry => {
      console.log(entry.object);        


      req.session.name = login;
      req.session.password = password;
      req.session.memberOf = login;
      req.session.principalName = entry.object.name;
      req.session.firstName = login;
      req.session.accountExpires = "a";

      // If user:
      res.redirect('/user');
      // If admin:
      // res.redirect('/admin');
      
    });
    
    data.on('searchReference', referral => {
      console.log('referral: ' + referral.uris.join());
    });
    data.on('error', err => { 
      console.log(err) 
    });
    data.on('end', result => {
      console.log(result);
    });
  });

  client.unbind((err) => {
    assert.ifError(err);
    console.log("OIII");
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
      res.redirect('/');
  });

});

module.exports = router;


