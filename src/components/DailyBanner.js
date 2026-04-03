import { getDailyItems } from "../utils/dailyItems.js";
import { createElement } from "../utils/dom.js";

const CONTENT_REPEAT_COUNT = 4;

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

  Array.from({ length: CONTENT_REPEAT_COUNT }).forEach((_, repeatIndex) => {
    items.forEach((item, itemIndex) => {
      const entry = createElement("p", {
        className: "daily-banner__item",
        text: `${item.label}: ${item.text}`,
      });

      content.append(entry);

      const isLastItemInRepeat = itemIndex === items.length - 1;
      const isLoopBoundary =
        repeatIndex === CONTENT_REPEAT_COUNT - 1 && isLastItemInRepeat;

      if (isLastItemInRepeat) {
        content.append(
          createElement("span", {
            className: isLoopBoundary
              ? "daily-banner__spacer daily-banner__spacer--loop-boundary"
              : "daily-banner__spacer",
            attrs: { "aria-hidden": "true" },
          }),
        );
      }
    });
  });

  return content;
}
