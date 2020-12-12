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

1. [Requirements](#requirements)
1. [Installation](#installation)
1. [License](#license)

### Requirements

- Docker;
- Running LDAP/AD server;
- User with bind privilegies;

### Installation

### Install and run only the `junket` module locally:

Using Docker:

1. Navigate to backend folder:
```shell
# cd backend
```

2. Run `docker run` command:
```shell
# docker run
```

3. On your browser navigate to [localhost](http://localhost)


## License

See [LICENSE](https://github.com/ricardobf/junket/LICENSE).
