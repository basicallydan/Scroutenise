// if (typeof(google.maps.LatLng.pointAtAngleWithRadius) === 'undefined') {
//   google.maps.LatLng.prototype.pointAtAngleWithRadius = function(angleInDegrees, radius)
//   {        
//     var angleInRads = angleInDegrees.toRad();

//     var lat = this.lat();
//     var lng = this.lng();
//     var cLat = (radius / 3963).toDeg();      //  using 3963 as earth's radius
//     var cLng = cLat / Math.cos(lat.toRad());

//     Cx = lng + (cLng * Math.cos(angleInRads));
//     Cy = lat + (cLat * Math.sin(angleInRads));

//     var val = (Cy - lat) / cLat;

//     var angleBack = Math.asin(val);

//     return new google.maps.LatLng(Cy,Cx);
//   }
// }


if (typeof(google.maps.LatLng.pointAtAngleWithRadius) === 'undefined') {
  google.maps.LatLng.prototype.pointAtAngleWithRadius = function(brng, radius) {
    var lat = this.lat();
    var lng = this.lng();

    var earthRadius = 6371000;

    radius = typeof(radius) == 'number' ? radius : typeof(radius) == 'string' && radius.trim() != '' ? +radius : NaN;

    radius = radius / earthRadius;

    brng = brng.toRad();

    var lat1 = lat.toRad(),
        lon1 = lng.toRad();

    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(radius) + Math.cos(lat1) * Math.sin(radius) * Math.cos(brng));
    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(radius) * Math.cos(lat1), Math.cos(radius) - Math.sin(lat1) * Math.sin(lat2));
    lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
  }
}

if (typeof(google.maps.LatLng.getLatLngBounds) === 'undefined')
{
  google.maps.LatLng.prototype.getLatLngBounds = function(radius)
  {
    var nePoint = this.pointAtAngleWithRadius(45, radius);
    var swPoint = this.pointAtAngleWithRadius(225, radius);

    var bounds = new google.maps.LatLngBounds(swPoint, nePoint);

    return bounds;
  }
}

if (typeof(google.maps.LatLngBounds.expandBy) === 'undefined')
{
  google.maps.LatLngBounds.prototype.expandBy = function(radius)
  {
    var nePoint = this.getNorthEast().pointAtAngleWithRadius(45, radius);
    var swPoint = this.getSouthWest().pointAtAngleWithRadius(225, radius);

    var bounds = new google.maps.LatLngBounds(swPoint, nePoint);

    return bounds;
  }
}