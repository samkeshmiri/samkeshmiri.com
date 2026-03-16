import { createElement, createSvg } from "../utils/dom.js";
import { icons } from "./icons.js";

export function createHeader() {
  const header = createElement("header", { className: "site-header" });

  header.append(
    createIconLink({
      href: "https://github.com/samkeshmiri",
      label: "GitHub",
      icon: icons.github,
    }),
    createIconLink({
      href: "https://www.linkedin.com/in/samkeshmiri/",
      label: "LinkedIn",
      icon: icons.linkedin,
    }),
    createIconLink({
      href: "https://soundcloud.com/xsammy",
      label: "SoundCloud",
      icon: icons.soundcloud,
    }),
    createIconLink({
      href: "https://x.com/0xsamthing",
      label: "X",
      icon: icons.x,
    }),
    createIconLink({
      href: "#top",
      label: "Back to top",
      imageSrc: "/s.png",
      imageAlt: "Sam Keshmiri home",
      className: "site-header__home",
      imageClassName: "site-header__image site-header__image--home",
      external: false,
    }),
    createIconLink({
      href: "https://www.strava.com/athletes/23733930/",
      label: "Strava",
      icon: icons.strava,
    }),
    createIconLink({
      href: "https://www.lensfrens.xyz/samthing",
      label: "Lens",
      imageSrc: "/lens_logo_dark.svg",
      imageAlt: "Lens",
      imageClassName: "site-header__image site-header__image--lens",
    }),
  );

  return header;
}

function createIconLink({
  href,
  label,
  icon,
  imageSrc,
  imageAlt,
  imageClassName = "site-header__image",
  className = "",
  external = true,
}) {
  const link = createElement("a", {
    className: ["site-header__link", className].filter(Boolean).join(" "),
    attrs: {
      href,
      "aria-label": label,
      title: label,
      target: external ? "_blank" : null,
      rel: external ? "noopener noreferrer" : null,
    },
  });

  if (imageSrc) {
    link.append(
      createElement("img", {
        className: imageClassName,
        attrs: {
          src: imageSrc,
          alt: imageAlt,
        },
      }),
    );

    return link;
  }

  link.append(createSvg(icon));
  return link;
}
