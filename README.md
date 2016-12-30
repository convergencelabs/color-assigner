# Color Assigner
[![Build Status](https://travis-ci.org/convergencelabs/color-assigner.svg?branch=master)](https://travis-ci.org/convergencelabs/color-assigner)

The color assigner will manage assigning consistent colors to unique resources
in your application.  This could be users, labels, etc.  You may define a 
palette or preferred colors to use.  The colors from the palette will be used
in a least recently used (LRU) fashion.  If a color from the palette is 
available, it will be assigned.  Otherwise, a random color will be generated.
When a resource no longer needs the color, the color may be released.  If
a color being released is one from the palette, it will be place on the end
of the list of available palette colors.

## Installation
```npm install --save @convergence/color-assigner```
or
```npm install --save-dev @convergence/color-assigner```

## Basic Usage

```javascript
// Create a new ColorAssigner using the default palette of colors.
var ColorAssigner = require("@convergence/color-assigner");

var ca = new ColorAssigner();

// Get a new color for "id1"
var color1a = ca.getColorAsHex("id1");

// The same color will be returned again
var color1b = ca.getColorAsHex("id1");

// Release the color
ca.releaseColor("id1");

// A new color will be returned for id1.
var color1b = ca.getColorAsHex("id1");

// Get a color as an rgba string e.g. 'rgba (234, 40, 132, 255)'
var color2 = ca.getColorAsRgba("id2");
```

## Advanged Usage

```javascript
// Create a new ColorAssigner using one of the built in palettes.
var ColorAssigner = require("@convergence/color-assigner");

var ca1 = new ColorAssigner(ColorAssigner.Palettes.DEFAULT);
var ca2 = new ColorAssigner(ColorAssigner.Palettes.DARK_12);
var ca3 = new ColorAssigner(ColorAssigner.Palettes.LIGHT_12);

// Create a new ColorAssigner using your own palette. 
// Any css color format is acceptable.
var colors = [
  'royalblue',               // css color name
  '#ff0000',                 // hex
  'rgba(128, 255, 128, 255)' // rgba
];
var ca4 = new ColorAssigner(colors);
```
