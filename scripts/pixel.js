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
 */

const RED_COEFFICIENT = 0.2125;
const GREEN_COEFFICIENT = 0.7154;
const BLUE_COEFFICIENT = 0.0721;

const IMAGE_DATA_CHUNK_SIZE = 4;

/**
 * @description Inclusive start
 */
export const INTENSITY_START = 0;
/**
 * @description Exclusive end
 */
export const INTENSITY_END = 256;

/**
 * @param {ImageData} imageData
 */
export const imageDataToPixels = ({ data, width }) => {
  // O(N*M)
  const result = [];

  for (let i = 0; i < data.length; i += IMAGE_DATA_CHUNK_SIZE) {
    const pixel = {
      red: data[i],
      green: data[i + 1],
      blue: data[i + 2],
      x: (i / IMAGE_DATA_CHUNK_SIZE) % width,
      y: Math.floor(i / IMAGE_DATA_CHUNK_SIZE / width),
      intensity: Math.floor(
        RED_COEFFICIENT * data[i] + GREEN_COEFFICIENT * data[i + 1] + BLUE_COEFFICIENT * data[i + 2]
      ),
    };

    result.push(pixel);
  }

  return result;
};
