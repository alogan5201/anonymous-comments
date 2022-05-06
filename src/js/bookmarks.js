/** letiables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import { Grid, html } from "gridjs";
import "picturefill";
import "utils/errors";
import "./firebase";

let url = window.location.href;
Date.prototype.toShortFormat = function() {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  let day = this.getDate();

  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];

  let year = this.getFullYear();

  return `${monthName} ${year}`;
};

let today = new Date();

const prettyDate = today.toShortFormat();

//const functions = getFunctions(app);

window.addEventListener("DOMContentLoaded", event => {
  console.log("index page loaded");
  let localBookmarks = localStorage.getItem("bookmarks");
  if (localBookmarks) {
    init();
  } else {
    //$("#no-content-wrapper").toggleClass("d-none");
  }
  function init() {
    $("#bookmark-ui-wrapper").removeClass("d-none");
    let pagContainer = $(".pagination-container");

    const removeNullUndefined = obj =>
      Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

    function helloWorld() {
      let savedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
      let arr = [];
      if (savedBookmarks) {
        for (let index = 0; index < savedBookmarks.length; index++) {
          const element = savedBookmarks[index];
          const newelm = removeNullUndefined(element);
          arr.push(newelm);
        }
        console.log(arr);
        const grid = new Grid({
          columns: [
            {
              id: "uid",
              name: "uid",
              hidden: true
            },
            {
              address: "address",
              name: "address",
              hidden: true
            },
            {
              address: "dms",
              name: "dms",
              hidden: true
            },
            {
              address: "altitude",
              name: "altitude",
              hidden: true
            },
            {
              id: "name",
              name: "Name",
              formatter: cell => html(`<a href='#'>${cell}</a>`),
              attributes: {
                scope: "col"
              }
            },
            {
              id: "date",
              name: "date",
              formatter: cell => html(`<a href='#'>${cell}</a>`),
              attributes: {
                scope: "col"
              }
            },

            {
              id: "lat",
              name: "Latitude",
              formatter: cell => html(`<a href='#'>${cell}</a>`),
              attributes: {
                scope: "col"
              }
            },
            {
              id: "lon",
              name: "Longitude",
              formatter: cell => html(`<a href='#'>${cell}</a>`),
              attributes: {
                scope: "col"
              }
            }
          ],
          search: true,
          data: arr,
          pagination: {
            enabled: true,
            limit: 8,
            summary: false
          },
          className: {
            container: "card h-100 table-container ",
            header: "card-header bg-white py-4",
            td: "my-td",
            table: "table text-nowrap",
            thead: "thead-light",
            pagination: "pagination-container",
            paginationButtonCurrent: "bg-primary text-white",
            paginationButton: "btn btn-outline-primary",
            paginationButtonPrev: "btn btn-outline-primary",
            paginationButtonNext: "btn btn-outline-primary"
          }
        }).render(document.getElementById("grid-wrapper"));

        grid.on("rowClick", (...args) => test(args[1]._cells));
        //grid.on('cellClick', (...args) => console.log('cell: ' + JSON.stringify(args), args));
        let pagContainer = $(".pagination-container");
        if (
          pagContainer &&
          $(pagContainer)
            .children()
            .first()
            .hasClass("btn-group")
        ) {
          if ($(".table-container").hasClass("d-none")) {
            $(".table-container").removeClass("d-none");
          }
        }
        setTimeout(() => {
          let pagContainer = $(".pagination-container");
          $(pagContainer)
            .children()
            .first()
            .addClass("btn-group");
        }, 500);

        return grid;
      }
    }

    helloWorld();

    var map = L.map("map").setView([42.361, -74.0587], 10);

    const layer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    );

    layer.addTo(map);

    const marker = L.marker([0, 0]).addTo(map);

    map.zoomOut(1);
  }

  function test(row) {
    let uid = row[0].data;
    console.log(uid);

    let local = JSON.parse(localStorage.getItem("bookmarks"));
    const found = local.find(element => element.uid == uid);
    console.log(found);
    let lat = found.lat;
    let lon = found.lon;
    console.log(lat, lon);
    const p = `  <div id = "popupContent" class="row popupContent position-relative">
  <div class="col p-0 popup-content">

    <div class="card-body px-3 pt-2 pb-1">
      <ul class="list-group border-0">
       <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2"> ${
         found.name
       } </li>
        <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2"> ${found.address ||
          ""} </li>
        <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2">  Latitude: <span
              class="lat">${found.lat} </span></li>
        <li class="list-group-item border-0 px-1 fs-6 py-0">
         Longitude:
               <span class="lon">${found.lon}</span></li>
        <li class="list-group-item border-0 px-1 fs-6 pt-0 pb-1 dms"> ${
          found.dms.lat
        } ${found.dms.lon}</li>
        
        <li class="list-group-item border-0 px-1 pt-1 fs-6 py-0 pb-1  border-top">
      

  </div>

</div> `;

    setTimeout(() => {
      map.flyTo([lat, lon]);
    }, 700);

    setTimeout(() => {
      var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);
      marker
        .setLatLng([lat, lon])
        .bindPopup(popup)
        .openPopup();

      map.zoomOut();
    }, 1000);
  }
});
