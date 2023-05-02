/** letiables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import './firebase'

import 'picturefill'
import 'utils/errors'
import {Grid, html} from 'gridjs'
import {
  addBookmark,
  generateUID,
  getAddress,
  getLatLon,
  popupContent,
  toggleAltitude,
  toggleBookmark,
  closePopup,
} from 'utils/geocoder'
/*
var dropdownElementList = [].slice.call(
  document.querySelectorAll(".nav-bar-toggle")
);
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new Dropdown(dropdownToggleEl);
});
*/
let url = window.location.href
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

//const functions = getFunctions(app);

window.addEventListener('DOMContentLoaded', event => {
  console.log('index page loaded')

  const removeNullUndefined = obj => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))

  function helloWorld() {
    let savedBookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    let arr = []
    if (savedBookmarks) {
      for (let index = 0; index < savedBookmarks.length; index++) {
        const element = savedBookmarks[index]
        const newelm = removeNullUndefined(element)
        arr.push(newelm)
      }
      console.log(arr)
      const grid = new Grid({
        columns: [
          {
            id: 'uid',
            name: 'uid',
            hidden: true,
          },
          {
            address: 'address',
            name: 'address',
            hidden: true,
          },
          {
            address: 'dms',
            name: 'dms',
            hidden: true,
          },
          {
            address: 'altitude',
            name: 'altitude',
            hidden: true,
          },
          {
            id: 'name',
            name: 'Name',
            formatter: cell => html(`<a href='#'>${cell}</a>`),
            attributes: {
              scope: 'col',
            },
          },
          {
            id: 'date',
            name: 'date',
            formatter: cell => html(`<a href='#'>${cell}</a>`),
            attributes: {
              scope: 'col',
            },
          },

          {
            id: 'lat',
            name: 'Latitude',
            formatter: cell => html(`<a href='#'>${cell}</a>`),
            attributes: {
              scope: 'col',
            },
          },
          {
            id: 'lon',
            name: 'Longitude',
            formatter: cell => html(`<a href='#'>${cell}</a>`),
            attributes: {
              scope: 'col',
            },
          },
        ],
        search: true,
        data: arr,
        pagination: {
          enabled: true,
          limit: 8,
          summary: false,
        },
        style: {
          table: {
            'white-space': 'nowrap',
          },
          th: {
            'border-collapse': 'separate!important',
            'border-spacing': '0',

            border: '0 solid',

            'border-bottomwidth': '1px',

            ' padding': '.75rem',
            'border-color': '#dee2e6',
            'box-sizing': 'content-box',
            cursor: 'pointer',
            ' position': 'relative',
            'padding-right': '30px',
            'border-left': '0',
            'padding-left': '1.25rem',
            'border-top': '0',
          },
        },
        className: {
          td: 'my-td',
          table: 'table table-striped my-0 dataTable no-footer',
          thead: 'thead-light',
          pagination: 'btn-group',
          paginationButtonCurrent: 'btn btn-primary text-white',
          paginationButton: 'btn btn-outline border border-primary text-primary', //btn btn-outline-primary
          paginationButtonPrev: 'btn btn-outline-primary border border-primary text-primary',
          paginationButtonNext: 'btn btn-outline-primary border border-primary text-primary',
        },
      }).render(document.getElementById('grid-wrapper'))

      grid.on('rowClick', (...args) => test(args[1]._cells))
      //grid.on('cellClick', (...args) => console.log('cell: ' + JSON.stringify(args), args));

      return grid
    }
  }

  helloWorld()

  L.mapbox.accessToken = 'pk.eyJ1IjoibmluYTU2ODIiLCJhIjoiY2xoNnFvYTJwMDhzczNtcXFiZ3c4Y3BoYiJ9.QsbZzVVQmdUqEpce-hq49A'

  var mapboxTiles = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken,
    {
      attribution:
        '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      tileSize: 512,
      zoomOffset: -1,
    }
  )

  const map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([42.361, -74.0587], 10)

  const marker = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',

      'marker-color': 'blue',
    }),
  }).addTo(map)
  function test(row) {
    let uid = row[0].data
    console.log(uid)

    let local = JSON.parse(localStorage.getItem('bookmarks'))
    const found = local.find(element => element.uid == uid)
    console.log(found)
    let lat = found.lat
    let lon = found.lon
    console.log(lat, lon)

    map.fitBounds([[lat, lon]], {padding: [50, 50], maxZoom: 13})

    const p = `  <div id = "popupContent" class="row popupContent position-relative">
  <div class="col p-0 popup-content">

    <div class="card-body px-3 pt-2 pb-1">
      <ul class="list-group border-0">
       <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2"> ${found.name} </li>
        <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2"> ${found.address || ''} </li>
        <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2">  Latitude: <span
              class="lat">${found.lat} </span></li>
        <li class="list-group-item border-0 px-1 fs-6 py-0">
         Longitude:
               <span class="lon">${found.lon}</span></li>
        <li class="list-group-item border-0 px-1 fs-6 pt-0 pb-1 dms"> ${found.dms.lat} ${found.dms.lon}</li>
        
        <li class="list-group-item border-0 px-1 pt-1 fs-6 py-0 pb-1  border-top">
      

  </div>

</div> `
    var popup = L.popup({autoPan: true, keepInView: true}).setContent(p)
    marker
      .setLatLng([lat, lon])
      .bindPopup(popup)
      .openPopup()
  }
})
