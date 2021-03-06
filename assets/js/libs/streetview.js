var map, geocoder;
var vent;

/*
 * Handle keypress events in Google form.
 */
function checkForEnter(e) {
  if(e.keyCode == 13) { viewAddress(); }
}

/*
 * Navigate to an address on the map.
 */
function viewAddress() {
  var address = jQuery("#placesearch").val();

  if(!geocoder){
    geocoder = new google.maps.Geocoder();
  }

  geocoder.geocode( {'address': address}, function(results, status){
    if(status == google.maps.GeocoderStatus.OK){
      map.setCenter(results[0].geometry.location);
      var pov = {
        heading: 34,
        pitch: 10,
        zoom: 0
      };
      var panorama = map.getStreetView();
      panorama.setPosition(results[0].geometry.location);
      panorama.setPov(pov);
      panorama.setVisible(true);
    }
  });
}

/*
 * Capture Image and inject into canvas.
 */
 
 function captureSV() {
  var SVurl;
  // SATMAPS: added a section to detect if StreetView isn't open. Capture satmap instead
  if(map.getStreetView().getVisible()){
    // get StreetView static image
    var lat = map.getStreetView().getPosition().lat().toFixed(7);
    var lng = map.getStreetView().getPosition().lng().toFixed(7);
    var positionDetails = "";

    positionDetails += "&heading=" + map.getStreetView().getPov().heading.toFixed(4);
    positionDetails += "&pitch=" + map.getStreetView().getPov().pitch.toFixed(4);
    positionDetails += "&fov=90";

    SVurl = 
      "http://maps.googleapis.com/maps/api/streetview?size=600x435&location=" + 
        lat + 
        "," + 
        lng + 
        "&sensor=false" + 
        positionDetails;
  }
  else{
    // get Google Maps satellite static image
    var lat = map.getCenter().lat().toFixed(7);
    var lng = map.getCenter().lng().toFixed(7);
    var zoom = map.getZoom();
    
    SVurl =
      "http://maps.googleapis.com/maps/api/staticmap?size=600x435&center=" +
        lat +
        "," +
        lng +
        "&zoom=" +
        zoom +
        "&sensor=false&maptype=satellite";
  }

  // move background to #bgdiv and scale to be contained by blockee stage
  $("#bgdiv")[0].style.background = "url('" + SVurl + "')";
  $("#bgdiv")[0].style.backgroundRepeat = "no-repeat";
  $("#bgdiv")[0].style.backgroundSize = "contain";

  vent.trigger("remove-element", SVurl);
}

/*
 * Manages interactions with Google StreetView API.
 */
var GooglyStreetView = {
  load: function(v) {
    vent = v;
    var aModal = $("#svModal");
    $("#svModal").modal('toggle'); 

    var locations = [
      // [ latitude, longitude, zoomlevel ]
      [37.799951,-122.417822,13], // SF
      [32.708156,-117.16404,13], // San Diego
      [40.440186,-80.002441,13], // Pittsburgh
      [40.771052,-73.969145,13], // NYC
      [32.079447,-81.084766,13], // Savannah
      [29.950621,-90.060596,13], // NOLA
      [29.425974,-98.491445,13], // San Antonio
      [37.803477,-122.254658,13], // Oakland
      [38.629734,-90.197674,13], // St Louis
      [42.366915,-71.091242,14], // Cambridge, MA
      [41.409454,-75.661211,15] // Scranton, PA
    ];
    
    var randomLocation = Math.floor(Math.random() * locations.length);
    var lat = locations[randomLocation][0];
    var lng = locations[randomLocation][1];
    var ll = new google.maps.LatLng( lat, lng );
    var zval = locations[randomLocation][2];

    var mapOptions = {
      center: ll,
      zoom: zval,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    map = new google.maps.Map($("#modal-map")[0], mapOptions);
  }
}
