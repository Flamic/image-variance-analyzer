

/**
 * @template T
 * @param { T[] } array
 * @param { string } key
 * @returns { Object.<string, T[]> }
 */
export const groupBy = (array, key) =>
  array.reduce((accumulator, item) => {
    (accumulator[item[key]] = accumulator[item[key]] || []).push(item);

    return accumulator;
  }, {});

// unreal to type
export const objectToObjectArray = (object, keyKey, valueKey) =>
  Object.entries(object).map(([key, value]) => ({
    [keyKey]: Number(key),
    [valueKey]: value,
  }));

/**
 * @description Makes a range (array) of numbers from start to end
 * @param { number } start inclusive
 * @param { number } end exclusive
 */
export const makeRange = (start, end) =>
  Array.from({ length: end - start }).map((_, index) => index + start);

/**
 * @description immutable method to fill gaps in array based on provided key. Array must be sorted in ascending order by that key!
 * @template T
 * @param { T[] } array
 * @param { string } key
 * @param { Object } template object with other properties (except for key) to be put in the gaps
 * @param { number } startValue inclusive start
 * @param { number } endValue exclusive end
 */
export const fillGaps = (array, key, template, startValue, endValue) => {
  // O(256*2)
  const range = Array.from({ length: endValue - startValue }).map(
    (_, index) => ({
      [key]: index,
      ...template,
    })
  );

  array.forEach((item) => {
    range[item[key]] = item;
  });

  return range;
};

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export const humanFileSize = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' Б';
  }

  const units = si
    ? ['кБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЕБ', 'ЗБ', 'ЙБ']
    : ['КіБ', 'МіБ', 'ГіБ', 'ТіБ', 'ПіБ', 'ЕіБ', 'ЗіБ', 'ЙіБ'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + ' ' + units[u];
};
