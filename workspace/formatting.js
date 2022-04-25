const head = {pageTitle: 'page'}


const header = {title: 'Latitude Longitude to Address', subtitle: 'Quickly find an Address from a set of coordinates.'}

const form = {
                  inputName: [
                    { name: 'Latitude', id: 'latInputField', type: 'number' },
                    { name: 'Longitude', id: 'lonInputField', type: 'number' },
                  ], 
                formid: "latlonForm",
                button: {name: 'Submit', type: 'submit', id: 'latlonGeocoderBtn'},
                output: [{name: 'Address', type: 'text', id: 'addressInput'}]
                }

const replace = (str, numSpaces = 1) => str.replaceAll('-', ' '.repeat(numSpaces));
const replaceTo = (str, numSpaces = 1) => str.replaceAll('To', 'to'.repeat(numSpaces));
const uppercaseWords = (str) => str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
const countWords = (str) => str.trim().split(/\s+/).length;

let one = replace("lat-lon-to-address")
uppercaseWords(one); 
const strings = ["address-distance",
"address-to-latlon",
"bookmarks",
"converter",
"dms-to-latlon",
"lat-lon-distance",
"lat-lon-to-address",
"latlon-to-dms",
"login",
"movies",
"pricing",
"travel",
"weather",]
function formatSlug(item){
  const replaceWord = (str, numSpaces = 1) => str.replaceAll("Latlon", "Lat Lon".repeat(numSpaces));
  let first = replace(item)
  let second = uppercaseWords(first)
  let result = replaceTo(second)
 
  if(result.includes("Latlon")){

    let newWord = replaceWord(result)
    
    return newWord
  }

  return result
  }

function getTitle(){

  let arr = []
  for (let index = 0; index < strings.length; index++) {
  const element = strings[index];
 let formatted = formatSlug(element)
 arr.push(formatted)
}
  return arr
}
const prettyTitle = getTitle()
const merge = (a, b) => [...new Set(a.concat(b))];

let test = merge(strings, prettyTitle)

function createObJ(){
  let result = []
    for (let index = 0; index < strings.length; index++) {
  const slug = strings[index];
  const title = prettyTitle[index]
  
  let obj = {slug:slug, title: title }
  result.push(obj)
      
}
  return result
}
let ax = createObJ()
const toObject = (arr, key) => Object.fromEntries(arr.map((it) => [it[key], it]));
 let newObject = toObject(
   ax,
    'slug'
);
const formattedObj = {
  "address-distance": {
    "slug": "address-distance",
    "title": "Address Distance"
  },
  "address-to-latlon": {
    "slug": "address-to-latlon",
    "title": "Address to Lat Lon"
  },
  "bookmarks": {
    "slug": "bookmarks",
    "title": "Bookmarks"
  },
  "converter": {
    "slug": "converter",
    "title": "Converter"
  },
  "dms-to-latlon": {
    "slug": "dms-to-latlon",
    "title": "Dms to Lat Lon"
  },
  "lat-lon-distance": {
    "slug": "lat-lon-distance",
    "title": "Lat Lon Distance"
  },
  "lat-lon-to-address": {
    "slug": "lat-lon-to-address",
    "title": "Lat Lon to Address"
  },
  "latlon-to-dms": {
    "slug": "latlon-to-dms",
    "title": "Lat Lon to Dms"
  },
  "login": {
    "slug": "login",
    "title": "Login"
  },
  "movies": {
    "slug": "movies",
    "title": "Movies"
  },
  "pricing": {
    "slug": "pricing",
    "title": "Pricing"
  },
  "travel": {
    "slug": "travel",
    "title": "Travel"
  },
  "weather": {
    "slug": "weather",
    "title": "Weather"
  }
}
const getValue = (path, obj) => path.split('.').reduce((acc, c) => acc && acc[c], obj);
getValue('address-to-lat-lon.title', formattedObj); // 'Hello World';


