import { drawChart } from './chart.js';
import { createElement } from './dom.js';
import {
  fragmentToMathExpectations,
  fragmentToVariance,
  pixelsToFragments,
} from './fragment.js';
import { imageToImageData } from './image.js';
import { INTENSITY_END, INTENSITY_START, imageDataToPixels } from './pixel.js';
import { makeRange, humanFileSize } from './utils.js';

const BG_IMAGE_ID = 'bg-image';
const IMAGE_INPUT_ID = 'image-input';
const IMAGE_TABLE_BODY_ID = 'image-table-body';
const IMAGE_CHART_ID = 'image-chart';
const FILE_BUTTON_ID = 'file-button';
const PLOT_BUTTON_ID = 'plot-button';
const SCALE_BUTTON_ID = 'scale-button';

const pageBackground = document.getElementById(BG_IMAGE_ID); // div
const imageInputElement = document.getElementById(IMAGE_INPUT_ID); // input[type="file"]
const imageTableBodyElement = document.getElementById(IMAGE_TABLE_BODY_ID); // tbody
const imageChartElement = document.getElementById(IMAGE_CHART_ID); // canvas
const fileButtonElement = document.getElementById(FILE_BUTTON_ID); // button
const plotButtonElement = document.getElementById(PLOT_BUTTON_ID); // button
const scaleButtonElement = document.getElementById(SCALE_BUTTON_ID); // button

const CHART_COLORS = [
  'rgba(255, 99, 132, 1)',    // Red
  'rgba(255, 205, 86, 1)',    // Yellow
  'rgba(75, 192, 192, 1)',    // Green
  'rgba(54, 162, 235, 1)',    // Blue
  'rgba(153, 102, 255, 1)',   // Purple
  'rgba(201, 203, 207, 1)',   // Gray
];

//---------------STATE----------------

/**
 * @type { HTMLImageElement[] }
 */
let images = [];

/**
 * @type { { image: HTMLImageElement; data: { intensity: number; variance: number }[] }[] }
 */
let imagesWithSpecifications = [];

//------------END OF STATE------------

const toggleLoading = () => {
  window.document.body.classList.toggle('loading');
};

/**
 * @description Get chart color by index
 * @param { number } index
 */
const getColor = (index) => CHART_COLORS[index % CHART_COLORS.length];

//  ВИБИРАННЯ ФАЙЛУ

fileButtonElement.addEventListener('click', () => {
  imageInputElement.click();
});

// ПОБУДОВА НАТУРАЛЬНОГО ГРАФІКУ

plotButtonElement.addEventListener('click', () => {
  console.time('Analysis duration');
  toggleLoading();

  imagesWithSpecifications = images.map((image) => {
    const fragments = pixelsToFragments(
      imageDataToPixels(imageToImageData(image))
    );

    return {
      image,
      data: fragments.map((fragment) => ({
        intensity: fragment.intensity,
        variance: fragmentToVariance(
          fragment,
          fragmentToMathExpectations(fragment)
        ),
      })),
    };
  });

  drawChart({
    chartCanvasElement: imageChartElement,
    type: 'line',
    xLabel: 'Індекс фрагменту',
    yLabel: 'Дисперсія координат пікселів фрагменту',
    labels: makeRange(INTENSITY_START, INTENSITY_END),
    datasets: imagesWithSpecifications.map((item, index) => ({
      label: item.image.dataset.name,
      data: item.data.map((fragment) => fragment.variance),
      pointStyle: false,
      borderColor: getColor(index),
    })),
    actions: [{ name: 'test', handler: () => {} }],
  });

  console.timeEnd('Analysis duration');
  toggleLoading();

  imageChartElement.scrollIntoView({ behavior: 'smooth' });
});

// ПОБУДОВА МАСШТАБОВАНОГО ГРАФІКУ

scaleButtonElement.addEventListener('click', () => {
  toggleLoading();

  const highestVariances = imagesWithSpecifications.map((item) =>
    item.data.reduce(
      (accumulator, current) => Math.max(accumulator, current.variance),
      0
    )
  );

  const highestVariance = Math.max(...highestVariances);

  drawChart({
    chartCanvasElement: imageChartElement,
    type: 'line',
    xLabel: 'Індекс фрагменту',
    yLabel: 'Дисперсія координат пікселів фрагменту',
    labels: makeRange(INTENSITY_START, INTENSITY_END),
    datasets: imagesWithSpecifications.map((item, itemIndex) => {
      return {
        label: item.image.dataset.name,
        data: item.data.map(
          (fragment) =>
            (fragment.variance / highestVariances[itemIndex]) * highestVariance
        ),
        pointStyle: false,
        borderColor: getColor(itemIndex),
      };
    }),
    actions: [{ name: 'test', handler: () => {} }],
  });

  toggleLoading();

  imageChartElement.scrollIntoView({ behavior: 'smooth' });
});

// ВИБИРАННЯ ФАЙЛУ

imageInputElement.addEventListener('change', async (event) => {
  /**
   * @type { File[] }
   */
  const files = [...event.target.files];
  const largestFile = files.reduce((acc, cur) => cur.size > acc.size ? cur : acc);
  let i = 0;
  images = [];

  // Removing previous results from table
  imageTableBodyElement.innerText = '';
  pageBackground.style.backgroundImage = `url(${URL.createObjectURL(largestFile)})`;

  for (const file of files) {
    await new Promise((res) => {
      const image = createElement('img'); // image for analysis
      const src = URL.createObjectURL(file);

      image.addEventListener('load', () => {
        imageTableBodyElement.appendChild(
          createElement('tr', null, [
            createElement('td', { style: `background-color: ${getColor(i)}` }),
            createElement('td', null, [createElement('img', { src })]), // image for display
            createElement('td', null, [file.name]),
            createElement('td', null, [
              createElement('span', null, [
                `${image.naturalWidth} x ${image.naturalHeight}`,
              ]),
              createElement('br'),
              createElement('span', null, [humanFileSize(file.size, true, 2)]),
            ]),
          ])
        );

        images.push(image);
        res();
        i += 1;
      });

      image.dataset.name = file.name;
      image.src = src;
    });
  }
});
