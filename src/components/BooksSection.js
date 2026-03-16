import { books } from "../data/books.js";
import { createElement } from "../utils/dom.js";

export function createBooksSection() {
  const section = createElement("section", {
    className: "section",
    attrs: { id: "reading" },
  });
  const heading = createElement("div", { className: "section-heading" });
  const headingCopy = createElement("div");
  const eyebrow = createElement("p", {
    className: "eyebrow",
    text: "Books I've read",
  });
  const list = createElement("ul", { className: "reading-list" });

  headingCopy.append(eyebrow);
  heading.append(headingCopy);

  [...books].reverse().forEach((book) => {
    list.append(createBookItem(book));
  });

  section.append(heading, list);
  return section;
}

function createBookItem(book) {
  const item = createElement("li", { className: "reading-list__item" });
  const link = createElement(book.wikiUrl ? "a" : "div", {
    className: "reading-list__link",
    attrs: book.wikiUrl
      ? {
          href: book.wikiUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": `${book.title} on Wikipedia`,
        }
      : {},
  });
  const heading = createElement("h3", {
    className: "reading-list__title",
    text: book.title,
  });
  const meta = createElement("p", {
    className: "reading-list__meta",
    text: `${book.author} • ${book.year}`,
  });

  link.append(heading, meta);
  item.append(link);
  return item;
}
