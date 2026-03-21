import { createElement } from "../utils/dom.js";

export function createBio({ onShowBooks } = {}) {
  const section = createElement("section", { className: "hero" });
  const title = createElement("h1", {
    className: "hero__title",
    text: "Hey, I'm Sam.",
  });
  const lede = createElement("p", { className: "hero__lede" });
  const work = createElement("p", { className: "hero__lede" });
  const links = createElement("p", { className: "hero__links" });
  const booksLink = createElement("a", {
    className: "styled-link hero__page-link",
    text: "Here's",
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

  lede.append("I'm from Manchester and currently living in London.");
  work.append(
    "I currently work at ",
    aaveLink,
    " as a backend engineer, bridging fiat and crypto through stablecoins.",
  );
  links.append(booksLink, " a list of books I'm reading.");
  section.append(title, lede, work, links);

  return section;
}
