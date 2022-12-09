function alertToast(color, message) {
  return `<div class="alertToast" style="background-color: ${color};">${message}</div>`;
}
module.exports = { alertToast };
