/**
 * A point on the Earth represented by a latitude and longitude.
 */
export interface LatLng {
    latitude: number;
    longitude: number;
}

/**
 * A point represented by Cartesian coordinates. Can be converted to or from a [[LatLng]] if a fixed
 * location is chosen as the origin.
 */
export interface Point {
    x: number;
    y: number;
}

/**
 * The (average) radius of the Earth, according to Google. Like all distances in this library, in
 * meters.
 */
export const EARTH_RADIUS = 6.371e6;

/**
 * @param latLng1 A location on Earth.
 * @param latLng2 Another location on Earth.
 * @returns The great circle distance between the two locations, in meters.
 */
export function sphericalDistance(latLng1: LatLng, latLng2: LatLng): number {
    const lat1 = degreesToRadians(latLng1.latitude);
    const lat2 = degreesToRadians(latLng2.latitude);
    const dLat = degreesToRadians(latLng2.latitude - latLng1.latitude);
    const dLng = degreesToRadians(latLng2.longitude - latLng1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c;
}

export function cartesianDistance(point1: Point, point2: Point): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * @param degrees An angle in degrees.
 * @returns The same angle in radians.
 */
export function degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

/**
 * @param radians An angle in radians.
 * @returns The same angle in degrees.
 */
export function radiansToDegrees(radians: number): number {
    return radians * 180 / Math.PI;
}

/**
 * @param distance A distance in meters.
 * @returns The change in latitude which corresponds to traveling along a fixed longitude for the
 *          given distance along the surface of the Earth.
 */
export function dLatitudeForDistance(distance: number): number {
    return radiansToDegrees(distance / EARTH_RADIUS);
}

/**
 * @param distance A distance in meters.
 * @param latitude A fixed latitude.
 * @returns The change in longitude which corresponds to traveling along the given latitude for the
 *          given distance along the surface of the Earth.
 */
export function dLongitudeForDistance(distance: number, latitude: number): number {
    const r = EARTH_RADIUS * Math.cos(degreesToRadians(latitude));
    return radiansToDegrees(distance / r);
}

/**
 * @param dLatitude A difference in latitude.
 * @returns The distance traveled when moving along a fixed longitude for the given change in
 *          latitude along the surface of the Earth.
 */
export function distanceForDLatitude(dLatitude: number): number {
    return EARTH_RADIUS * degreesToRadians(dLatitude);
}

/**
 * @param dLongitude A difference in longitude.
 * @param latitude A fixed latitude.
 * @returns The distance traveled when moving along the given latitude for the given change in
 *          longitude.
 */
export function distanceForDLongitude(dLongitude: number, latitude: number): number {
    const r = EARTH_RADIUS * Math.cos(degreesToRadians(latitude));
    return r * degreesToRadians(dLongitude);
}

/**
 * @param latLng A location on Earth in spherical coordinates.
 * @param center Another location in spherical coordinates to be taken as the origin.
 * @returns A representation of `latLng` in Cartesian coordinates, where `center` is taken to be
 *          the origin and units are in meters.
 */
export function latLngToCartesian(latLng: LatLng, center: LatLng): Point {
  if (latLng === center) {
    return {x: 0, y: 0};
  } else {
    const dLatitude = latLng.latitude - center.latitude;
    const dLongitude = latLng.longitude - center.longitude;
    const x = distanceForDLongitude(dLongitude, center.latitude);
    const y = distanceForDLatitude(dLatitude);
    return {x, y};
  }
}

/**
 * @param point A point in Cartesian coordinates, where units are meters.
 * @param center A point on Earth in spherical coordinates, marking the origin of the Cartesian
 *          coordinate system. 
 * @returns A representation of `point` in spherical coordinates.
 */
export function cartesianToLatLng(point: Point, center: LatLng): LatLng {
  const {x, y} = point;
  if (x === 0 && y === 0) {
    return center;
  } else {
    const dLatitude = dLatitudeForDistance(y);
    const dLongitude = dLongitudeForDistance(x, center.latitude);
    const latitude = center.latitude + dLatitude;
    const longitude = center.longitude + dLongitude;
    return {latitude, longitude};
  }
}
