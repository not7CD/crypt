var Metalsmith = require('metalsmith')
var inPlace = require('metalsmith-in-place')
var collections = require('metalsmith-collections')

Metalsmith(__dirname)
  .metadata({
    title: 'My Static Site & Blog',
    description: "It's about saying »Hello« to the World.",
    generator: 'Metalsmith',
    url: 'http://www.metalsmith.io/'
  })
  .source('./content')
  .destination('./public')
  .clean(false)
  .use(collections({
    pages: {
      pattern: '*/*.njk'
    }
  }))
  .use(inPlace({
    // pattern: '*.njk',
    engineOptions: {
      path: __dirname + '/content',
      root: __dirname
    }
  }))
  .build(function (err, files) {
    if (err) { throw err }
  })
