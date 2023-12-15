import { createElement } from "./dom.js";

/**
 * @param { HTMLImageElement } image
 */
export const imageToImageData = (image) => {
  const canvasContent = createElement("canvas", {
    width: image.width,
    height: image.height
  }).getContext('2d');

  canvasContent.fillStyle = "white";
  canvasContent.fillRect(0, 0, image.width, image.height);
  canvasContent.drawImage(image, 0, 0);

  return canvasContent.getImageData(0, 0, image.width, image.height)
};
