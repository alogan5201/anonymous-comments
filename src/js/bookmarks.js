
async function getIp() {
  const query = await fetch(`https://ipapi.co/json`, { method: "GET" });
  if (query.status !== 200) {
    alert(query.status);
    return;
  }

  const data = await query.json();
  let lat = data.latitude
  let lon = data.longitude
  let obj = { lat: lat, lon: lon }
  localStorage.setItem("userlocation", `${JSON.stringify(obj)}`)

  return data;
}



// commentReply( name, id, date, message)
// comment (id, name, date, message, likes, dislikes)

Date.prototype.toShortFormat = function() {
  let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let day = this.getDate()

  let monthIndex = this.getMonth()
  let monthName = monthNames[monthIndex]

  let year = this.getFullYear()

  return `${monthName} ${year}`
}

let today = new Date()
const prettyDate = today.toShortFormat()
const siteTitle = $('#site-title').text()

const path = window.location.pathname

$(function() {

  /**
   *---------------------------------------------------------------------
   * !! MAP SCRIPT START
   * -------------------------------------------------------------------
   */

function getBookmarkItems(){
  let bookmarks = localStorage.getItem('bookmarks') ? JSON.parse(localStorage.getItem('bookmarks')) : null
if(bookmarks){
  const allTableRows = []
  for (let index = 0; index < bookmarks.length; index++) {
    const element = bookmarks[index];
    console.log(element)
    let tr = `
    <tr class="bookmark-table-row">
    <th scope="row">${element.name}</th>
    <td>${element.lat}</td>
    <td>${element.lon}</td>
  </tr>
  `
allTableRows.push(tr)

  }
  return allTableRows
}
}
function createTableBody(){
  let tableBody = getBookmarkItems()
 $(".bookmark-table").html(tableBody.join(''));
}
createTableBody()
  L.mapbox.accessToken = 'pk.eyJ1IjoibmluYTU2ODIiLCJhIjoiY2xoNnFvYTJwMDhzczNtcXFiZ3c4Y3BoYiJ9.QsbZzVVQmdUqEpce-hq49A'
  const map = L.mapbox.map('map', null, {zoomControl: false}).setView([38.25004425273146, -85.75576792471112], 11)

  L.mapbox
    .styleLayer('mapbox://styles/mapbox/streets-v11')
    .addTo(map) // add your tiles to the map
    .once('load', finishedLoading)

  function finishedLoading() {
    // first, toggle the class 'done', which makes the loading screen
    // fade out

  }
  $(".bookmark-table").on("click",".bookmark-table-row", function (e) {
    e.preventDefault()
    console.log(e)
    let lat = $(this).find('td:nth-child(2)').text()
    let lon = $(this).find('td:nth-child(3)').text()
    map.fitBounds([[lat, lon]], {padding: [50, 50], maxZoom: 13})
    marker
      .setLatLng([lat, lon])
    console.log(lat,lon)
  });
  $('#mapTest').on('click', function(e) {
    e.preventDefault()
    
  })
  const marker = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',

      'marker-color': 'blue',
    }),
  }).addTo(map)
  var locationControl = L.control
    .locate({
      circleStyle: {opacity: 0},
      followCircleStyle: {opacity: 0},
      drawCircle: false,
      follow: false,
      setView: false,
      remainActive: false,
      showPopup: false,
      locateOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
      },
    })
    .addTo(map)

  map.on('locationfound', async function(e) {
    let lat = e.latitude
    let lon = e.longitude


    setTimeout(() => {
      map.fitBounds([[lat, lon]], {padding: [50, 50], maxZoom: 13})
      marker
        .setLatLng([lat, lon])
   
    }, 1000)
  })

  map.on('locationerror', async function(e) {
    locationControl.stop()
    // TODO UPDATE other pages with ip address fallback
    let icon = locationControl._icon
    $(icon).css('background-color', 'hsl(217deg 93% 60%)')
    const ip = await getIp()

    if (ip.latitude) {
      let lat = ip.latitude
      let lon = ip.longitude

    

      //hsl(217deg 93% 60%)
      let icon = locationControl._icon
      $(icon).css('background-color', 'hsl(217deg 93% 60%)')

 
   
      map.fitBounds([[lat, lon]], {padding: [50, 50], maxZoom: 13})


      const data = {
        lat: lat,
        lon: lon,
      }

      // # TODO: ADD to all converts

      marker
        .setLatLng([lat, lon])
      setTimeout(() => {
        $(icon).css('background-color', 'black')
      }, 1000)
    }
  })

})
