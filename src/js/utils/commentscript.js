/* jshint esversion: 8 */
import { handleComment, getUser, createRandomUser } from "../firebase";

import {
  comment,
  commentReply,
  extractReplies,
  replyForm,
} from "utils/comments";
import { toggleModal } from "utils/helpers";

import dompurify from "dompurify";
import { httpsCallable, getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  push,
  query,
  orderByValue,
  increment,
  orderByChild,
} from "firebase/database";

// commentReply( name, id, date, message)
// comment (id, name, date, message, likes, dislikes)

$(".modal-close-btn").on("click", function (e) {
  e.preventDefault();
  const modalId = $(this).parent().parent().parent().parent().attr("id");
  let modal = modalId == "filterCommentSuccess" ? "success" : "fail";
  toggleModal(modal);
});

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

const functions = getFunctions();
const db = getDatabase();
const auth = getAuth();
const path = window.location.pathname;

setTimeout(() => {
  if (auth.currentUser) {
  }
}, 1000);

const commentRef = ref(db, `messages${path}`);

/**
 *---------------------------------------------------------------------
 * !! DISPLAY COMMENTS
 * -------------------------------------------------------------------
 */
function displayComments() {
  get(commentRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const map = new Map(Object.entries(data));

        for (const [key, value] of map.entries()) {
          let likes = value.likes && value.likes.likes ? value.likes.likes : "";
          let dislikes =
            value.dislikes && value.dislikes.dislikes
              ? value.dislikes.dislikes
              : "";

          const dateinfo = value.date ? value.date : "";

          const commentsList = comment(
            value.id,
            value.name,
            dateinfo,
            value.message,
            likes,
            dislikes
          );
          $("#comment-section").append(commentsList);
          if (value.replies) {
            let ex = extractReplies(value.replies);
            for (let index = 0; index < ex.length; index++) {
              const element = ex[index];
              let recipient = $(`#${element.recipient} .other-comments`);

              let replies = commentReply(
                element.name,
                element.id,
                element.date,
                element.message
              );
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
              );
            }
          }
        }
      } else {
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
displayComments();
/**
 *---------------------------------------------------------------------
 * !! COMMENT SUBMIT
 * -------------------------------------------------------------------
 */
$("#comment-form").on("submit", async function (e) {
  e.preventDefault();
  let userCheck = getUser();

  console.log(userCheck);
  if (!userCheck) {
    console.log("no user on frontend");
    createRandomUser();
  }

  $("#comment-btn").disabled = true;
  const inputs = $("#comment-form :input");
  const children = $(this).children();
  $(
    "#comment-btn"
  ).html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
Verifying..`);

  let name =
    e.currentTarget[0].value.length > 0 ? e.currentTarget[0].value : "Guest";
  let message = e.currentTarget[1].value;
  let cleanMessage = dompurify.sanitize(message);
  let cleanName = dompurify.sanitize(name);
  const userData = JSON.parse(localStorage.getItem("userData"));

  handleComment(cleanMessage, cleanName, userData, path);
});
/**
 *---------------------------------------------------------------------
 * !! COMMENT REPLY SUBMIT
 * -------------------------------------------------------------------
 */
$("#comment-section").on("click", ".reply-btn", function (e) {
  e.preventDefault();
  let item = $(this);
  let btn = item[0];

  let siblings = $(this).parent().parent().siblings();
  let otherComments = siblings[0];
  // let parentTag = $(this).parent().parent().attr('id');
  let parentTag = $(this).parent().parent().attr("id");
  let grandFather = $(this)
    .parent()
    .parent()
    .parent()
    .children()
    .last()
    .children();
  let footer = $(this).parent().parent().parent().children().last();
  let replySection = $(this)
    .parent()
    .parent()
    .parent()
    .children()
    .last()
    .children();

  console.log(btn);
  const replyFormComponent = replyForm();
  $(footer).append(replyFormComponent);
  $(replySection).addClass("d-none");
  btn.disabled = true;
  $(".reply-form").on("submit", function (e) {
    e.preventDefault();

    let elem = $(this);
    let buttonElm = e.target[2];
    let formElements = e.target;
    buttonElm.disabled = true;
    $(
      buttonElm
    ).html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
Verifying..`);

    let name =
      formElements[0].value.length > 0 ? formElements[0].value : "Guest";

    let message = formElements[1];
    let parent = $(this).parent();
    let siblings = $(this).siblings();

    let otherComments = siblings[1];

    let cleanMessage = dompurify.sanitize(message.value);
    let cleanName = dompurify.sanitize(name);
    const docId = $(this).parent().parent().attr("id");

    let messageText = `${cleanName} ${cleanMessage}`;
    let replyForm = $(this);
    let otherSiblings = siblings[0];

    const addComment = httpsCallable(functions, "addComment");
    setTimeout(() => {
      const userData = JSON.parse(localStorage.getItem("userData"));

      const uid = userData.uid;
      addComment({
        text: cleanMessage,
        name: cleanName,
        uid: userData,
        page: path,
      })
        .then(function (result) {
          console.log(result);

          // Read result of the Cloud Function.
          let sanitizedMessage = result.data.text;
          let sanitizedName = result.data.name;

          if (cleanMessage !== sanitizedMessage) {
            filterCommentFail.toggle();
            $("#reply-btn").disabled = false;
            $("#reply-btn").html("Send");
            for (let index = 0; index < formElements.length; index++) {
              const element = formElements[index];
              element.value = "";
            }
          } else {
            console.log("test");
            get(commentRef)
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const data = snapshot.val();
                  const map = new Map(Object.entries(data));

                  for (const [key, value] of map.entries()) {
                    if (value.id == docId) {
                      const postListRef = ref(
                        db,
                        `messages${path}${key}/replies`
                      );

                      const newPostRef = push(postListRef);
                      return set(newPostRef, {
                        name: sanitizedName,
                        id: uid,
                        message: sanitizedMessage,
                        date: prettyDate,
                        recipient: value.id,
                      });
                    }
                  }
                } else {
                }
              })
              .catch((error) => {
                console.error(error);
              });

            setTimeout(() => {
              $(replyForm).animate({ opacity: 0 }, function () {
                $(replyForm).css("display", "none");
                $(otherSiblings).removeClass("d-none");
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
                $(otherComments).animate({ opacity: 1 }, 500);

                filterCommentSuccess.toggle();
              });
            }, 500);
          }
        })
        .catch(function (error) {
          // Getting the Error details.
          let code = error.code;
          let message = error.message;
          let details = error.details;
          console.error(
            "There was an error when calling the Cloud Function",
            error
          );
          window.alert(
            "There was an error when calling the Cloud Function:\n\nError Code: " +
              code +
              "\nError Message:" +
              message +
              "\nError Details:" +
              details
          );
          addCommentButton.disabled = false;
        });
    }, 2000);
  });
});
/**
 *---------------------------------------------------------------------
 * !! THUMBS UP
 * -------------------------------------------------------------------
 */

