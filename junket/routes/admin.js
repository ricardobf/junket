var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const login = req.session.name;
  const password = req.session.password;
  const memberOf = req.session.memberOf;
  const firstName = req.session.firstName;
  const adminMail = req.session.adminMail;
  
  if(req.session.name) {
      res.render("admin/admin", {title: "Welcome", login, password, memberOf, firstName, adminMail});
  }
  else {
    res.status(404);
    res.render("error/notfound");
  }

});

router.get('/register', function(req, res, next) {
  if(req.session.name) {
    res.render('admin/register', { title: 'Create User' });
  }
  else {
    res.status(404);
    res.render("error/notfound");
  }
});

router.post('/register', function(req, res, next) {
  if(req.session.name) {
    res.render('admin/register', { title: 'Create User' });

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

module.exports = router;