var ldap = require('ldapjs');
const assert = require('assert');




function auth(login, password){
    // LDAP Connection Settings
  const server = "orb.sense.dcc.ufmg.br"; // 10.167.232.60s
  const userPrincipalName = login.concat("@sense.dcc.ufmg.br"); // sms.br
  const adSuffix = "dc=sense,dc=dcc,dc=ufmg,dc=br"; //dc=sms,dc=br
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

    
}

