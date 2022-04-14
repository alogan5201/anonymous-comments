export  function commentReply( name, id, date, message) {

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



export function commentCard (id, name, date, message, likes, dislikes) {

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


export default {

  commentReply,
  commentCard

}

