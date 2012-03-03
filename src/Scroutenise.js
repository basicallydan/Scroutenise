/**
 * @depend DirectionsRouteHelpers.js
 * @depend LatLngExtensions.js
 * @depend MapExtensions.js
 * @depend NumberExtensions.js
 * @depend InfoWindowHelpers.js
 */


function Scroutenise(map, searchService, directionsService, directionsDisplay, autocomplete) {
  this.map = map;

  this.searchService = new google.maps.places.PlacesService(map);

  this.directionsService = new google.maps.DirectionsService();

  this.directionsDisplay = new google.maps.DirectionsRenderer();

  this.directionsDisplay.setMap(this.map);

  this.autocomplete = autocomplete;
}

Scroutenise.prototype.debugMode = false;

Scroutenise.prototype.searchMethod = "RADIUS";

Scroutenise.prototype.renderedResultReferences = [];

Scroutenise.prototype.OnSearchStart = function(callback) {
  this.onSearchStart = callback;
}

Scroutenise.prototype.OnSearchStep = function(callback) {
  this.onSearchStep = callback;
}

Scroutenise.prototype.OnSearchEnd = function(callback) {
  this.onSearchend = callback;
}

Scroutenise.prototype.addMarkerFromPlacesResult = function(result) {
  if(this.renderedResultReferences.indexOf(result.id) == -1)
  {
    var placeLatLng = new google.maps.LatLng(result.geometry.location.lat(), result.geometry.location.lng());
    var marker = new google.maps.Marker({
      position: placeLatLng,
      title: result.name
    });

    this.map.addInfoWindow(InfoWindowHelpers.getInfoWindowFor(result), marker);
    this.map.addMarker(marker);

    this.renderedResultReferences.push(result.id);
  }
}

Scroutenise.prototype.clearResults = function()
{
  this.map.clearMarkers();
  this.renderedResultReferences = [];
}

Scroutenise.prototype.searchWithinBounds = function(searchTypes, bounds, callback)
{        
  var searchRequest = {
    bounds: bounds,
    types: searchTypes
  };
  this.searchService.search(searchRequest, callback);
}

Scroutenise.prototype.searchAroundPoint = function(latLngPoint, searchTypes, searchRadius, searchService, callback)
{
  var searchRequest = {
    location: latLngPoint,
    radius: searchRadius,
    types: searchTypes
  };
  this.searchService.search(searchRequest, callback);
}

Scroutenise.prototype.getDirections = function(start, end, typesToSearchFor, searchRadius, travelMode)
{
  var self = this;
  this.map.clearMarkers();
  this.map.clearCircles();
  this.clearResults();

  if(typeof(this.onSearchStart) != 'undefined')
    this.onSearchStart();

  var directions = {
    origin: start,
    destination: end,
    provideRouteAlternatives: false,
    travelMode: travelMode,
    unitSystem: google.maps.UnitSystem.METRIC
  }

  self.directionsService.route(directions, function(result, status) {
    if(status == google.maps.DirectionsStatus.OK) {
      self.directionsDisplay.setDirections(result);

      var allPoints = DirectionsRouteHelpers.getPathAsLatLngArray(result, searchRadius / 2);

      //// Search method: make one request using bounds and then trim it
      //// This method is slightly flawed because 20 is the maximum number of results
      //// Maybe split the bounds into x number of sections and search that way?
      //// Or a combo of both methods, instead of radius use bounds and then we can ensure
      //// That they join up
      if(self.searchMethod == "BOUNDS") {
        for(var i = 0; i < 5; i++) {
          var originalBounds = result.routes[0].bounds;
          var resultingBounds = originalBounds.expandBy(searchRadius);

          self.searchWithinBounds(typesToSearchFor, resultingBounds, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              if(this.debugMode == true) {
                var rect = new google.maps.Rectangle();
                rect.setBounds(resultingBounds);
                rect.setMap(self.map);
              }
              for (var i = 0; i < results.length; i++) {
                if(MapHelpers.withinRadiusOfAPoint(results[i], allPoints, searchRadius))
                  self.addMarkerFromPlacesResult(results[i]);
              }
            }
          });
        }
      //// Search method by making loadsa requests
      } else if(self.searchMethod == "RADIUS") {
        for(var i = 0; i < allPoints.length; i++)
        {
          self.searchAroundPoint(allPoints[i], typesToSearchFor, searchRadius, self.searchService, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                self.addMarkerFromPlacesResult(results[i]);
              }
              if(typeof(self.onSearchStep) != 'undefined')
                self.onSearchStep(1, 1);
            }
          });

          if(typeof(self.onSearchStep) != 'undefined')
            self.onSearchStep(i, allPoints.length);

          if(this.debugMode == true)
          {
            self.map.addCircle(new google.maps.Circle({
              center: allPoints[i],
              radius: searchRadius
            }));
          }
        }
      }
    }
  });
}