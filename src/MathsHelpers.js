var MathsHelpers = {
  euclideanDistance: function(latLngStart, latLngEnd)
  {
    var x0 = latLngStart.lng();
    var y0 = latLngStart.lat();
    var x1 = latLngEnd.lng();
    var y1 = latLngEnd.lat();

    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
  },

  euclideanDistanceBetweenPoints: function(point1, point2)
  {
    var x0 = point1.x;
    var y0 = point1.y;
    var x1 = point2.x;
    var y1 = point2.y;

    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
  }
};