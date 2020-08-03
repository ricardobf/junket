var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
const assert = require('assert');
var moment = require('moment');


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
      // console.log(entry.object);        

      
      var principalName = entry.object.name;
      var fullname = principalName.split(' ');
      var firstName = fullname[0];

      function ldapToJS(n) {
        return new Date(n/1e4 - 1.16444736e13);
      }
      var accountExpires = ldapToJS(entry.object.accountExpires).toISOString();
      accountExpires = accountExpires.substring(0,10);
      var a = moment(accountExpires); 
      a = a.endOf('day').fromNow();  
      var memberOf = entry.object.memberOf;
      memberOf = memberOf.toString().split('=');
      memberOf = memberOf.toString().split(',');
      memberOf = memberOf.filter(e => e !== 'DC');
      memberOf = memberOf.filter(e => e !== 'ufmg');
      memberOf = memberOf.filter(e => e !== 'br');
      memberOf = memberOf.filter(e => e !== 'sense');
      memberOf = memberOf.filter(e => e !== 'Sense');
      memberOf = memberOf.filter(e => e !== 'CN');
      memberOf = memberOf.filter(e => e !== 'Users');
      memberOf = memberOf.filter(e => e !== 'dcc');
      memberOf = memberOf.filter(e => e !== 'NPS');
      memberOf = memberOf.filter(e => e !== 'OU');
      console.log(memberOf);
      var memberOfGroups = [];
      for(var i = 0; i < memberOf.length; i++) {
        memberOfGroups[i] = memberOf[i].toLowerCase();
      }

      req.session.name = login;
      req.session.password = password;
      req.session.memberOf = memberOfGroups;
      req.session.principalName = entry.object.name;
      req.session.firstName = firstName;
      // req.session.accountExpires = accountExpires;
      req.session.accountExpires = a;

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


