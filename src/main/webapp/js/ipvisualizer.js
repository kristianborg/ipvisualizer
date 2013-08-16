var map;
var geocoder;
var heatmap;
var markerCluster;
var markers = [];
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

    setTimeout(drawLayers, 1000);
}

function drawLayers(){
    drawHeatMap();
    drawClusters();
    if (serializeCoordinates) {
        serializeCoordinates();
    }
}

function drawHeatMap(){
    var heatmapData = [];
    for (var i = 0; i < countries.length; i++) {
        var country = countries[i];
        var latLng = coordinates[country];
        if(latLng != null && latLng != "temp" && country != "Netherlands" && country != null){
            heatmapData.push(new google.maps.LatLng(latLng.lat, latLng.lng));
        }
    }

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        dissipating: false,
    });

    var showHeatMap = getParameterByName("heatmap") === "true";
    toggleHeatMap(showHeatMap);
    $('#heatmap').prop('checked', showHeatMap);
}

function drawClusters(){
    for (var i = 0; i < countries.length; i++) {
        var country = countries[i];
        var latLng = coordinates[country];
        if(latLng != null && latLng != "temp" && country != "Netherlands" && country != null){
            markers.push(new google.maps.Marker({'position': new google.maps.LatLng(latLng.lat, latLng.lng)}));
        }
    }

    var showCluster = getParameterByName("cluster") === "true";
    $('#cluster').prop('checked', showCluster);
    if (showCluster){
        markerCluster = new MarkerClusterer(map, markers);
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

function toggleHeatMap(){
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleCluster(){
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleSettings(){
    $(settings).toggle();
}

// source: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function toggleHeatMap(show){
    if(show){
        heatmap.setMap(map);
    } else {
        heatmap.setMap(null);
    }
}

function toggleCluster(show){
    if(show){
        markerCluster = new MarkerClusterer(map, markers);
    } else {
        markerCluster.clearMarkers();
    }
}

$(document).ready(function () {
    $('#heatmap').change(function() {
        toggleHeatMap($(this).is(':checked'));
    });
    $('#cluster').change(function() {
        toggleCluster($(this).is(':checked'));
    });
});