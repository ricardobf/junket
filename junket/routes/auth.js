var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
const assert = require('assert');






const server = "orb.sense.dcc.ufmg.br"; // 10.167.232.60s
// const server = "10.167.232.60";

const adSuffix = "dc=sense,dc=dcc,dc=ufmg,dc=br"; //dc=sms,dc=br
// const adSuffix = "dc=sms,dc=br"; 

// Create client and bind to AD
const client = ldap.createClient({
    url: `ldap://${server}`
});


/* GET home page. */
router.get('/signin', function(req, res, next) {
  res.render('auth/signin', { title: 'Junket' });
});

router.post('/signin', function(req, res, next) {
  const { login, password } = req.body;
  const userPrincipalName = login.concat("@sense.dcc.ufmg.br"); // sms.br
  // const userPrincipalName = login.concat("@sms.br"); // sms.br

  client.bind(userPrincipalName,password,err => {
    assert.ifError(err);
  });

  // Search AD for user
  const searchOptions = {
      scope: "sub",
      filter: `(userPrincipalName=${userPrincipalName})`
  };

  client.search(adSuffix,searchOptions,(err,data) => {
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


      res.redirect('/user');
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
  
 //IF VALIDADO COM O LDAP (eu acho)
//  req.session.name = login;
//  res.redirect('/user', login, password);
  //SENAO
  //erro




  // if auth ldap.js (se tiver logado)
  // res.redirect('/user', 
  // login,
  // password);
  // else(){
  //   erro
  //   res.render('index', { title: 'Junket' });
  // }
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
    res.write('<h1>Please login first.</h1>');
    res.end('<a href='+'/'+'>Login</a>');
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      // Wrap up
      client.unbind( err => {
        assert.ifError(err);
      });
      res.redirect('/');
  });

});

module.exports = router;


