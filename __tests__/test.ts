import * as Geo from "../src/index";
import { LatLng, Point } from "../src/index";

// All expected numbers are via Wolfram Alpha (https://wolframalpha.com)

// Expect numbers to be within 1% of the actual value.
const TOLERANCE = 0.01;

describe("sphericalDistance()", () => {
    it("should return 0 if the same point is provided twice", () => {
        const latLng: LatLng = { latitude: 123, longitude: 123 };
        expect(Geo.sphericalDistance(latLng, latLng)).toBe(0);
    });

    it("should return the distance between Los Angeles and London", () => {
        const losAngeles: LatLng = { latitude: 34.0522, longitude: -118.2437 };
        const newYork: LatLng = { latitude: 40.7128, longitude: -74.0059 };
        const expectedDistance = 3.944e6;
        const actualDistance = Geo.sphericalDistance(losAngeles, newYork);
        expectToBeClose(actualDistance, expectedDistance);
    });
});

describe("cartesianDistance()", () => {
    it("should return 0 if the same point is provided twice", () => {
        const point: Point = { x: 10, y: 10 };
        expect(Geo.cartesianDistance(point, point)).toBe(0);
    });

    it("should return the correct distance", () => {
        const point1: Point = { x: 1, y: 1 };
        const point2: Point = { x: 4, y: -3 };
        expect(Geo.cartesianDistance(point1, point2)).toBe(5);
    });
});

describe("degreesToRadians()", () => {
    it("should convert correctly", () => {
        const degrees = 180;
        const expectedRadians = Math.PI;
        const actualRadians = Geo.degreesToRadians(degrees);
        expectToBeClose(actualRadians, expectedRadians);
    });
});

describe("radiansToDegrees()", () => {
    it("should convert correctly", () => {
        const radians = Math.PI;
        const expectedDegrees = 180;
        const actualDegrees = Geo.radiansToDegrees(radians);
        expectToBeClose(actualDegrees, expectedDegrees);
    });
});

describe("dLatitudeForDistance()", () => {
    it("should return 0 if the distance is 0", () => {
        expect(Geo.dLatitudeForDistance(0)).toBe(0);
    });

    it("should return the correct change in latitude", () => {
        expectToBeClose(Geo.dLatitudeForDistance(1.106e6), 10);
    });
});

describe("dLongitudeForDistance()", () => {
    it("should return 0 if the distance is 0", () => {
        expect(Geo.dLongitudeForDistance(0, 10)).toBe(0);
    });

    it("should return the correct change in longitude", () => {
        expectToBeClose(Geo.dLongitudeForDistance(1.009e6, 25), 10);
    });
});

describe("distanceForDLatitude()", () => {
    it("should return 0 if the distance is 0", () => {
        expect(Geo.distanceForDLatitude(0)).toBe(0);
    });

    it("should return the correct distance", () => {
        expectToBeClose(Geo.distanceForDLatitude(10), 1.106e6);
    });
});

describe("distanceForDLongitude()", () => {
    it("should return 0 if the distance is 0", () => {
        expect(Geo.distanceForDLongitude(0, 25)).toBe(0);
    });

    it("should return the correct distance", () => {
        expectToBeClose(Geo.distanceForDLongitude(10, 25), 1.009e6);
    });
});

describe("latLngToCartesian()", () => {
    it("should return the origin if latLng and center are the same", () => {
        const latLng: LatLng = { latitude: 10, longitude: 10 };
        expect(Geo.latLngToCartesian(latLng, latLng)).toEqual({ x: 0, y: 0 });
    });

    it("should return the correct coordinates", () => {
        const latLng: LatLng = { latitude: 35, longitude: 15 };
        const center: LatLng = { latitude: 25, longitude: 25 };
        const expected: Point = { x: -1.009e6, y: 1.106e6 };
        const actual = Geo.latLngToCartesian(latLng, center);
        expectToBeClose(actual.x, expected.x);
        expectToBeClose(actual.y, expected.y);
    });
});

describe("cartesianToLatLng()", () => {
    it("should return the center if point is the origin", () => {
        const latLng: LatLng = { latitude: 10, longitude: 10 };
        expect(Geo.cartesianToLatLng({ x: 0, y: 0 }, latLng)).toEqual(latLng);
    });

    it("should return the correct coordinates", () => {
        const point: Point = { x: -1.009e6, y: 1.106e6 };
        const center: LatLng = { latitude: 25, longitude: 25 };
        const expected: LatLng = { latitude: 35, longitude: 15 };
        const actual = Geo.cartesianToLatLng(point, center);
        expectToBeClose(actual.latitude, expected.latitude);
        expectToBeClose(actual.longitude, expected.longitude);
    });
});

function expectToBeClose(actual: number, expected: number): void {
    expect(computeError(actual, expected)).toBeLessThan(TOLERANCE);
}

function computeError(actual: number, expected: number) {
    return Math.abs((expected - actual) / expected);
}
