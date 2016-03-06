travi-api
=========

[![Build Status](https://img.shields.io/travis/travi/travi-api.svg?style=flat)](https://travis-ci.org/travi/travi-api)
[![Coverage Status](https://img.shields.io/coveralls/travi/travi-api.svg?style=flat)](https://coveralls.io/r/travi/travi-api?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/travi/travi-api.svg?style=flat)](https://codeclimate.com/github/travi/travi-api)
[![Dependency Status](https://img.shields.io/gemnasium/travi/travi-api.svg?style=flat)](https://gemnasium.com/travi/travi-api)

## Project Goals

I'm using this as an opportunity to learn how to apply a number of core concepts of api development to node.

- [x] <abbr title="Hypertext Application Language">[HAL](http://stateless.co/hal_specification.html)</abbr> compatible Hypermedia/HATEOAS API
    * [Hapi](http://hapijs.com/)
    * [Halacious](https://github.com/bleupen/halacious)
- [ ] Access Control
    * Limited read-only access with no auth context
    * Privilege elevation for advanced actions
        * Either OAuth or [Oz](https://github.com/hueniverse/oz) for authorization

## Local Development

This application uses environment variables for certain configuration. For local development, the npm script `dev` expects
a `.env` file to exist as described [here](https://devcenter.heroku.com/articles/heroku-local#set-up-your-local-environment-variables)
and contain the necessary variable definitions.
