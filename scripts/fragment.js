import { INTENSITY_END, INTENSITY_START } from "./pixel.js";
import {
  fillGaps,
  groupBy,
  objectToObjectArray,
} from "./utils.js";

/**
 * @typedef {Object} Pixel
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 * @property {number} x
 * @property {number} y
 *
 * @typedef {Object} PixelWithIntensityBase
 * @property {number} intensity
 *
 * @typedef {Pixel & PixelWithIntensityBase} PixelWithIntensity
 *
 * @typedef {Object} Fragment
 * @property {number} intensity
 * @property {PixelWithIntensity[]} pixels
 *
 * @typedef {Object} MathExpectation
 * @property {number} x
 * @property {number} y
 */

/**
 * @param {PixelWithIntensity[]} pixels
 * @return {Fragment[]}
 */
export const pixelsToFragments = (pixels) =>
  fillGaps(objectToObjectArray(groupBy(pixels, "intensity"), "intensity", "pixels"), 'intensity', { pixels: [] }, INTENSITY_START, INTENSITY_END);

/**
 * @param {Fragment} fragment
 * @returns {MathExpectation}
 */
export const fragmentToMathExpectations = (fragment) => {
  const { length } = fragment.pixels; //Ks

  if (!length) {
    return {
      x: 0,
      y: 0,
    };
  }

  const sums = fragment.pixels.reduce(
    (accumulator, pixel) => ({
      x: accumulator.x + pixel.x,
      y: accumulator.y + pixel.y,
    }),
    { x: 0, y: 0 }
  );

  return {
    x: sums.x / length,
    y: sums.y / length,
  };
};

/**
 * @param {Fragment} fragment
 * @param {MathExpectation} mathExpectations
 */
export const fragmentToVariance = (fragment, mathExpectations) =>
  fragment.pixels.length
    ? fragment.pixels.reduce(
        (accumulator, pixel) =>
          accumulator +
          (pixel.x - mathExpectations.x) ** 2 +
          (pixel.y - mathExpectations.y) ** 2,
        0
      ) / fragment.pixels.length
    : 0;
