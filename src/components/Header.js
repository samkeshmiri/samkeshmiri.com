import { createElement, createSvg } from "../utils/dom.js";
import { icons } from "./icons.js";

export function createHeader({ onShowHome } = {}) {
  const header = createElement("header", { className: "site-header" });

  header.append(
    createIconLink({
      href: "#top",
      label: "Home",
      imageSrc: "/s.png",
      imageAlt: "Sam Keshmiri home",
      imageClassName: "site-header__image--home",
      external: false,
      onClick: onShowHome,
    }),
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
      href: "https://open.spotify.com/user/xsammy_",
      label: "Spotify",
      icon: icons.spotify,
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
  onClick,
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

  if (onClick) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      onClick();
    });
  }

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
