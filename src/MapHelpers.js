var MapHelpers = {
  withinRadiusOfAPoint: function(result, allPoints, searchRadius)
  {
    for(var i = 0; i < allPoints.length; i++)
    {
      if(google.maps.geometry.spherical.computeDistanceBetween(allPoints[i], result.geometry.location) <= searchRadius)
        return true;
    }
  }
}