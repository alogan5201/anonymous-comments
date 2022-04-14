/** letiables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import dompurify from "dompurify";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get,  onValue, push, query, orderByValue, increment, orderByChild } from "firebase/database";
 import { getFunctions, httpsCallable , connectFunctionsEmulator} from 'firebase/functions';
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  connectAuthEmulator,
} from "firebase/auth";
//import 'bootstrap/dist/js/bootstrap.bundle';
import { Modal, Dropdown} from 'bootstrap/dist/js/bootstrap.esm.min.js'



import "picturefill";
import "utils/errors";

var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new Dropdown(dropdownToggleEl)
})




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

let today = new Date();

const prettyDate = today.toShortFormat()


 const app = initializeApp({
  apiKey: "AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo",
  authDomain: "geotools-bc75a.firebaseapp.com",
  projectId: "geotools-bc75a",
  storageBucket: "geotools-bc75a.appspot.com",
  messagingSenderId: "106157954659",
  appId: "1:106157954659:web:3e189110236a2138438a56",
  measurementId: "G-Z6GK19K3L0",
});
//const functions = getFunctions(app);
const auth = getAuth();
// Get a reference to the database service

const googleProvider = new GoogleAuthProvider();

 const functions = getFunctions(app);
if (location.hostname === "localhost") {

connectFunctionsEmulator(functions, "localhost", 5001);
connectAuthEmulator(auth, "http://localhost:9099");
}

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

window.addEventListener("DOMContentLoaded", (event) => {
  const db = getDatabase();
 let body = document.querySelector("body")
 let bodyClass = body.classList[0]
 console.log(` body class is ${bodyClass}`)
 console.log(window.location.pathname)
  if (document.getElementById("comment-form")){
     function commentReply( name, id, date, message) {

      let data = `  <div class="col-md-11 p-3 mb-3" id=${id} >
          <div class="row ">
          <div class="col-lg-12 border-start">
             <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
            <h6 class="fw-bold text-primary mb-1 ">${name}</h6>
            <p class="text-muted small m-0">
             ${date}
            </p>
            </div>
            <p class="mt-3 mb-0 pb-2">
            ${message}
            </p>
          </div>
          </div>
            </div>`

      return data

    }


 function commentCard (id, name, date, message, likes, dislikes) {

      let data = `
      <div class="col-md-12 col-lg-12 col-xl-12">
        <div class="card border-0 " id=${id} style="background-color: transparent">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
              <h6 class="fw-bold text-primary mb-1 ">${name}</h6>
              <p class="text-muted small m-0">
                ${date}
              </p>
            </div>
            <p class="mt-3 mb-0 pb-2">
              ${message}
            </p>

            <div class="small d-flex justify-content-start">
              <a href="#!" id="thumbs-up" class="d-flex align-items-center me-3">
                <i class="far fa-thumbs-up me-2"></i> <span id="count">${likes}</span>
              </a>
              <a href="#!" id="thumbs-down" class="d-flex align-items-center me-3">
                <i class="far fa-thumbs-down me-2"></i>
                <span id="count">${dislikes}</span>
              </a>
              <a href="#!" class="d-flex align-items-center me-3 reply-btn">
                <i class="far fa-comment-dots me-2"></i>
                <p class="m-0">Reply</p>
              </a>

            </div>
          </div>
          <div class="card-footer py-3 border-0  row " style="background-color: transparent !important">
            <div class="other-comments">

            </div>
          </div>
        </div>
      </div>`

      return data

    }






     //function commentCard (id, name, date, message, likes, dislikes)

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

let filterCommentSuccess = new Modal(document.getElementById('filterCommentSuccess'), {
  keyboard: false
})
let filterCommentFail = new Modal(document.getElementById('filterCommentFail'), {
  keyboard: false
})
        const messageRef= ref(db, 'messages/'  );
    get(messageRef).then((snapshot) => {
      if (snapshot.exists()) {

        const data = snapshot.val();
      const map = new Map(Object.entries(data));

      for (const [key, value] of map.entries()) {
        let likes = value.likes && value.likes.likes ? value.likes.likes : ''
        let dislikes = value.dislikes && value.dislikes.dislikes ? value.dislikes.dislikes : ''
        console.log(likes)
       const dateinfo = value.date ? value.date : ""

       let commentsList = commentCard( value.id, value.name, dateinfo, value.message, likes, dislikes)
        $( "#comment-section" ).append(commentsList );
        if(value.replies){
          let ex = extractReplies(value.replies)
          for (let index = 0; index < ex.length; index++) {
          const element = ex[index];
          let recipient = $(`#${element.recipient} .other-comments`)

          let replies = commentReply(element.name, element.id, element.date, element.message)
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
        console.log('no data')
      }
    }).catch((error) => {
      console.error(error);
    });


    $("#comment-form").on("submit", function (e) {

      e.preventDefault();
const inputs = $('#comment-form :input')
    let children = $(this).children()
$("#comment-btn").disabled = true;
 $("#comment-btn").html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Verifying..`)
      let name = e.currentTarget[0].value.length > 0 ? e.currentTarget[0].value : "Guest";
      let message = e.currentTarget[1].value;

      let commentSection = document.getElementById("comment-section")
      let cleanMessage=  dompurify.sanitize(message)
      let cleanName = dompurify.sanitize(name)

      const addMessage = httpsCallable(functions, 'addMessage');
      let messageText = `${cleanName} ${cleanMessage}`
        addMessage({text: messageText}).then(function(result) {
    // Read result of the Cloud Function.
    let sanitizedMessage = result.data.text;
    let anonymousUid = result.data.id
    console.log(anonymousUid)


    if (messageText !== sanitizedMessage) {


          filterCommentFail.toggle()
    $("#comment-btn").disabled = false
    $("#comment-btn").html('Submit')
       for (let index = 0; index < inputs.length; index++) {
                const element = inputs[index];
               element.value = ''

            }



    }
    else {



        $("#comment-btn").disabled = false
    $("#comment-btn").html('Submit')
       for (let index = 0; index < inputs.length; index++) {
                const element = inputs[index];
               element.value = ''

            }
             filterCommentSuccess.toggle()
             const postListRef = ref(db, 'messages');
        const newPostRef = push(postListRef);
        set(newPostRef, {
           name: cleanName,
           id: anonymousUid,
           message: cleanMessage,
           date: prettyDate

        });
        $( "#comment-section" ).append( `  <div class="col-md-12 col-lg-12 col-xl-12" >
          <div class="card border-0 "  style="background-color: transparent" id=${anonymousUid} >
             <div class="card-body" >
             <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
        <h6 class="fw-bold text-primary mb-1 ">${cleanName}</h6>
        <p class="text-muted small m-0">
         ${prettyDate}
        </p>


        </div>


              <p class="mt-3 mb-0 pb-2">
             ${cleanMessage}
              </p>

              <div class="small d-flex justify-content-start">
                <a href="#!" id="thumbs-up" class="d-flex align-items-center me-3">
                  <i class="far fa-thumbs-up me-2"></i>
              <span id="count"></span>
                </a>
                <a href="#!" id="thumbs-down" class="d-flex align-items-center me-3">
                  <i class="far fa-thumbs-down me-2"></i>
      <span id="count"></span>
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
        </div>` );
  $("#comment-btn").disabled = false;




    }


  }).catch(function(error) {
    // Getting the Error details.
    let code = error.code;
    let message = error.message;
    let details = error.details;
    console.error('There was an error when calling the Cloud Function', error);
    window.alert('There was an error when calling the Cloud Function:\n\nError Code: '
        + code + '\nError Message:' + message + '\nError Details:' + details);
    addMessageButton.disabled = false;
  });




    });
const addLike = async (id) => {

    await set(ref(db, `messages/${id}/likes`), {
         likes: increment(1)
    });
  }
const addDislike = async (id) => {

    await set(ref(db, `messages/${id}/dislikes`), {
         dislikes: increment(1)
    });
  }
const addReply = async () => {

const dbRef = ref(db, 'messages');

  onValue(dbRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    console.log(childKey, childData)
  });
}, {
  onlyOnce: true
});

  }

 $('#comment-section').on('click', '#thumbs-up', function (e) {
e.preventDefault()
let t = $(this)
let anchor = t[0]
let countText = $(this).children().last().text()
 let parentTag = $(this).parent().parent().parent().attr('id')

const dbRef = ref(db, 'messages');
            onValue(dbRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
   // console.log(childKey, childData)

    if(childData.id == parentTag){

const postListRef = ref(db, `messages/${childKey}/likes`);


const newPostRef = push(postListRef);
set(ref(db, `messages/${childKey}/likes`), {
         likes: increment(1)
    });

    }

  });
}, {
  onlyOnce: true
});

let newCount = parseInt(countText) + 1 || 1
$(this).children().first().removeClass('far fa-thumbs-up me-2').addClass('fas fa-thumbs-up me-2')
$(this).children().first().css('color', '#0085A1')

console.log($(this).children().last().text())
$(this).children().last().html(newCount)


 })

 $('#comment-section').on('click', '#thumbs-down', function (e) {
e.preventDefault()
let t = $(this)
let anchor = t[0]
let countText = $(this).children().last().text()
 let parentTag = $(this).parent().parent().parent().attr('id')

const dbRef = ref(db, 'messages');
            onValue(dbRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
   // console.log(childKey, childData)

    if(childData.id == parentTag){

const postListRef = ref(db, `messages/${childKey}/likes`);


const newPostRef = push(postListRef);
set(ref(db, `messages/${childKey}/dislikes`), {
         dislikes: increment(1)
    });

    }

  });
}, {
  onlyOnce: true
});
console.log($(this).children())
let newCount = parseInt(countText) + 1 || 1
$(this).children().first().removeClass('far fa-thumbs-down me-2').addClass('fas fa-thumbs-down me-2')
$(this).children().first().css('color', '#0085A1')
$(this).children().last().html(newCount)

 })

    $('#comment-section').on('click', '.reply-btn', function (e) {
      e.preventDefault()
let siblings = $(this).parent().parent().siblings()
let otherComments = siblings[0]
      //let parentTag = $(this).parent().parent().attr('id');
      let parentTag = $(this).parent().parent().attr('id')
      let grandFather = $(this).parent().parent().parent().children().last().children()
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

       <button type="submit" id="reply-btn" class="btn btn-primary btn-sm mt-3">Send <i class="far fa-paper-plane"></i></button>
      </div>

       </div>


  </form>



  `);

  $('.reply-form').on('submit', function (e) {
      e.preventDefault()
      const inputs = $('.reply-form :input')

      $("#reply-btn").disabled = true
      let name = inputs[0].value.length > 0 ? inputs[0].value: "Guest"

      let message = inputs[1]
      let parent = $(this).parent()
      let siblings = $(this).siblings()

      let otherComments = siblings[1]

     let cleanMessage=  dompurify.sanitize(message.value)
      let cleanName = dompurify.sanitize(name)
      const docId = $(this).parent().parent().attr('id')

const dbRef = ref(db, 'messages');








    let messageText = `${cleanName} ${cleanMessage}`
    let replyForm = $(this)
    let otherSiblings = siblings[0]

     const addMessage = httpsCallable(functions, 'addMessage');

           addMessage({text: messageText}).then(function(result) {
    // Read result of the Cloud Function.
    let sanitizedMessage = result.data.text;
  let id = result.data.id

    if (messageText !== sanitizedMessage) {

      setTimeout(() => {
          filterCommentFail.toggle()
    $("#reply-btn").disabled = false
    $("#reply-btn").html('Send')
       for (let index = 0; index < inputs.length; index++) {
                const element = inputs[index];
               element.value = ''

                }
      }, 500);


    }
    else {



            onValue(dbRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
   // console.log(childKey, childData)

    if(childData.id == docId){
const postData = {
  name: cleanName,
           id: id,
           message: cleanMessage,
           date: prettyDate}
const postListRef = ref(db, `messages/${childKey}/replies`);

console.log(childKey, childData)
const newPostRef = push(postListRef);
set(newPostRef, {
 name: cleanName,
           id: id,
           message: cleanMessage,
           date: prettyDate,
            recipient: childData.id
});

    }

  });
}, {
  onlyOnce: true
});


      setTimeout(() => {


             $(replyForm).animate({opacity: 0}, function(){
      $(replyForm).css('display','none');
        $(otherSiblings).removeClass("d-none")
      $(otherSiblings).append(
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

 filterCommentSuccess.toggle()
    });
      }, 500);

    } }).catch(function(error) {
    // Getting the Error details.
    let code = error.code;
    let message = error.message;
    let details = error.details;
    console.error('There was an error when calling the Cloud Function', error);
    window.alert('There was an error when calling the Cloud Function:\n\nError Code: '
        + code + '\nError Message:' + message + '\nError Details:' + details);
    addMessageButton.disabled = false;
  });


  });
  });












  }



  $("#testBtn").on("click", function () {
    let myModal = new Modal(document.getElementById("modalSignOut"));
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
        let myModal = new Modal(
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
