const Metalsmith = require('metalsmith')
const inPlace = require('metalsmith-in-place')
const debug = require('metalsmith-debug')

Metalsmith(__dirname)
  .source('./archetypes')
  .destination('./source')
