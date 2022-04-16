import { Modal } from 'bootstrap/dist/js/bootstrap.esm.min.js'

let filterCommentSuccess = new Modal(
  document.getElementById('filterCommentSuccess'),
  {
    keyboard: false
  }
)
let filterCommentFail = new Modal(
  document.getElementById('filterCommentFail'),
  {
    keyboard: false
  }
)
export function toggleModal(id){
  const modal = id == "success" ? filterCommentSuccess.toggle() :  filterCommentFail.toggle()
return modal

}
Date.prototype.toShortFormat = function () {
  let monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  let day = this.getDate()

  let monthIndex = this.getMonth()
  let monthName = monthNames[monthIndex]

  let year = this.getFullYear()

  return `${monthName} ${year}`



}


export function getDate(){
  let today = new Date()
  const prettyDate = today.toShortFormat()
  return prettyDate

}
export default {getDate, toggleModal}
