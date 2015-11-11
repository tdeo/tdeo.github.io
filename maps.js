var api_key = 'AIzaSyAzvgVkGFZNr19zI1nsYo0teQqcgBAIfoU';
var image_size = 640;
var image_size_cropped = 600;
var zoom = 12;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var tile_size = 256.0;

function toPixels(latitude, longitude) {
  var siny = Math.sin(latitude * Math.PI / 180);
  siny = Math.min(Math.max(siny, -0.99), 0.99);
  return [
    tile_size * (0.5 + longitude / 360),
    tile_size * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  ];
};

function toCoordinates(pixels) {
  return [
    Math.asin(Math.tanh(2 * Math.PI * (0.5 - pixels[1] / tile_size))) * 180 / Math.PI,
    360 * (pixels[0] / tile_size - 0.5)
  ];
};

function computeCorners(latitude, longitude, zoom, width, height) {
  var scale = Math.pow(2, zoom)
  var center = toPixels(latitude, longitude);
  var ne = toCoordinates([center[0] + width / (2.0 * scale), center[1] - height / (2.0 * scale)]);
  var sw = toCoordinates([center[0] - width / (2.0 * scale), center[1] + height / (2.0 * scale)]);
  return {
    'N': ne[0],
    'E': ne[1],
    'S': sw[0],
    'W': sw[1],
  };
}

function getImage(latitude, longitude, zoom, row, column) {
  var image = new Image();
  image.setAttribute('crossOrigin', 'anonymous');
  var url = "https://maps.googleapis.com/maps/api/staticmap?zoom=" + zoom + "&size=" + image_size + "x" + image_size + "&maptype=satellite&center=" + latitude + "," + longitude + "&key=" + api_key;
  image.onload = function() {
    context.drawImage(image, 0, 0, image_size_cropped, image_size_cropped, 0 + column * image_size_cropped, 0 + row * image_size_cropped, image_size_cropped, image_size_cropped);
  };
  image.src = url;
};

function getZone(north, south, west, east, zoom) {
  var corners = computeCorners(north, west, zoom, image_size_cropped, image_size_cropped);
  var latitude = north;
  var row = 0;
  var column = 0;
  while (latitude >= south) {
    var longitude = west;
    column = 0;
    while (longitude <= east) {
      getImage(latitude, longitude, zoom, row, column);
      corners = computeCorners(latitude, longitude, zoom, image_size_cropped, image_size_cropped);
      longitude += 2 * (longitude - corners['W']);
      column += 1;
    }
    latitude -= 2 * (latitude - corners['S']);
    row += 1;
  }
  canvas.width = image_size_cropped * column;
  canvas.height = image_size_cropped * row;
};

function lookCity() {
  document.getElementById('suggestions').innerHTML = '';
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', encodeURI('https://maps.googleapis.com/maps/api/geocode/json?address=' + document.getElementById('search_text').value + '&key=' + api_key), false);
  xmlHttp.send(null);
  var results = JSON.parse(xmlHttp.responseText)['results'];
  if (results.length == 0) {
    document.getElementById('suggestions').innerHTML = 'No results';
  };
  for(var i = 1; i < results.length; i++) {
    document.getElementById('suggestions').innerHTML += results[i]['formatted_address'] + '<br />';
  }
  document.getElementById('north').value = results[0]['geometry']['bounds']['northeast']['lat'];
  document.getElementById('south').value = results[0]['geometry']['bounds']['southwest']['lat'];
  document.getElementById('east').value = results[0]['geometry']['bounds']['northeast']['lng'];
  document.getElementById('west').value = results[0]['geometry']['bounds']['southwest']['lng'];
};

document.getElementById("search").onclick = function() {
  lookCity();
};

document.getElementById("generate").onclick = function() {
  var north = parseFloat(document.getElementById('north').value);
  var south = parseFloat(document.getElementById('south').value);
  var west = parseFloat(document.getElementById('west').value);
  var east = parseFloat(document.getElementById('east').value);
  var zoom = parseInt(document.getElementById('zoom').value);
  getZone(north, south, west, east, zoom);
};
