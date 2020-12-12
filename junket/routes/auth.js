var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
const assert = require('assert');
var moment = require('moment');


const ldap_port = process.env.LDAP_PORT;
const ldap_server = process.env.LDAP_SERVER + ":" + ldap_port;
const suffix = process.env.SUFFIX;
const readerDN = process.env.READER_DN;
const readerMail = process.env.READER_MAIL;
const readerPwd = process.env.READER_PWD;

/* GET home page. */
router.get('/signin', (req, res, next) => {
  res.render('auth/signin', { title: 'Junket' });
});

router.post('/signin', (req, res, next) => {

  const { login, password } = req.body;

  var result = "";
	
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

      var searchList = [];
      var memberOfList = [];
      
      if (err) {
        result += "Search failed " + err;
        res.send(result);
        return;
      }
      
      searchRes.on("searchEntry", (entry) => {
        result += "Found entry: " + entry + "\n";
        searchList.push(entry);
      });

      searchRes.on("error", (err) => {
        result += "Search failed with " + err;
        res.send(result);
      });

      searchRes.on("end", (retVal) => {

        result += "DN:" + searchList[0].objectName + "\n";
        result += "Search retval:" + retVal + "\n";					
						
        client.search(suffix, {filter:`(member=${searchList[0].objectName})`, scope:"sub"},
          (err, searchRes) => {
            
          if (err) {
            result += "Group search failed " + err;
            res.send(result);
            return;
          }
    
          searchRes.on("searchEntry", (entry) => {
            result += "Group search found entry: " + entry.objectName + "\n";
            memberOfList.push(entry.objectName.split(",", 1).toString().substring(3));
          });

          searchRes.on("error", (err) => {
            result += "Group search failed with " + err;
            res.send(result);
          });
            
        });
       
        client.bind(searchList[0].objectName, password, function(err) {

          if (err){
            result += "Bind with real credential error: " + err;            
            res.write('<h1>Wrong login credentials.</h1>');
            res.end('<a href='+'/'+'>Login</a>');
          }
          else{
            result += "Bind with real credential is a success";
            
            req.session.name = login;
            req.session.password = password;
            req.session.memberOf = memberOfList;
            req.session.principalName = searchList[0].attributes[1]._vals.toString('utf8');
            req.session.firstName = searchList[0].attributes[1]._vals.toString('utf8');
            req.session.adminMail = readerMail;

            if(login == "guest1"){
              req.session.admin = true;
              res.redirect('/admin');  
            }
            else{
              req.session.admin = false;
              res.redirect('/user');
            }
          }
        });
      });	
		});
	}); 
});

router.get('/signup', function(req, res, next) {
  res.render('auth/signup', { title: 'Junket' });
});

router.post('/signup', function(req, res, next) {
  const { login, email, name, lastName, password, cPassword } = req.body;

  var client = ldap.createClient({
    url: URL
  });

  var newUser = {
    cn: login,
    sn: name + lastName,
    mail: email,
    userPassword: password
  }

  if(password == cPassword){
    client.bind(user,pass,function(err){
      client.add(readerDN, newUser, callback);
    });
  }

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

router.post('/changepwd', function(req, res, next) {
  if(req.session.name) {
    res.render('auth/changepwd', { title: 'Change Password' });

    const { oldPassword, newPassword, cnewPassword  } = req.body;

    var client = ldap.createClient({
      url: ldap_server
    });

    client.bind(readerDN, oldPassword, function (err, result) {
      if (err) {
        console.error('error: ' + err);
      } else {
        client.search(suffix, {
          filter: filter,
          attributes: 'dn',
          scope: 'sub'
        }, function(err, res) {
          res.on('searchEntry', function(entry) {
            var userDN = entry.object.dn;
            if(newPassword == cnewPassword){
              client.modify(userDN, [
                new ldap.Change({
                  operation: 'delete',
                  modification: {
                    unicodePwd: encodePassword(oldPassword)
                  }
                }),
                new ldap.Change({
                  operation: 'add',
                  modification: {
                    unicodePwd: encodePassword(newPassword)
                  }
                })
              ], function(err) {
                if (err) {
                  console.log(err.code);
                  console.log(err.name);
                  console.log(err.message);
                  client.unbind();
                }
                else {
                  console.log('Password changed!');
                }
              });
            }
          });
          res.on('error', function(err) {
            console.error('error: ' + err.message);
          });
          res.on('end', function(result) {
            console.log('status: ' + result.status);
          });
        });
      }
    });
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


