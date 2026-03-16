import { createBio } from "./components/Bio.js";
import { createBooksSection } from "./components/BooksSection.js";
import { createHeader } from "./components/Header.js";
import { createElement } from "./utils/dom.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Missing #app root.");
}

const page = createElement("div", {
  className: "page",
  attrs: { id: "top" },
});
const main = createElement("main", { className: "layout" });
const mainColumn = createElement("div", { className: "layout__main" });
const sidebar = createElement("aside", {
  className: "layout__sidebar",
  attrs: { "aria-label": "Books I've read" },
});

mainColumn.append(createBio());
sidebar.append(createBooksSection());
main.append(mainColumn, sidebar);
page.append(createHeader(), main);
app.append(page);
