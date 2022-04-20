export function popupContent(data) {
  let result = `  <div class="row">

            <div class="col">


     <div class="modal-content rounded-6 shadow">

      <div class="modal-body py-3">


        <p>This is a modal sheet, a variation of the modal that docs itself to the bottom of the viewport like the newer share sheets in iOS.</p>
      </div>
      <div class="modal-footer flex-column border-top-0">

   <button type="button" id="getAltitude"class="btn btn-primary">Get Altitude</button>


  <button type="button" class="btn  bookmark-btn  btn-light text-primary border-primary"> Bookmark <i class="far fa-bookmark"></i></button>




      </div>
    </div>
            </div>
        </div>`;

  return result;
}

export function commentReply(name, id, date, message) {
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
         </div>`;

  return data;
}

export function comment(id, name, date, message, likes, dislikes) {
  let data = `
   <div class="col-md-12 col-lg-12 col-xl-12">
     <div class="card border-0 " id=${id} style="background-color: transparent">
       <div class="card-body">
         <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
           <h6 class="fw-bold text-primary mb-1 ">${name}</h6>
           <p class="text-muted m-0">
             ${date}
           </p>
         </div>
         <p class="mt-3 mb-0 pb-2">
           ${message}
         </p>

         <div class=" d-flex justify-content-start">
           <button  id="thumbs-up" role="button" class="d-flex align-items-center me-3 btn btn-link  border-0" style="background-color: transparent !important; padding-left: 0 !important; margin-right: 0.25rem  !important">
             <i class="far fa-thumbs-up me-2"></i> <span id="count">${likes}</span>
           </button>
             <button  id="thumbs-down" role="button" class="d-flex align-items-center me-3 btn btn-link  border-0" style="background-color: transparent !important; padding-left: 0 !important; margin-right: 0.25rem  !important">
             <i class="far fa-thumbs-down me-2"></i> <span id="count">${dislikes}</span>
           </button>
           <button id= "reply-btn" class="d-flex align-items-center me-3 reply-btn btn btn-link  border-0" style="background-color: transparent !important; padding-left: 0 !important; margin-right: 0.25rem  !important">
             <i class="far fa-comment-dots me-2"></i>
             <p class="m-0">Reply</p>
           </button>

         </div>
       </div>
       <div class="card-footer py-3 border-0  row " style="background-color: transparent !important">
         <div class="other-comments">

         </div>
       </div>
     </div>
   </div>`;

  return data;
}

export function replyForm() {
  let data = `<form class="reply-form">
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


</form>`;

  return data;
}
export function extractReplies(replies) {
  let response = [];

  const map = new Map(Object.entries(replies));
  for (const [key, value] of map.entries()) {
    let newObject = {
      id: key,
      name: value.name,
      message: value.message,
      date: value.date,
      recipient: value.recipient,
    };

    response.push(newObject);
  }

  return response;
}

export default {
  comment,
  commentReply,
  extractReplies,
};
