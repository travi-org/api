# API for Travi.org

<!--status-badges start -->

[![Build Status](https://img.shields.io/travis/com/travi-org/api/master.svg?style=flat)](https://travis-ci.com/travi-org/api)
[![Coverage Status](https://img.shields.io/coveralls/travi-org/api.svg?style=flat)](https://coveralls.io/r/travi-org/api?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/travi-org/api.svg?style=flat)](https://codeclimate.com/github/travi-org/api)
[![travi.org-admin/travi-api Pact Status](https://pact-api.travi.org/pacts/provider/travi-api/consumer/travi.org-admin/latest/badge.svg?style=flat)](https://pact-api.travi.org)

<!--status-badges end -->

<!--consumer-badges start -->

[![license](https://img.shields.io/github/license/travi-org/api.svg)](LICENSE)

<!--consumer-badges end -->

## Try It

You can interact with the api through the [Swagger UI instance](https://api.travi.org/documentation)
hosted with the API.

## Project Goals

I'm using this as an opportunity to learn how to apply a number of core concepts
of api development to node.

- [x] <abbr title="Hypertext Application Language">[HAL](http://stateless.co/hal_specification.html)</abbr>
  compatible Hypermedia/HATEOAS API
  - [Hapi](http://hapijs.com/)
  - [Halacious](https://github.com/bleupen/halacious)
- [ ] Access Control
  - [x] Limited read-only access with no auth context
  - [ ]  Privilege elevation for advanced actions
    - Either OAuth or [Oz](https://github.com/hueniverse/oz) for authorization
- [ ] Consumer Driven Contracts
  - [ ] Pact Provider
  - [x] Leverage the [broker](https://pact-api.travi.org) the share pacts from consumers

## Contribution

<!--contribution-badges start -->

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![greenkeeper badge](https://badges.greenkeeper.io/travi-org/api.svg)

<!--contribution-badges end -->

### Environment variables

This application uses environment variables for certain configuration. For local
development, the npm script `dev` expects a `.env` file to exist, as described
[here](https://devcenter.heroku.com/articles/heroku-local#set-up-your-local-environment-variables)
and contain the necessary variable definitions.

### Database

Postgres is used as the database.

#### Initial setup for this application

```bash
$ psql -c 'create database travi_api;'
```

#### Management with Homebrew

##### Installation

```bash
$ brew install postgresql
```

##### Troubleshooting

###### Ensure the service is started

```bash
$ brew services list
$ brew services start postgresql
```

###### View the log

```bash
$ tail /usr/local/var/postgres/server.log
```

###### Remove the pid file

```sh
$ rm /usr/local/var/postgres/postmaster.pid
```

###### Rebuild everything

```bash
$ rm -rf /usr/local/var/postgres
$ initdb -D /usr/local/var/postgres
$ createdb
```
