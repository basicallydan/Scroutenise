/**
 * @depend PlaceTypes.js
 */

var InfoWindowHelpers = {
  getInfoWindowFor: function (result) {
    var typeLabels = '';

    for (var t = 0; t < result.types.length; t++)
    {
      typeLabels += '<li class="label">' + PlaceTypes.underscoredToHuman(result.types[t]) + '</li>';
    }

    var contentString = '<div class="result-info-content">'+
        '<h2 class="result-info-content-heading">' + result.name + '</h2>'+
        '<div class="result-info-content-body">'+
        '<ul class="result-types">' + typeLabels + '</ul>'+
        '</div>'+
        '</div>';

    var infoWindow = new google.maps.InfoWindow ({
      content: contentString
    });
    
    return infoWindow;
  }
}
