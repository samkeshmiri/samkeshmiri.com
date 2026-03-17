import { mixes } from "../data/mixes.js";
import { createElement } from "../utils/dom.js";

export function createMixesSection() {
  const section = createElement("section", {
    className: "section section--mixes",
    attrs: { id: "mixes" },
  });
  const heading = createElement("div", { className: "section-heading" });
  const headingCopy = createElement("div");
  const eyebrow = createElement("p", {
    className: "eyebrow",
    text: "DJ Mixes",
  });
  const audio = createElement("audio", {
    className: "mix-player",
    attrs: {
      controls: true,
      preload: "metadata",
    },
  });
  const list = createElement("ul", { className: "mix-list" });

  headingCopy.append(eyebrow);
  heading.append(headingCopy);
  section.append(heading, audio);

  let activeButton = null;

  mixes.forEach((mix) => {
    const item = createElement("li", { className: "mix-list__item" });
    const button = createElement("button", {
      className: "mix-list__button",
      attrs: {
        type: "button",
      },
    });
    const buttonTitle = createElement("span", {
      className: "mix-list__title",
      text: mix.title,
    });
    const buttonMeta = createElement("span", {
      className: "mix-list__meta",
      text: mix.date,
    });

    button.append(buttonTitle, buttonMeta);
    button.addEventListener("click", async () => {
      audio.src = mix.fileUrl;
      audio.load();

      if (activeButton) {
        activeButton.classList.remove("mix-list__button--active");
      }

      button.classList.add("mix-list__button--active");
      activeButton = button;

      try {
        await audio.play();
      } catch (_error) {}
    });

    item.append(button);
    list.append(item);
  });

  section.append(list);
  return section;
}
