export function createElement(tagName, options = {}) {
  const { attrs = {}, children = [], className, html, text } = options;
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  Object.entries(attrs).forEach(([name, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    element.setAttribute(name, String(value));
  });

  if (text !== undefined) {
    element.textContent = text;
  }

  if (html !== undefined) {
    element.innerHTML = html;
  }

  children.filter(Boolean).forEach((child) => {
    element.append(child);
  });

  return element;
}

export function createSvg(markup) {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}
