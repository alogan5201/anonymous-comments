const jssoup = require( '@aghajari/jssoup' );
const ic = require('node-icecream')();
const fs = require('fs')



fs.readFile('/home/a/Desktop/geo-front-end/geo-front-end/src/views/pages/lat-lon-to-address/index.ejs', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
    const html = data
    const title = jssoup.load(html).getElementByTagName('title') // or .findFirst('title');
ic(title.plainText()) // JSSoup - node.js
ic(title.innerText()) // <b>JSSoup</b> - node.js
ic( title.outerText())
} )


const html = `<html><head><title><b>JSSoup</b> - node.js</title></head></html>`
const title = jssoup.load(html).getElementByTagName('title') // or .findFirst('title');
ic(title.plainText()) // JSSoup - node.js
ic(title.innerText()) // <b>JSSoup</b> - node.js
ic( title.outerText())