import { googleSignin } from "./firebase";

let url = window.location.href;
Date.prototype.toShortFormat = function () {
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
    "Dec",
  ];

  let day = this.getDate();

  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];

  let year = this.getFullYear();

  return `${monthName} ${year}`;
};

let today = new Date();

const prettyDate = today.toShortFormat();

window.addEventListener("DOMContentLoaded", (event) => {
  console.log("test");
  $("#spinner-box").addClass("d-none");
  $("main").removeClass("d-none");

  $("#google-sign-in").on("click", function (e) {
    e.preventDefault();

    $("main").addClass("d-none");

    $("#spinner-box").removeClass("d-none");
    googleSignin();
  });
});
