/**
 * @depend DirectionsRouteHelpers.js
 * @depend LatLngExtensions.js
 * @depend MapExtensions.js
 * @depend NumberExtensions.js
 * @depend InfoWindowHelpers.js
 */

function Scroutenise(map) {
  var searchService = new google.maps.places.PlacesService(map),
    directionsService = new google.maps.DirectionsService(),
    directionsDisplay = new google.maps.DirectionsRenderer();

  directionsDisplay.setMap(map);
    
  return {
    map : map,

    searchService : searchService,

    directionsService : directionsService,

    directionsDisplay : directionsDisplay,

    debugMode : false,

    searchMethod : "RADIUS",

    renderedResultReferences : [],

    OnSearchStart : function (callback) {
      this.onSearchStart = callback;
    },

    OnSearchStep : function (callback) {
      this.onSearchStep = callback;
    },

    OnSearchEnd : function (callback) {
      this.onSearchEnd = callback;
    },

    addMarkerFromPlacesResult : function (result) {
      if(this.renderedResultReferences.indexOf(result.id) == -1)
      {
        var placeLatLng = new google.maps.LatLng(result.geometry.location.lat(), result.geometry.location.lng())
          ,marker = new google.maps.Marker({
            position: placeLatLng,
            title: result.name
          });

        this.map.addInfoWindow(InfoWindowHelpers.getInfoWindowFor(result), marker);
        this.map.addMarker(marker);

        this.renderedResultReferences.push(result.id);
      }
    },

    clearResults : function ()
    {
      this.map.clearMarkers();
      this.renderedResultReferences = [];
    },

    searchWithinBounds : function (searchTypes, bounds, callback)
    {        
      var searchRequest = {
        bounds: bounds,
        types: searchTypes
      };
      this.searchService.search(searchRequest, callback);
    },

    searchAroundPoint : function (latLngPoint, searchTypes, searchRadius, searchService, callback)
    {
      var searchRequest = {
        location: latLngPoint,
        radius: searchRadius,
        types: searchTypes
      };
      this.searchService.search(searchRequest, callback);
    },

    searchAroundPoint : function (latLngPoint, searchTypes, searchRadius, searchService, callback)
    {
      var searchRequest = {
        location: latLngPoint,
        radius: searchRadius,
        types: searchTypes
      };
      this.searchService.search(searchRequest, callback);
    },

    getDirections : function (start, end, typesToSearchFor, searchRadius, travelMode)
    {
      var self = this,
        directions = {
          origin: start,
          destination: end,
          provideRouteAlternatives: false,
          travelMode: travelMode,
          unitSystem: google.maps.UnitSystem.METRIC
        };

      this.map.clearMarkers();
      this.map.clearCircles();
      this.clearResults();

      if(typeof(this.onSearchStart) != 'undefined')
        this.onSearchStart();

      self.directionsService.route(directions, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
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

              self.searchWithinBounds(typesToSearchFor, resultingBounds, function(results, searchStatus) {
                if (searchStatus == google.maps.places.PlacesServiceStatus.OK) {
                  if(this.debugMode == true) {
                    var rect = new google.maps.Rectangle();
                    rect.setBounds(resultingBounds);
                    rect.setMap(self.map);
                  }
                  for (var j = 0; j < results.length; j++) {
                    if(MapHelpers.withinRadiusOfAPoint(results[j], allPoints, searchRadius))
                      self.addMarkerFromPlacesResult(results[j]);
                  }
                }

                if (typeof(self.onSearchEnd) != 'undefined') {
                  self.onSearchEnd(results, searchStatus);
                }
              });
            }
          //// Search method by making loadsa requests
          } else if(self.searchMethod == "RADIUS") {
            var relevantResults = [],
              searchStatus,
              i,
              j,
              searchesCompleted = 0;

            for(i = 0; i < allPoints.length; i++)
            {
              self.searchAroundPoint(allPoints[i], typesToSearchFor, searchRadius, self.searchService, function(results, sStatus) {
                if (sStatus == google.maps.places.PlacesServiceStatus.OK) {
                  if (typeof searchStatus === 'undefined') {
                    // We only set if it's undefined because we want to return a non-200 if anything at all goes wrong down in the else
                    searchStatus = sStatus;
                  }

                  relevantResults = relevantResults.concat(results);

                  for (j = 0; j < results.length; j++) {
                    self.addMarkerFromPlacesResult(results[j]);
                  }

                  if(typeof(self.onSearchStep) != 'undefined') {
                    self.onSearchStep(1, 1);
                  }
                } else {
                  searchStatus = sStatus;
                }

                searchesCompleted += 1;

                if (typeof self.onSearchStep != 'undefined') {
                  self.onSearchStep(searchesCompleted, allPoints.length);
                }

                if (searchesCompleted == allPoints.length && typeof (self.onSearchEnd) != 'undefined') {
                  self.onSearchEnd(relevantResults, searchStatus);
                }
              });

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
  };
}