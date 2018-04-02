const Metalsmith = require('metalsmith')
const inPlace = require('metalsmith-in-place')
const collections = require('metalsmith-collections')
const permalinks = require('metalsmith-permalinks')
const debug = require('metalsmith-debug')

Metalsmith(__dirname)
  .metadata({
    site: {
      title: 'Cryptographic Crypt'
    },
    description: "It's about saying »Hello« to the World.",
    generator: 'Metalsmith',
    input: {placeholder: 'ATTACK AT DAWN', rows: 3}
    // url: 'http://www.metalsmith.io/'
  })
  .source('./source')
  .destination('./public')
  .clean(true)
  .use(collections({
    pages: {
      pattern: '*/*.njk'
    }
  }))
  .use(inPlace({
    // pattern: '*.njk',
    engineOptions: {
      path: __dirname + '/source',
      root: __dirname
    }
  }))
  .use(permalinks({
    pattern: ':permalink'
  }))
  .use(debug())
  .build(function (err, files) {
    if (err) { throw err }
  })
