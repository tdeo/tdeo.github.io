var api_key = 'AIzaSyAzvgVkGFZNr19zI1nsYo0teQqcgBAIfoU';
var image_size = 640;
var image_size_cropped = 620;
var zoom = 12;
var max_zoom = 20;
var g_scale = 2;
var R_EARTH = 6378.1370; // In km

var suggestions = [];

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var tile_size = 256.0;

function toPixels(latitude, longitude) {
  var siny = Math.sin(latitude * Math.PI / 180);
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);
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
  var url = "https://maps.googleapis.com/maps/api/staticmap?zoom=" + zoom + "&scale=" + g_scale + "&size=" + image_size + "x" + image_size + "&maptype=satellite&center=" + latitude + "," + longitude + "&key=" + api_key;
  image.onload = function() {
    context.drawImage(image,
      0, 0,
      g_scale * image_size_cropped, g_scale * image_size_cropped,
      g_scale * column * image_size_cropped, g_scale * row * image_size_cropped,
      g_scale * image_size_cropped, g_scale * image_size_cropped);
    addScale();
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
  canvas.width = g_scale * image_size_cropped * column;
  canvas.height = g_scale * image_size_cropped * row;
};

function addScale() {
  var south = parseFloat(document.getElementById('south').value);
  var west = parseFloat(document.getElementById('west').value);
  var zoom = Math.min(max_zoom, parseInt(document.getElementById('zoom').value));
  var corners = computeCorners(south, west, zoom, image_size_cropped, image_size_cropped);
  var latitude_delta = corners['N'] - corners['S'];
  var distance = 2 * Math.PI * latitude_delta * R_EARTH / 360;
  // Semi-transparent rectangle
  context.globalAlpha = 0.7;
  context.fillStyle = "#BBBBBB";
  context.fillRect(0, canvas.height - 50, image_size_cropped, 50);
  // Path for the U form
  context.globalAlpha = 1;
  context.strokeStyle = "#000000";
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(10, canvas.height - 30);
  context.lineTo(10, canvas.height - 10);
  context.lineTo(image_size_cropped - 10, canvas.height - 10);
  context.lineTo(image_size_cropped - 10, canvas.height - 30);
  context.stroke();
  // Write the text;
  context.font = "30px Arial";
  context.fillStyle = "#000000";
  context.fillText(Math.round(100 * distance) / 100 + 'km', 20, canvas.height - 20)
}

function setCoordinates(north, south, west, east) {
  document.getElementById('north').value = north;
  document.getElementById('south').value = south;
  document.getElementById('west').value = west;
  document.getElementById('east').value = east;
  document.getElementById('zoom').value = approximateZoom();
};

function approximateZoom() {
  var north = parseFloat(document.getElementById('north').value);
  var south = parseFloat(document.getElementById('south').value);
  var west = parseFloat(document.getElementById('west').value);
  var east = parseFloat(document.getElementById('east').value);
  var northeast_px = toPixels(north, east);
  var southwest_px = toPixels(south, west);
  var total_pixels = (northeast_px[0] - southwest_px[0]) * (southwest_px[1] - northeast_px[1]);
  var approximate_zoom = Math.round(Math.log((100 * image_size_cropped * image_size_cropped) / total_pixels) / Math.LOG2E);
  max_zoom = Math.min(approximate_zoom + 1, 20);
  document.getElementById('zoom').max = max_zoom;
  return approximate_zoom;
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
          var elem = null;
          if (e.srcElement) elem = e.srcElement;
          else if (e.target) elem = e.target;
          var viewport = suggestions[elem.id.replace('result_', '')]['geometry']['viewport'];
          setCoordinates(viewport['northeast']['lat'], viewport['southwest']['lat'], viewport['southwest']['lng'], viewport['northeast']['lng']);
        });
      }
    }
  };
  xmlHttp.open('GET', encodeURI('https://maps.googleapis.com/maps/api/geocode/json?address=' + document.getElementById('search_text').value + '&key=' + api_key));
  xmlHttp.send(null);
};

document.getElementById('download').onclick = function() {
  canvas.toBlob(function(blob) {
    saveAs(blob, document.getElementById('search_text').value + '.png');
  });
};

document.getElementById('search').onclick = function() {
  lookCity();
};

document.getElementById('generate').onclick = function() {
  approximateZoom();
  var north = parseFloat(document.getElementById('north').value);
  var south = parseFloat(document.getElementById('south').value);
  var west = parseFloat(document.getElementById('west').value);
  var east = parseFloat(document.getElementById('east').value);
  var zoom = Math.min(max_zoom, parseInt(document.getElementById('zoom').value));
  document.getElementById('zoom').value = zoom;
  getZone(north, south, west, east, zoom);
};
