const Metalsmith = require('metalsmith')
const inPlace = require('metalsmith-in-place')
const collections = require('metalsmith-collections')
const permalinks = require('metalsmith-permalinks')
const debug = require('metalsmith-debug')
const sass = require('metalsmith-sass')
const tags = require('metalsmith-tags')
const metadataDir = require('metalsmith-metadata-directory')

Metalsmith(__dirname)
  .metadata({
    site: {
      title: 'Cryptographic Crypt',
      description: 'For all your once-in-a-while cryptographic work.'},
    generator: 'Metalsmith',
    input: {placeholder: 'ATTACK AT DAWN', rows: 2},
    url: 'https://crypt.not7cd.net/'
  })
  .source('./source')
  .destination('./public')
  .clean(true)
  .use(debug())
  .use(metadataDir({
    directory: './package.json'
  }))
  .use(sass({
    outputDir: 'css/'
  }))
  .use(collections({
    pages: {
      sortBy: 'title'
    }
  }))
  .use(tags())
  .use(inPlace({
    engineOptions: {
      path: __dirname + '/source',
      root: __dirname
    }
  }))
  .use(permalinks({
    relative: false,
    pattern: ':permalink'
  }))
  .build(function (err, files) {
    if (err) { throw err }
  })
