function getDateFormat() {
  let date = new Date();
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0");
  let yyyy = date.getFullYear();
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  return dd + "/" + mm + "/" + yyyy + "/ " +h+":"+m+":"+s+ " h.";
}
module.exports = {
  getDateFormat,
};
