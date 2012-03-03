var DirectionsRouteHelpers = {
  /*
  * Gets a list of points along the path by 
  */
  getPathAsLatLngArray: function (directionResult, maxDistanceBetweenPoints) {
    if (typeof maxDistanceBetweenPoints === 'undefined') { maxDistanceBetweenPoints = 0; }

    var myRoute = directionResult.routes[0].legs[0],
      totalDistance = myRoute.distance.value,
      path = [];

    for (var i = 0; i < myRoute.steps.length; i++) {

      // Do we need to split this step up?
      var start = myRoute.steps[i].start_location;
      var end = i + 1 < myRoute.steps.length ? myRoute.steps[i + 1].start_location : myRoute.steps[i].end_location;
      // var distanceBetweenStartAndEnd = google.maps.geometry.spherical.computeDistanceBetween(start, end);
      var stepDistanceInMetres = myRoute.steps[i].distance.value;

      // Push the starting point, to start with
      path.push(start);

      if (stepDistanceInMetres > maxDistanceBetweenPoints) {
        // Get a number of the points along the route based on their position along the path
        var numberOfSplits = Math.round(stepDistanceInMetres / maxDistanceBetweenPoints);
        var splitIncrement = myRoute.steps[i].path.length / numberOfSplits;

        for (var s = 1; s < myRoute.steps[i].path.length; s += splitIncrement) {
          var pathIndex = Math.round(s);

          if (pathIndex < myRoute.steps[i].path.length - 1 && pathIndex > 0) { path.push(myRoute.steps[i].path[pathIndex]); }
        }
      }
    }
    return path;
  }
}