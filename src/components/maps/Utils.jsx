// import React from 'react';

const api_key = 'AIzaSyAzvgVkGFZNr19zI1nsYo0teQqcgBAIfoU';
const image_size = 532;
const image_size_cropped = 512;
// const zoom = 12;
// const max_zoom = 20;
const R_EARTH = 6378.1370; // In km
const tile_size = 256;
const g_scale = image_size_cropped / tile_size;

// const canvas = document.getElementById("canvas");
// const context = canvas.getContext("2d");

export default class Utils {
  static toPixels(latitude, longitude) {
    var siny = Math.sin(latitude * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
    return [
      tile_size * (0.5 + longitude / 360),
      tile_size * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
    ];
  }

  static toCoordinates(pixels) {
    return [
      Math.asin(Math.tanh(2 * Math.PI * (0.5 - pixels[1] / tile_size))) * 180 / Math.PI,
      360 * (pixels[0] / tile_size - 0.5),
    ];
  }

  static computeCorners(latitude, longitude, zoom) {
    var scale = Math.pow(2, zoom);
    var center = this.toPixels(latitude, longitude);
    var ne = this.toCoordinates([center[0] + image_size_cropped / (2.0 * scale), center[1] - image_size_cropped / (2.0 * scale)]);
    var sw = this.toCoordinates([center[0] - image_size_cropped / (2.0 * scale), center[1] + image_size_cropped / (2.0 * scale)]);
    return {
      'N': ne[0],
      'E': ne[1],
      'S': sw[0],
      'W': sw[1],
    };
  }

  static imageProps(latitude, longitude, zoom, row, col) {
    return {
      key: `${latitude},${longitude},${zoom}`,
      src: 'https://maps.googleapis.com/maps/api/staticmap?' +
        `zoom=${zoom}` +
        `&scale=${g_scale}` +
        `&size=${image_size}x${image_size}` +
        '&maptype=satellite' +
        `&center=${latitude},${longitude}` +
        `&key=${api_key}`,
      x: g_scale * image_size_cropped * col,
      y: g_scale * image_size_cropped * row,
      width: g_scale * image_size_cropped,
      height: g_scale * image_size_cropped,
      crop: {
        x: 0,
        y: 0,
        width: g_scale * image_size_cropped,
        height: g_scale * image_size_cropped,
      }
    };
  }

  static distance(lat, lon1, lon2) { // In km
    return Math.abs(lon1 - lon2) * Math.PI / 360 * R_EARTH * Math.cos(lat * Math.PI / 180);
  }

  static computeImages(props) {
    var images = [];

    var nw = this.toPixels(props.north, props.west);
    var se = this.toPixels(props.south, props.east);
    var n = nw[1] * Math.pow(2, props.zoom);
    var w = nw[0] * Math.pow(2, props.zoom);
    var s = se[1] * Math.pow(2, props.zoom);
    var e = se[0] * Math.pow(2, props.zoom);

    var latPixels = n + g_scale * tile_size / 2;
    var row = 0;
    while (latPixels <= s + g_scale * tile_size / 2) {
      var longPixels = w + g_scale * tile_size / 2;
      var col = 0;
      while (longPixels <= e + g_scale * tile_size / 2) {
        var latLong = this.toCoordinates([longPixels / Math.pow(2, props.zoom), latPixels / Math.pow(2, props.zoom)]);
        images.push(this.imageProps(latLong[0], latLong[1], props.zoom, row, col));
        longPixels += g_scale * tile_size;
        col += 1;
      }
      latPixels += g_scale * tile_size;
      row += 1;
    }

    return {
      images: images,
      width: g_scale * (e - w),
      height: g_scale * (s - n),
      north: props.north,
      west: props.west,
      south: props.south,
      east: props.east,
    };
  }
}
