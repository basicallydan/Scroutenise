/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === 'undefined') {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

/** Converts radians to numeric (signed) degrees */
if (typeof(Number.prototype.toDeg) === 'undefined') {
  Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
  }
}