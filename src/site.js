import { createBio } from "./components/Bio.js";
import { createBooksSection } from "./components/BooksSection.js";
import { createHeader } from "./components/Header.js";
import { createMixesSection } from "./components/MixesSection.js";
import { createElement } from "./utils/dom.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Missing #app root.");
}

const page = createElement("div", {
  className: "page",
  attrs: { id: "top" },
});
const main = createElement("main", { className: "content-shell" });
const card = createElement("div", { className: "content-card" });
const viewRoot = createElement("div", { className: "content-card__body" });

card.append(viewRoot);
main.append(card);
page.append(
  createHeader({
    onShowHome: () => {
      if (getCurrentView() === "home") {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      navigate("home");
    },
  }),
  main,
);
app.append(page);

window.addEventListener("popstate", () => {
  render(getCurrentView());
});

render(getCurrentView());

function getCurrentView() {
  if (window.location.hash === "#books") {
    return "books";
  }

  if (window.location.hash === "#mixes") {
    return "mixes";
  }

  return "home";
}

function navigate(view) {
  const currentView = getCurrentView();

  if (view === currentView) {
    return;
  }

  let nextHash = "";

  if (view === "books") {
    nextHash = "#books";
  } else if (view === "mixes") {
    nextHash = "#mixes";
  }

  const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;

  window.history.pushState({ view }, "", nextUrl);
  render(view);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function render(view) {
  pauseActiveMedia();

  if (view === "books") {
    viewRoot.replaceChildren(createBooksSection());
    return;
  }

  if (view === "mixes") {
    viewRoot.replaceChildren(createMixesSection());
    return;
  }

  viewRoot.replaceChildren(
    createBio({
      onShowBooks: () => navigate("books"),
      onShowMixes: () => navigate("mixes"),
    }),
  );
}

function pauseActiveMedia() {
  const audio = viewRoot.querySelector("audio");

  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
}
