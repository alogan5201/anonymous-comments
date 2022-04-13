/** Variables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import dompurify from "dompurify";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get,  onValue, push, query, orderByValue } from "firebase/database";

import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  connectAuthEmulator,
} from "firebase/auth";

import "picturefill";
import "utils/errors";
import { result } from "lodash";
let url = window.location.href;
Date.prototype.toShortFormat = function() {

  let monthNames =["Jan","Feb","Mar","Apr",
                    "May","Jun","Jul","Aug",
                    "Sep", "Oct","Nov","Dec"];

  let day = this.getDate();

  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];

  let year = this.getFullYear();

  return `${monthName} ${year}`;
}

// Now any Date object can be declared
let anyDate = new Date(1528578000000);

// and it can represent itself in the custom format defined above.

let today = new Date();

const prettyDate = today.toShortFormat()

var firebaseConfig = {
  apiKey: "AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo",
  authDomain: "geotools-bc75a.firebaseapp.com",
  projectId: "geotools-bc75a",
  storageBucket: "geotools-bc75a.appspot.com",
  messagingSenderId: "106157954659",
  appId: "1:106157954659:web:3e189110236a2138438a56",
  measurementId: "G-Z6GK19K3L0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
// Get a reference to the database service

const googleProvider = new GoogleAuthProvider();

/*
if (location.hostname === "localhost") {
  // Point to the RTDB emulator running on localhost.
connectAuthEmulator(auth, "http://localhost:9099");
}
*/
if (window.location.href.includes("login")) {
  const App = function _App() {
    return `

       <div class="container w-100 h-100 position-relative ${_App.state.class}" style="    min-width: 100vw !important;
    min-height: 100vh !important; ">
    <div class="spinner-container position-absolute top-50
                left-50" style= "width: 100%; text-align: center">

       <div class="spinner-grow text-primary " role="status">
                <span class="visually-hidden">Loading...</span>
            </div>

    </div>

        </div>


    `;
  };
  App.state = {
    loading: false,
    class: "d-none",
    count: 0,
    toggleState: () => {
      setState(() => {
        App.state.loading = App.state.loading ? false : true;
      });
    },
  };

  function toggleLoading() {
    if (App.state.loading == true) {
      App.state.loading = false;
      App.state.class = "d-none";
    } else {
      App.state.loading = true;
      App.state.class = "";
    }
  }

  $("#google-sign-in").on("click", function (e) {
    e.preventDefault();

    $("main").addClass("d-none");

    $("#spinner-box").removeClass("d-none");
    signInWithRedirect(auth, googleProvider);
  });
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getRedirectResult(auth)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        })
        .finally(() => {
          window.location.replace("/");
        });
    } else {
      $("#spinner-box").addClass("d-none");
      $("main").removeClass("d-none");
    }
  });

  import(/* webpackChunkName: "lazy-module.login" */ "./lazy-module").then(
    (module) => {
      const login = module.default;

      login();
    }
  );
}

function extractObjValues(obj){
      const result = []

  for (const property in obj) {
  let object = {
   key: property,
    value: obj[property]

  }
  result.push(object)

  }
  return result
}

/*

 mainForm.on('submit', e => {
        e.preventDefault()

        $('#submitted-message').innerHTML = `<b>Sanitized Message</b>: ${dompurify.sanitize(mainForm.message.value)}`

        import(/* webpackChunkName: "lazy-module.lazy"  './lazy-module').then(module => {
          const foo = module.default

          foo()
      })
  })
*/


