# Junket 

## Open Source Web App Directory Manager

[![GitHub license](https://img.shields.io/github/license/ricardobf/junket)](https://github.com/ricardobf/junket/blob/production/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/ricardobf/junket)](https://github.com/ricardobf/junket/issues)
[![GitHub stars](https://img.shields.io/github/stars/ricardobf/junket)](https://github.com/ricardobf/junket/stargazers)

Junket is an open source web application for managing LDAP/Active Directory.


This repository uses Terraform and GitHub Actions to deploy a simple TODO application to AWS.
The backend was performed in Python 3.8 and FastAPI, can be deployed using docker (local),
docker-compose (local) or via Terraform (/infra folder) and GitHub Actions (image deploy) to AWS ECS. 
The frontend was developed using React and can be deployed to AWS S3 (static website) via Terraform 
(bucket configuration) and GitHub Actions (deploy build to bucket).

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
LDAP_SERVER="ldap://www.zflexldap.com"
SUFFIX="dc=zflexsoftware,dc=com"
READER_DN="cn=ro_admin,ou=sysadmins,dc=zflexsoftware,dc=com"
READER_MAIL="ro_admin@zflexsoftware.com"
READER_PWD="zflexpass"
```

2. Run `docker run` command:
```shell
# run --name junket -p 8080:8080 --env-file ./env.list -d ricardob/junket
```

3. On your browser navigate to [localhost](http://localhost)


#### Install and run `junket` locally (Using npm): <a name="installationnpm"></a>

1. Clone Junket repository:
```shell
# git clone git@github.com:ricardobf/junket.git
```

2. Navigate to junket package folder:
```shell
# cd junket/junket
```

3. Change env file according to your LDAP/AD server:
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

See [LICENSE](https://github.com/ricardobf/junket/LICENSE).