$("#comment-section").on("click", "#thumbs-up", function (e) {
  e.preventDefault();
  let btn = $(this);
  btn[0].disabled = true;
  let t = $(this);
  let anchor = t[0];
  let countText = $(this).children().last().text();
  let parentTag = $(this).parent().parent().parent().attr("id");

  onValue(
    commentRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        //

        if (childData.id == parentTag) {
          const postListRef = ref(db, `messages${path}${childKey}/likes`);

          const newPostRef = push(postListRef);
          set(ref(db, `messages${path}${childKey}/likes`), {
            likes: increment(1),
          });
        }
      });
    },
    {
      onlyOnce: true,
    }
  );

  let newCount = parseInt(countText) + 1 || 1;
  $(this)
    .children()
    .first()
    .removeClass("far fa-thumbs-up me-2")
    .addClass("fas fa-thumbs-up me-2");
  $(this).children().first().css("color", "#0085A1");

  $(this).children().last().html(newCount);
});
/**
 *---------------------------------------------------------------------
 * !! THUMBS DOWN
 * -------------------------------------------------------------------
 */
$("#comment-section").on("click", "#thumbs-down", function (e) {
  e.preventDefault();
  let t = $(this);

  t[0].disabled = true;
  let anchor = t[0];
  let countText = $(this).children().last().text();
  let parentTag = $(this).parent().parent().parent().attr("id");

  onValue(
    commentRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        //

        if (childData.id == parentTag) {
          const postListRef = ref(db, `messages${path}${childKey}/likes`);

          const newPostRef = push(postListRef);
          set(ref(db, `messages${path}${childKey}/dislikes`), {
            dislikes: increment(1),
          });
        }
      });
    },
    {
      onlyOnce: true,
    }
  );

  let newCount = parseInt(countText) + 1 || 1;
  $(this)
    .children()
    .first()
    .removeClass("far fa-thumbs-down me-2")
    .addClass("fas fa-thumbs-down me-2");
  $(this).children().first().css("color", "#0085A1");
  $(this).children().last().html(newCount);
});
