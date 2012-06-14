SCROUTENISE
===========

Scroutenise is a simple javascript toolkit built on top of the <a href="http://code.google.com/apis/maps/documentation/javascript/">Google Maps V3 Javascript API</a> and the <a href="http://code.google.com/apis/maps/documentation/places/">Google Places API</a>, for finding establishments along a route.

This repo is no longer maintained, and all the functionality is now part of the Scroutenise app, which is not open-source, but which you can find at http://www.scroutenise.com/

Honestly though, the implementation is not that different - you can use this code to mess around and fork if you like :)

Usage
-----

Using Scroutenise is quite simple. It depends of course on the Google Maps API so you need to include a reference to their Javascript library including an API key which has been enabled for use of the Places API.

```js
var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

var scroutenise = new Scroutenise(map);

scroutenise.getDirections(
  "Old Street Station, London",
  "Liverpool Street Station, London",
  { types : ['grocery_or_supermarket'] },
  100.00,
  google.maps.TravelMode.DRIVING
);
```

The parameters in getDirections are, in the order of the example

* `start` - a location usable by the <a href="http://code.google.com/apis/maps/documentation/javascript/directions.html">Google Maps Directions Service</a>, the start location of the route.
* `end` - a location usable by the <a href="http://code.google.com/apis/maps/documentation/javascript/directions.html">Google Maps Directions Service</a>, the end location of the route.
* `searchFor` - an object with two properties
 * `types` - a list of place types <a href="http://code.google.com/apis/maps/documentation/places/supported_types.html">supported by the Google Places API</a>
 * `name` - a name of a place you'd like to search for. All results will be restricted to anything that matches this
* `searchRadius` - the radius around which to search for places along the route, in metres
* `travelMode` - a travel mode supported by the Google Maps V3 API