import { books } from "../data/books.js";
import { createElement } from "../utils/dom.js";

export function createBooksSection() {
  const section = createElement("section", {
    className: "section section--books",
    attrs: { id: "reading" },
  });
  const list = createElement("ul", { className: "reading-list" });

  [...books].reverse().forEach((book) => {
    list.append(createBookItem(book));
  });

  section.append(list);
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
  const copy = createElement("div", { className: "reading-list__copy" });
  const heading = createElement("h3", {
    className: "reading-list__title",
    text: book.title,
  });
  const meta = createElement("p", {
    className: "reading-list__meta",
    text: `${book.author} • ${book.year}`,
  });

  copy.append(heading, meta);
  link.append(copy);

  if (book.coverImageUrl) {
    const cover = createElement("img", {
      className: "reading-list__cover",
      attrs: {
        src: book.coverImageUrl,
        alt: "",
        loading: "lazy",
        decoding: "async",
        width: book.coverImageWidth,
        height: book.coverImageHeight,
      },
    });
    link.append(cover);
  }

  item.append(link);
  return item;
}
