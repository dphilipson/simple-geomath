# Geomath

Minimalist library for math involving latitude and longitude.

## Installation

```
npm install --save geomath
```

## API

[View full documentation](https://dphilipson.github.io/geomath).

## Sample Usage
``` javascript
import * as Geo from "geomath";

const losAngeles = { latitude: 34.0522, longitude: -118.2437 };
const newYork = { latitude: 40.7128, longitude: -74.0059 };
Geo.sphericalDistance(losAngeles, newYork);
// 3.944e6, the distance between Los Angeles and New York in meters.

Geo.latLngToCartesian(losAngeles, newYork);
// { x: -3.728e6, y: -7.406e5 }
// These are the coordinates of Los Angeles in a coordinate system centered at
// New York and with meter units. In other words, Los Angeles is ~3700 km west
// and ~740 km south of New York.
```
To see more available functions,
[view the full documentation](https://dphilipson.github.io/geomath).

## Current Limitations

This library is focused on the use case of converting a small section of the
Earth to Cartesian coordinates. As such, there are several limitations:

* Projections are inaccurate over large areas. This is a limitation of all
  projections of spherical coordinates onto Cartesian. See
  [Map Projection on Wikipedia](https://en.wikipedia.org/wiki/Map_projection).
* Projections of regions containing the north or south pole are wonky. I
  recommend you stay away.
* The 180° longitude line (where longitude switches from +180° to -180°) causes
  problems for the `sphericalDistance` function and for projections. I recommend
  you stay away from it too.

Copyright © 2016 David Philipson
