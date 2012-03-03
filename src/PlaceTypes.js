var PlaceTypes = {
  capitalize: function (word, position){
    if(word.length == 2)
    {
      var arrayOfChars = word.split('');
      if(PlaceTypes.Vowels.indexOf(arrayOfChars[0]) == -1 && PlaceTypes.Vowels.indexOf(arrayOfChars[1]) == -1)
        return word.toUpperCase();
      else
        return word.toLowerCase();
    }

    if(PlaceTypes.WordsNotToCapitalize.indexOf(word) == -1 || position == 0)
    {
      var capitalizedWord = word.substring(0, 1).toUpperCase() + word.substring(1);
      return capitalizedWord;
    }
  },

  getPlaceTypesAsHuman: function () {
    var humanTypes = [];
    for(var i = 0; i < PlaceTypes.PlaceTypes.length; i++)
    {
      humanTypes.push(PlaceTypes.underscoredToHuman(PlaceTypes.PlaceTypes[i]));
    }

    for(var aliasIndex in PlaceTypes.Aliases) {
      
      humanTypes.push(PlaceTypes.underscoredToHuman(aliasIndex))
    }
    return humanTypes;
  },

  underscoredToHuman: function (word) {
    var individualWords = word.split('_');
    var finalWord = [];
    for(var w = 0; w < individualWords.length; w++)
    {
      finalWord.push(PlaceTypes.capitalize(individualWords[w], w));
    }
    return finalWord.join(' ');
  },

  getActualTypeIfAlias: function (type) {
    if(typeof(PlaceTypes.Aliases[type]) == 'undefined')
      return type;
    
    return PlaceTypes.Aliases[type];
  }
}

PlaceTypes.Vowels = [
  'a',
  'e',
  'i',
  'o',
  'u'
];

PlaceTypes.WordsNotToCapitalize = [
  'of',
  'the',
  'a',
  'an',
  'it'
];

PlaceTypes.Aliases = {
  "petrol_station" : "gas_station",
  "booze_station" : "liquor_store",
  "coffee_shop" : "cafe",
  "shopping_centre" : "shopping_mall",
  "bike_shop" : "bicycle_store"
};

PlaceTypes.PlaceTypes = [
  "accounting",
  "airport",
  "amusement_park",
  "aquarium",
  "art_gallery",
  "atm",
  "bakery",
  "bank",
  "bar",
  "beauty_salon",
  "bicycle_store",
  "book_store",
  "bowling_alley",
  "bus_station",
  "cafe",
  "campground",
  "car_dealer",
  "car_rental",
  "car_repair",
  "car_wash",
  "casino",
  "cemetery",
  "church",
  "city_hall",
  "clothing_store",
  "convenience_store",
  "courthouse",
  "dentist",
  "department_store",
  "doctor",
  "electrician",
  "electronics_store",
  "embassy",
  "establishment",
  "finance",
  "fire_station",
  "florist",
  "food",
  "funeral_home",
  "furniture_store",
  "gas_station",
  "general_contractor",
  "geocode",
  "grocery_or_supermarket",
  "gym",
  "hair_care",
  "hardware_store",
  "health",
  "hindu_temple",
  "home_goods_store",
  "hospital",
  "insurance_agency",
  "jewelry_store",
  "laundry",
  "lawyer",
  "library",
  "liquor_store",
  "local_government_office",
  "locksmith",
  "lodging",
  "meal_delivery",
  "meal_takeaway",
  "mosque",
  "movie_rental",
  "movie_theater",
  "moving_company",
  "museum",
  "night_club",
  "painter",
  "park",
  "parking",
  "pet_store",
  "pharmacy",
  "physiotherapist",
  "place_of_worship",
  "plumber",
  "police",
  "post_office",
  "real_estate_agency",
  "restaurant",
  "roofing_contractor",
  "rv_park",
  "school",
  "shoe_store",
  "shopping_mall",
  "spa",
  "stadium",
  "storage",
  "store",
  "subway_station",
  "synagogue",
  "taxi_stand",
  "train_station",
  "travel_agency",
  "university",
  "veterinary_care",
  "zoo"
];