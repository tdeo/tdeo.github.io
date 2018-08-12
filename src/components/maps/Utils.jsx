// import React from 'react';

const api_key = 'AIzaSyAzvgVkGFZNr19zI1nsYo0teQqcgBAIfoU';
const image_size = 640;
const image_size_cropped = 620;
// const zoom = 12;
// const max_zoom = 20;
const g_scale = 2;
// const R_EARTH = 6378.1370; // In km
const tile_size = 256.0;

// const canvas = document.getElementById("canvas");
// const context = canvas.getContext("2d");

export default class Utils {
  static toPixels(latitude, longitude) {
    var siny = Math.sin(latitude * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
    return [
      tile_size * (0.5 + longitude / 360),
      tile_size * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
    ];
  }

  static toCoordinates(pixels) {
    return [
      Math.asin(Math.tanh(2 * Math.PI * (0.5 - pixels[1] / tile_size))) * 180 / Math.PI,
      360 * (pixels[0] / tile_size - 0.5)
    ];
  }

  static computeCorners(latitude, longitude, zoom) {
    var scale = Math.pow(2, zoom)
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
      src: `https://maps.googleapis.com/maps/api/staticmap?zoom=${zoom}&scale=${g_scale}&size=${image_size}x${image_size}&maptype=satellite&center=${latitude},${longitude}&key=${api_key}`,
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
    }
  }

  static computeImages(props) {
    var images = [];

    var corners = this.computeCorners(props.north, props.west, props.zoom);
    var latitude = props.north;
    var row = 0;
    while (latitude >= props.south) {
      var longitude = props.west;
      var col = 0;
      while (longitude <= props.east) {
        images.push(this.imageProps(latitude, longitude, props.zoom, row, col));
        corners = this.computeCorners(latitude, longitude, props.zoom);
        longitude += 2 * (longitude - corners['W']);
        col += 1;
      }
      latitude -= 2 * (latitude - corners['S']);
      row += 1;
    }
    return {
      images: images,
      width: g_scale * image_size_cropped * col,
      height: g_scale * image_size_cropped * row,
    }
  }
}
