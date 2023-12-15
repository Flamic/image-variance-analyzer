/**
 * @typedef {Object} ChartParameters
 * @property {HTMLCanvasElement} chartCanvasElement
 * @property {string} labels
 * @property {{ label: string; data: number; pointStyle?: boolean; borderColor?: string }[]} datasets
 * @property {{ name: string; handler: () => void }[]} actions
 * @property {string} xLabel
 * @property {string} yLabel
 * @property {string} type
 */

let chart = null;

/**
 * @param {ChartParameters} params
 */
export const drawChart = ({
  chartCanvasElement,
  labels,
  datasets,
  xLabel,
  yLabel,
  type,
  actions,
}) => {
  chart?.destroy();

  chart = new Chart(chartCanvasElement, {
    type: type || 'line',
    options: {
      scales: {
        x: {
          title: {
            display: Boolean(xLabel),
            text: xLabel,
          },
        },
        y: {
          title: {
            display: Boolean(yLabel),
            text: yLabel,
          },
        },
      },
      actions,
    },
    data: {
      labels,
      datasets,
    },
  });
};
