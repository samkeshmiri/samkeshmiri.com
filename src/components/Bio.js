import { createElement } from "../utils/dom.js";

export function createBio({ onShowBooks } = {}) {
  const section = createElement("section", { className: "hero" });
  const title = createElement("h1", {
    className: "hero__title",
    text: "Hey, I'm Sam.",
  });
  const lede = createElement("p", { className: "hero__lede" });
  const links = createElement("div", { className: "hero__links" });
  const booksLink = createElement("a", {
    className: "styled-link hero__page-link",
    text: "A running list of books I've read and am reading",
    attrs: {
      href: "#books",
    },
  });
  const aaveLink = createElement("a", {
    className: "styled-link",
    text: "Aave Labs",
    attrs: {
      href: "https://aave.com/about",
      target: "_blank",
      rel: "noopener noreferrer",
    },
  });

  if (onShowBooks) {
    booksLink.addEventListener("click", (event) => {
      event.preventDefault();
      onShowBooks();
    });
  }

  lede.append("I'm a backend engineer helping build the future of finance with ", aaveLink);
  links.append(booksLink);
  section.append(title, lede, links);

  return section;
}
