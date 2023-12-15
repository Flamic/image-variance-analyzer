/**
 * @template { keyof HTMLElementTagNameMap } K
 * @param { K } name
 * @param { Object.<string, string> } attributes
 * @param { (Element | string)[] } children
 * @returns { HTMLElementTagNameMap[K] }
 */
export const createElement = (name, attributes, children) => {
  const element = document.createElement(name);

  attributes &&
    Object.entries(attributes).forEach(([key, value]) => {
      element[key] = value;
    });

  children?.forEach((child) => {
    element.appendChild(filterTextNode(child));
  });

  return element;
};

/**
 * @param { Element | string } content
 */
const filterTextNode = (content) => {
  if (typeof content !== "string") return content;

  return document.createTextNode(content);
};
