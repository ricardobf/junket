# Junket 

## Open Source Web App Directory Manager

[![GitHub license](https://img.shields.io/github/license/ricardobf/junket)](https://github.com/ricardobf/junket/blob/production/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/ricardobf/junket)](https://github.com/ricardobf/junket/issues)
[![GitHub stars](https://img.shields.io/github/stars/ricardobf/junket)](https://github.com/ricardobf/junket/stargazers)

Junket is an open source web application for managing LDAP/Active Directory.
This repository uses Node.js to deploy a web application.

This documentation is available on [junket.site](https://junket.site)

**Table of Contents**

- [Requirements](#requirements)
- [Installation](#installation)
  * [Using Docker](#installationdocker)
  * [Using npm](#installationnpm)
- [License](#license)

### Requirements

- Docker (Optional);
- npm (Optional);
- A running LDAP/AD server;
- User with bind privilegies;

### Installation

#### Install and run `junket` locally (Using Docker): <a name="installationdocker"></a>

1. Create env file according to your LDAP/AD server:
```shell
# vim env.list
```
  with content (example):
```
LDAP_PORT=389
LDAP_SERVER=ldap://www.zflexldap.com
SUFFIX=dc=zflexsoftware,dc=com
READER_DN=cn=ro_admin,ou=sysadmins,dc=zflexsoftware,dc=com
READER_MAIL=ro_admin@zflexsoftware.com
READER_PWD=zflexpass
```

2. Run `docker run` command:
```shell
# docker run --name junket -p 8080:8080 --env-file ./env.list -d ricardob/junket
```

3. On your browser navigate to [localhost](http://localhost)

The username for login in the example LDAP server is: `guest3`
Password: `guest3password`

If you want to access the admin page, you can login with the user: `guest1`
Password: `guest1password`


#### Install and run `junket` locally (Using npm): <a name="installationnpm"></a>

1. Clone Junket repository:
```shell
# git clone git@github.com:ricardobf/junket.git
```

2. Navigate to junket package folder:
```shell
# cd junket/junket
```

3. Create env file according to your LDAP/AD server:
```shell
# vim env.list
```
  with content (example):
```
LDAP_PORT=389
LDAP_SERVER="ldap://www.zflexldap.com"
SUFFIX="dc=zflexsoftware,dc=com"
READER_DN="cn=ro_admin,ou=sysadmins,dc=zflexsoftware,dc=com"
READER_MAIL="ro_admin@zflexsoftware.com"
READER_PWD="zflexpass"
```

4. Export env variables to local shell:
```shell
# export $(xargs < env.list)
```

5. Run npm install command:
```shell
# npm install
```

6. Run npm start command:
```shell
# npm start
```

7. On your browser navigate to [localhost](http://localhost)

## License

See [LICENSE](http://www.apache.org/licenses/LICENSE-2.0).
