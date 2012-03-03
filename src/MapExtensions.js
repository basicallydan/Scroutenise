if (typeof(google.maps.Map.everyInfoWindow) === 'undefined')
  google.maps.Map.prototype.everyInfoWindow = [];

if (typeof(google.maps.Map.allMarkers) === 'undefined')
  google.maps.Map.prototype.allMarkers = [];

if (typeof(google.maps.Map.allCircles) === 'undefined')
  google.maps.Map.prototype.allCircles = [];

/*
* Marker Management
*/

if (typeof(google.maps.Map.addMarker) === 'undefined') {
  google.maps.Map.prototype.addMarker = function(marker) {
    marker.setMap(this);
    this.allMarkers.push(marker);
  };
}

if (typeof(google.maps.Map.clearMarkers) === 'undefined') {
  google.maps.Map.prototype.clearMarkers = function()
  {
    if (this.allMarkers) {
      for (var i = 0; i < this.allMarkers.length; i++) {
        this.allMarkers[i].setMap(null);
      }
    }
    this.allMarkers = [];
  };
}

/*
* Circle Management
*/

if (typeof(google.maps.Map.clearCircles) === 'undefined') {
  google.maps.Map.prototype.clearCircles = function()
  {
    if (this.allCircles) {
      for (var i = 0; i < this.allCircles.length; i++) {
        this.allCircles[i].setMap(null);
      }
    }
    this.allCircles = [];
  }
}

if (typeof(google.maps.Map.addCircle) === 'undefined') {
  google.maps.Map.prototype.addCircle = function(circle)
  {
    circle.setMap(this);
    this.allCircles.push(circle);
  }
}

/*
* Info Window Management
*/

if (typeof(google.maps.Map.addInfoWindow) === 'undefined') {
  google.maps.Map.prototype.addInfoWindow = function(infoWindow, marker) {

    var thisMap = this;

    google.maps.event.addListener(marker, 'click', function() {
      for(var i = 0; i < thisMap.everyInfoWindow.length; i++)
      {
        thisMap.everyInfoWindow[i].close();
      }

      infoWindow.open(thisMap, marker);
    });

    google.maps.event.addListener(this, 'click', function() {
      infoWindow.close();
    });

    this.everyInfoWindow.push(infoWindow);
  };
}