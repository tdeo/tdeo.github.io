var api_key = 'AIzaSyAzvgVkGFZNr19zI1nsYo0teQqcgBAIfoU';
var image_size = 640;
var image_size_cropped = 620;
var zoom = 12;

var suggestions = [];

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
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      suggestions = JSON.parse(xmlHttp.responseText)['results'];
      if (suggestions.length == 0) {
        document.getElementById('suggestions').innerHTML = 'No results';
      };
      for(var i = 0; i < suggestions.length; i++) {
        document.getElementById('suggestions').innerHTML += '<a href="#" id="result_' + i + '">' + suggestions[i]['formatted_address'] + '</a><br />';
      }
      for(var i = 0; i < suggestions.length; i++) {
        document.getElementById('result_' + i).addEventListener('click', function(e) {
          var j = e.srcElement.id.replace('result_', '')
          document.getElementById('north').value = suggestions[j]['geometry']['viewport']['northeast']['lat'];
          document.getElementById('south').value = suggestions[j]['geometry']['viewport']['southwest']['lat'];
          document.getElementById('east').value = suggestions[j]['geometry']['viewport']['northeast']['lng'];
          document.getElementById('west').value = suggestions[j]['geometry']['viewport']['southwest']['lng'];
        });
      }
      document.getElementById('north').value = suggestions[0]['geometry']['viewport']['northeast']['lat'];
      document.getElementById('south').value = suggestions[0]['geometry']['viewport']['southwest']['lat'];
      document.getElementById('east').value = suggestions[0]['geometry']['viewport']['northeast']['lng'];
      document.getElementById('west').value = suggestions[0]['geometry']['viewport']['southwest']['lng'];
    }
  };
  xmlHttp.open('GET', encodeURI('https://maps.googleapis.com/maps/api/geocode/json?address=' + document.getElementById('search_text').value + '&key=' + api_key));
  xmlHttp.send(null);
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
