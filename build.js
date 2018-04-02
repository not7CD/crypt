const Metalsmith = require('metalsmith')
const inPlace = require('metalsmith-in-place')
const collections = require('metalsmith-collections')
const permalinks = require('metalsmith-permalinks')
const debug = require('metalsmith-debug')
const sass = require('metalsmith-sass')
const tags = require('metalsmith-tags')

Metalsmith(__dirname)
  .metadata({
    site: {
      title: 'Cryptographic Crypt'
    },
    description: 'For all your once-in-a-while cryptographic work.',
    generator: 'Metalsmith',
    input: {placeholder: 'ATTACK AT DAWN', rows: 2}
    // url: 'http://www.metalsmith.io/'
  })
  .source('./source')
  .destination('./public')
  .clean(true)
  .use(sass({
    outputDir: 'css/'
  }))
  .use(collections({
    pages: {
      // pattern: '*/*.njk'
      sortBy: 'title'
    }
  }))
  .use(tags())
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
