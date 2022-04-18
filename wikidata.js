const wdk = require('wikidata-sdk')

const fetch = require('node-fetch')


async function getData(){


const url = wdk.getEntities({
  ids: [ 'Q1', 'Q5', 'Q571' ],
  languages: [ 'en', 'fr', 'de' ], // returns all languages if not specified
  props: [ 'info', 'claims' ], // returns all data if not specified
  format: 'xml', // defaults to json
  redirections: false // defaults to true
})

console.log(url)
}

getData()
