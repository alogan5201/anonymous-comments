const wdk = require('wikidata-sdk')

const fetch = require('node-fetch')
const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const MY_ACCESS_TOKEN = "pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA"
const stylesService = mbxStyles({ accessToken: MY_ACCESS_TOKEN });
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




async function mapimages(){


  return staticClient.getStaticImage({
  ownerId: 'mapbox',
  styleId: 'streets-v11',
  width: 200,
  height: 300,
  position: {
    coordinates: [12, 13],
    zoom: 4
  }
})
  .send()
  .then(response => {
    const image = response.body;
    console.log(image)
    return image
  });


}

mapimages()
