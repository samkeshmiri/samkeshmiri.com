import { getDailyItems } from "../utils/dailyItems.js";
import { createElement } from "../utils/dom.js";

export function createDailyBanner() {
  const items = getDailyItems();
  const banner = createElement("section", {
    className: "daily-banner",
    attrs: { "aria-label": "Daily updates" },
  });
  const viewport = createElement("div", { className: "daily-banner__viewport" });
  const track = createElement("div", { className: "daily-banner__track" });
  const primaryContent = createBannerContent(items);
  const duplicateContent = createBannerContent(items);

  duplicateContent.setAttribute("aria-hidden", "true");

  track.append(primaryContent, duplicateContent);
  viewport.append(track);
  banner.append(viewport);

  return banner;
}

function createBannerContent(items) {
  const content = createElement("div", { className: "daily-banner__content" });

  for (let repeatIndex = 0; repeatIndex < 4; repeatIndex += 1) {
    items.forEach((item, itemIndex) => {
      const entry = createElement("p", {
        className: "daily-banner__item",
        text: `${item.label}: ${item.text}`,
      });

      content.append(entry);

      if (!(repeatIndex === 3 && itemIndex === items.length - 1)) {
        content.append(
          createElement("span", {
            className: "daily-banner__separator",
            text: "-",
            attrs: { "aria-hidden": "true" },
          }),
        );
      }
    });

    if (repeatIndex < 3) {
      content.append(
        createElement("span", {
          className: "daily-banner__spacer",
          attrs: { "aria-hidden": "true" },
        }),
      );
    }
  }

  return content;
}
