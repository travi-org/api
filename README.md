# travi-api

[![license](https://img.shields.io/github/license/travi/travi-api.svg)](LICENSE)
[![Build Status](https://img.shields.io/travis/travi/travi-api.svg?style=flat)](https://travis-ci.org/travi/travi-api)
[![Coverage Status](https://img.shields.io/coveralls/travi/travi-api.svg?style=flat)](https://coveralls.io/r/travi/travi-api?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/travi/travi-api.svg?style=flat)](https://codeclimate.com/github/travi/travi-api)
[![Dependency Status](https://img.shields.io/gemnasium/travi/travi-api.svg?style=flat)](https://gemnasium.com/travi/travi-api)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![greenkeeper badge](https://badges.greenkeeper.io/GainCompliance/hapi-auth-stormpath.svg)

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

## Local Development

### Environment variables

This application uses environment variables for certain configuration. For local
development, the npm script `dev` expects a `.env` file to exist, as described
[here](https://devcenter.heroku.com/articles/heroku-local#set-up-your-local-environment-variables)
and contain the necessary variable definitions.

### Database

Postgres is used as the database.

If installed with homebrew, ensure that the services is started with

```bash
$ brew services start postgresql
```
