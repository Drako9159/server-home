function getSize(size) {
  let sizerMath = Math.floor(size / 1000);
  if (sizerMath > 1024) {
    return (sizerMath = `${sizerMath / 1000} MB`);
  } else {
    return (sizerMath = `${sizerMath} KB`);
  }
}
module.exports = { getSize };
