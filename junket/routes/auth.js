var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
const assert = require('assert');
var moment = require('moment');


const ldap_port = 389;
const ldap_server = "ldap://www.zflexldap.com";
const suffix = "dc=zflexsoftware,dc=com";
const readerDN = "cn=ro_admin,ou=sysadmins,dc=zflexsoftware,dc=com";
const readerPwd = "zflexpass";

/* GET home page. */
router.get('/signin', (req, res, next) => {
  res.render('auth/signin', { title: 'Junket' });
});

router.post('/signin', (req, res, next) => {

  const { login, password } = req.body;

  var result = "";    // To send back to the client
	
	var client = ldap.createClient({
      url: ldap_server
	});
	
	client.bind(readerDN, readerPwd, function(err) {
		if (err) {
			result += "Reader bind failed " + err;
			res.send(result);
			return;
		}
		
		result += "Reader bind succeeded\n";
		
		var filter = `(uid=${login})`;
		
		result += `LDAP filter: ${filter}\n`;
		
		client.search(suffix, {filter:filter, scope:"sub"}, (err, searchRes) => {

      var search = "";
      
      if (err) {
        result += "Search failed " + err;
        res.send(result);
        return;
      }
      
      searchRes.on("searchEntry", (entry) => {

        result += "Found entry: " + entry + "\n";
        search = entry;

      });

      searchRes.on("error", (err) => {
        result += "Search failed with " + err;
        res.send(result);
      });
      
      searchRes.on("end", (retVal) => {

        result += "DN:" + search.objectName + "\n";
        result += "Search retval:" + retVal + "\n";					
        
            
        client.bind(search.objectName, password, function(err) {

          console.log(search);
          var teste = search.attributes;
          console.log(teste);

          if (err) 
            result += "Bind with real credential error: " + err;
          else{
            result += "Bind with real credential is a success";
            
            req.session.name = login;
            req.session.password = password;
            req.session.memberOf = login;
            req.session.principalName = search.givenName;
            req.session.firstName = search.objectName;
            req.session.accountExpires = "a";
            // If user:
            res.redirect('/user');
            // If admin:
            // res.redirect('/admin');  
          }
        });  // client.bind (real credential)

      });   // searchRes.on("end",...)
				
		});   // client.search
		
	}); // client.bind  (reader account)
	
}); // app.post("/ldap"...)



  //MOSTRAR MENSAGEM DE ERRO 

  
  // res.write('<h1>Wrong login credentials.</h1>');
  // res.end('<a href='+'/'+'>Login</a>');


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