window.addEventListener("DOMContentLoaded", (event) => {
  const db = getDatabase();

  if (document.getElementById("comment-form")){

    function extractReplies(replies){
      let response = []
      
      const map = new Map(Object.entries(replies));
      for (const [key, value] of map.entries()) { 
      
         let newObject= {
          "id": key,
          "name": value.name,
          "message": value.message,
          "date": value.date,
          "recipient": value.recipient
        }
        
        response.push(newObject)
      }
    
      return response
    }
    const mostViewedPosts = query(ref(db, 'messages'), orderByValue());
    const messageRef= ref(db, 'messages/'  );
    get(messageRef).then((snapshot) => {
      if (snapshot.exists()) {
        
        const data = snapshot.val();
      const map = new Map(Object.entries(data));

      for (const [key, value] of map.entries()) {
       const dateinfo = value.date ? value.date : ""
          $( "#comment-section" ).append( `<div class="row d-flex justify-content-center mt-1 ms-0 me-0 comment-box ">

          <div class="col-md-12 col-lg-12 col-xl-12">
          <div class="card border-0 " id = "${key}" style="background-color: transparent" >
             <div class="card-body" >
              <div class="d-flex flex-start align-items-center border-bottom">


                  <h6 class="fw-bold text-primary mb-1">${value.name}</h6>
                  <p class="text-muted small mb-0">
                   ${dateinfo}
                  </p>

              </div>

              <p class="mt-3 mb-0 pb-2">
             ${value.message}
              </p>

              <div class="small d-flex justify-content-start">
                <a href="#!" class="d-flex align-items-center me-3">
                  <i class="far fa-thumbs-up me-2"></i>

                </a>
                <a href="#!" class="d-flex align-items-center me-3">
                  <i class="far fa-thumbs-down me-2"></i>

                </a>
                <a href="#!" class="d-flex align-items-center me-3 reply-btn">
                  <i class="far fa-comment-dots me-2"></i>
                  <p class="m-0">Reply</p>
                </a>

              </div>
            </div>
            <div class="card-footer py-3 border-0  row " style = "background-color: transparent !important">
            <div class = "other-comments">

            </div>
            </div>
          </div>
        </div>
        </div>` );
        if(value.replies){
          let ex = extractReplies(value.replies)


          for (let index = 0; index < ex.length; index++) {
          const element = ex[index];
          let recipient = $(`#${element.recipient} .other-comments`)
          $(recipient[0]).append(
`  <div class="col-md-11 p-3 mb-3" >
      <div class="row ">
      <div class="col-lg-12 border-start">
         <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
        <h6 class="fw-bold text-primary mb-1 ">${element.name}</h6>
        <p class="text-muted small m-0">
         ${element.date}
        </p>

        
        </div>
        <p class="mt-3 mb-0 pb-2">
        ${element.message}
        </p>
      </div>
      </div>
     
        </div>

    
`
            
          )
      }
        }
       




      }

      } else {
        
      }
    }).catch((error) => {
      console.error(error);
    });
    /*
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      const map = new Map(Object.entries(data));
      //
      for (const [key, value] of map.entries()) {

        let newObject= {
          "id": key,
          "name": value.name,
          "message": value.message
        }
        $( "#comment-section" ).append( `<div class="d-flex">

        <div id = "${key}" class="ms-3">
          <div class="fw-bold">${value.name}</div>
          ${value.message}
        </div>
      </div>` );

      }
    });
    */

    $("#comment-form").on("submit", function (e) {

      e.preventDefault();

$("#comment-btn").disabled = true;
      let name = e.currentTarget[0].value;
      let message = e.currentTarget[1].value;
      
      let commentSection = document.getElementById("comment-section")

      if(name && message){
      let cleanMessage=  dompurify.sanitize(message)
      let cleanName = dompurify.sanitize(name)
      
      
        const postListRef = ref(db, 'messages');
        const newPostRef = push(postListRef);
        set(newPostRef, {
           name: cleanName,
           message: cleanMessage,
           date: prettyDate

        });
        $( "#comment-section" ).append( `<div class="d-flex comment-box">

        <div class="ms-3 ">
          <div class="fw-bold">${cleanName}</div>
          ${cleanMessage}
        </div>
      </div>` );
      }

      else if(!name && message) {
          let guest = 'Guest'
          let cleanMessage = dompurify.sanitize(message)
          const postListRef = ref(db, 'messages');
          const newPostRef = push(postListRef);

          set(newPostRef, {
             name: guest,
             message: cleanMessage
          });

      }

    });
    $('#comment-section').on('click', '.reply-btn', function (e) {
      e.preventDefault()
      
let siblings = $(this).parent().parent().siblings()
let otherComments = siblings[0]




      //var parentTag = $(this).parent().parent().attr('id');
      var parentTag = $(this).parent().parent().attr('id')
      var grandFather = $(this).parent().parent().parent().children().last().children()
      let footer =   $(this).parent().parent().parent().children().last()
      let replySection = $(this).parent().parent().parent().children().last().children()
      $(replySection).addClass('d-none')
      

  $(footer).append(`

  <form class="reply-form">
    <div class="d-flex flex-start w-100 ">
        <div class="col-md-11 p-3 mb-3">
       <div class="form-outline w-100">

         <div class="mb-3">

           <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="replyName" placeholder="Name (Optional)">


         </div>

         <textarea class="form-control" id="textAreaExample" rows="4" style="background: #fff;" placeholder="Write a comment."></textarea>

       </div>

       <button type="submit" class="btn btn-primary btn-sm mt-3">Send <i class="far fa-paper-plane"></i></button>
      </div>

       </div>

     
  </form>



  `);

  $('.reply-form').on('submit', function (e) {
      e.preventDefault()
      let inputs = e.target.elements
      //
      let name = inputs[0].value.length > 0 ? inputs[0].value: "Anonymous"

      let message = inputs[1]
      var parent = $(this).parent()
      let siblings = $(this).siblings()

      let otherComments = siblings[1]

     let cleanMessage=  dompurify.sanitize(message.value)
      let cleanName = dompurify.sanitize(name)
      const docId = $(this).parent().parent().attr('id')

      $(this).animate({opacity: 0}, 1000,function(){
      $(this).css('display','none');
        $(siblings[0]).removeClass("d-none")
      $(siblings[0]).append(
        `
          <div class="col-md-11 p-3 mb-3" >
      <div class="row ">
      <div class="col-lg-12 border-start">
         <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
        <h6 class="fw-bold text-primary mb-1 ">${cleanName}</h6>
        <p class="text-muted small m-0">
         ${prettyDate}
        </p>

        
        </div>
        <p class="mt-3 mb-0 pb-2">
        ${cleanMessage}
        </p>
      </div>
      </div>
     
        </div>
        `
            );
            $(otherComments).animate({opacity: 1}, 500);

     // $('#one').animate({opacity: 1}, 500);
    });
  const postListRef = ref(db, `messages/${docId}/replies`);
const newPostRef = push(postListRef);
  set(newPostRef, {
             name: cleanName,
             message: cleanMessage,
             date: prettyDate,
             recipient: docId
          });
/*
setTimeout(() => {
  $(otherComments).append(
    `


    <div class="col-md-11 p-3" >


    <div class="d-flex justify-content-between align-items-center border-bottom pb-2">

    <h6 class="fw-bold text-primary mb-1 ">${name}</h6>
    <p class="text-muted small m-0">
    ${prettyDate}
    </p>
    </div>
    <p class="mt-3 mb-0 pb-2">
    ${message.value}
    </p>
    </div>
    `

        );
        
}, 5000);
*/

  });
  });
  }
  $("#testBtn").on("click", function () {
    var myModal = new bootstrap.Modal(document.getElementById("modalSignOut"));
    myModal.toggle();
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      $("#sign-in-elm").css("display", "none");
      $("#sign-out-elm").css("display", "block");
    } else {
      $("#sign-out-elm").css("display", "none");
      $("#sign-in-elm").css("display", "block");
    }
  });

  $("#sign-out").on("click", async function (e) {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        var myModal = new bootstrap.Modal(
          document.getElementById("modalSignOut")
        );
        myModal.toggle();
      })
      .catch((error) => {});
  });

  $("#user-btn").on("click", function (e) {
    e.preventDefault();
  });

  // Movie Directory
});
