import { createElement } from "../utils/dom.js";

export function createBio() {
  const section = createElement("section", { className: "hero" });
  const title = createElement("h1", {
    className: "hero__title",
    text: "Hey, I'm Sam.",
  });
  const lede = createElement("p", { className: "hero__lede" });
  const aaveLink = createElement("a", {
    className: "styled-link",
    text: "Aave Labs",
    attrs: {
      href: "https://aave.com/about",
      target: "_blank",
      rel: "noopener noreferrer",
    },
  });

  lede.append("I'm building the future of finance with ", aaveLink);
  section.append(title, lede);

  return section;
}
