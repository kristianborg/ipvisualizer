var map;
var geocoder;
var serializeCoordinates = false;

function initialize() {
    var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(39.5, -30.5),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    geocoder = new google.maps.Geocoder();

    getAllCoordinates();

    setTimeout(writeHeatMap, 1000);
}

function writeHeatMap(){
    var heatmapData = [];
    for (var i = 0; i < countries.length; i++) {
        var country = countries[i];
        var latLng = coordinates[country];
        if(latLng != null && latLng != "temp" && country != "Netherlands" && country != null){
            heatmapData.push(new google.maps.LatLng(latLng.lat, latLng.lng));
        }
    }

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        dissipating: false,
    map: map
    });

    if (serializeCoordinates) {
        serializeCoordinates();
    }
}

function serializeCoordinates(){
    document.write("var coordinates= {")
    for(var country in coordinates){
        document.write('"' + country + '" : { lat:' + coordinates[country].lat + ', lng:' + coordinates[country].lng + '}, <br>')
    }
    document.write("}");
}

function getAllCoordinates(){
    for (var i = 0; i < countries.length; i++) {
        var country = countries[i];
        if(coordinates[country] == null){
            coordinates[country] = "temp";
            getCoordinates(country);
        }
    }
}

function getCoordinates(country){
    alert('getting coordinates for unknown country ' + country);
    geocoder.geocode( { 'address': 'country' + country}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latLng = results[0].geometry.location;
            coordinates[country] = {lat: latLng.lat(), lng: latLng.lng()};
        } else {
            alert('Geocode was not successful for the following reason: ' + status + ' for country ' + country);
        }
    });
}

function toggleSettings(){
    $(settings).toggle();
}