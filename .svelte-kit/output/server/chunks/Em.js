import { Z as fallback, a1 as head, ac as slot, J as attr_class, K as attr_style, N as bind_props, ad as stringify, G as attr, _ as getContext, Y as escape_html, X as ensure_array_like } from "./renderer.js";
import parse from "parse-color";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const light = {
  // Text
  "--ons-color-text": "--ons-color-black",
  "--ons-color-text-light": "--ons-color-grey-75",
  "--ons-color-text-link": "--ons-color-ocean-blue",
  "--ons-color-text-link-hover": "--ons-color-night-blue",
  "--ons-color-text-link-active": "--ons-color-night-blue",
  "--ons-color-text-link-focus": "--ons-color-black",
  "--ons-color-text-inverse": "--ons-color-white",
  "--ons-color-text-inverse-link": "--ons-color-white",
  "--ons-color-text-inverse-link-hover": "--ons-color-grey-5",
  "--ons-color-text-banner-link": "--ons-color-grey-100",
  "--ons-color-text-banner-link-hover": "--ons-color-black",
  "--ons-color-text-metadata": "--ons-color-black",
  // Background
  "--ons-color-page-light": "--ons-color-white",
  "--ons-color-input-bg": "--ons-color-white",
  "--ons-color-hero-bg": "--ons-color-branded-tint",
  "--ons-color-hero-bg-dark": "--ons-color-branded",
  "--ons-color-banner-bg": "--ons-color-grey-5",
  "--ons-color-banner-bg-dark": "--ons-color-grey-15",
  "--ons-color-banner-browser-bg:": "--ons-color-black",
  // Other
  "--ons-color-focus": "--ons-color-sun-yellow",
  "--ons-color-focus-dark": "--ons-color-sun-yellow-dark",
  "--ons-color-highlight": "--ons-color-neon-yellow",
  "--ons-color-borders": "--ons-color-grey-35",
  "--ons-color-borders-indent": "--ons-color-grey-35",
  "--ons-color-borders-light": "--ons-color-grey-35"
};
const dark = {
  // Text
  "--ons-color-text": "--ons-color-white",
  "--ons-color-text-light": "--ons-color-grey-35",
  "--ons-color-text-link": "--ons-color-white",
  "--ons-color-text-link-hover": "--ons-color-grey-5",
  "--ons-color-text-link-active": "--ons-color-grey-5",
  "--ons-color-text-link-focus": "--ons-color-black",
  "--ons-color-text-inverse": "--ons-color-white",
  "--ons-color-text-inverse-link": "--ons-color-white",
  "--ons-color-text-inverse-link-hover": "--ons-color-grey-5",
  "--ons-color-text-banner-link": "--ons-color-grey-5",
  "--ons-color-text-banner-link-hover": "--ons-color-white",
  "--ons-color-text-metadata": "--ons-color-white",
  // Background
  "--ons-color-page-light": "--ons-color-black",
  "--ons-color-input-bg": "--ons-color-white",
  "--ons-color-hero-bg": "--ons-color-branded-tint",
  "--ons-color-hero-bg-dark": "--ons-color-branded",
  "--ons-color-banner-bg": "--ons-color-grey-100",
  "--ons-color-banner-bg-dark": "--ons-color-grey-75",
  "--ons-color-banner-browser-bg:": "--ons-color-white",
  // Other
  "--ons-color-focus": "--ons-color-sun-yellow",
  "--ons-color-focus-dark": "--ons-color-sun-yellow-dark",
  "--ons-color-highlight": "--ons-color-neon-yellow",
  "--ons-color-borders": "--ons-color-grey-75",
  "--ons-color-borders-indent": "--ons-color-grey-75",
  "--ons-color-borders-light": "--ons-color-grey-75"
};
const paleblue = { ...light, "--ons-color-page-light": "--ons-color-ocean-blue-tint" };
const blue = { ...dark, "--ons-color-page-light": "--ons-color-ocean-blue" };
const navyblue = { ...dark, "--ons-color-page-light": "--ons-color-night-blue" };
const grey = { ...light, "--ons-color-page-light": "--ons-color-grey-5" };
const themes = { light, dark, paleblue, blue, navyblue, grey };
function Theme($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let style;
    let theme = fallback($$props["theme"], null);
    let overrides = fallback($$props["overrides"], () => ({}), true);
    let background = fallback($$props["background"], null);
    let global = fallback($$props["global"], false);
    let allowClientOverrides = fallback($$props["allowClientOverrides"], false);
    let cls = fallback($$props["cls"], null);
    function makeStyle(theme2, overrides2) {
      if (theme2) {
        const _theme = { ...themes[theme2], ...overrides2 };
        return Object.keys(_theme).map((key) => `${key}:${_theme[key].startsWith("--") ? `var(${_theme[key]})` : _theme[key]};`).join("");
      }
      return "";
    }
    style = makeStyle(theme, overrides);
    head("i236ii", $$renderer2, ($$renderer3) => {
      if (global && (style || background)) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`${html(`<style>:root{${style}background:${background || "var(--ons-color-page-light)"};color:var(--ons-color-text);</style>`)}`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    if (global || !(theme || background)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attr_class(`ons-svelte-theme-wrapper ${stringify(cls)}`, "svelte-i236ii")}${attr_style(style, { background })}>`);
      if (allowClientOverrides) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="client-css-override"${attr_style("", { display: "contents" })}><!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, {
      theme,
      overrides,
      background,
      global,
      allowClientOverrides,
      cls
    });
  });
}
function Container($$renderer, $$props) {
  let id = fallback($$props["id"], null);
  let cls = fallback($$props["cls"], null);
  let width = fallback($$props["width"], "wide");
  let height = fallback($$props["height"], null);
  let marginTop = fallback($$props["marginTop"], false);
  let marginBottom = fallback($$props["marginBottom"], false);
  let theme = fallback($$props["theme"], null);
  let themeOverrides = fallback($$props["themeOverrides"], () => ({}), true);
  let background = fallback($$props["background"], null);
  Theme($$renderer, {
    theme,
    overrides: themeOverrides,
    background,
    children: ($$renderer2) => {
      $$renderer2.push(`<div${attr("id", id)}${attr_class(`ons-page__container ${stringify(cls || "")}`, void 0, {
        "ons-container": width !== "full",
        "ons-container--wide": width === "wider",
        "ons-u-mt-xl": marginTop,
        "ons-u-mb-xl": marginBottom
      })}${attr_style("", {
        height: typeof height === "number" ? `${height}px` : height === "full" ? "100vh" : height
      })}>`);
      if (width === "narrow") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="ons-grid"><div class="ons-grid__col ons-col-10@m ons-col-8@l"><!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></div></div>`);
      } else if (width === "medium") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="ons-grid"><div class="ons-grid__col ons-col-10@l"><!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    },
    $$slots: { default: true }
  });
  bind_props($$props, {
    id,
    cls,
    width,
    height,
    marginTop,
    marginBottom,
    theme,
    themeOverrides,
    background
  });
}
function SkipLink($$renderer, $$props) {
  let href = fallback($$props["href"], "#main");
  $$renderer.push(`<a class="ons-skip-to-content"${attr("href", href)}>Skip to main content</a>`);
  bind_props($$props, { href });
}
function Icon($$renderer, $$props) {
  let type = fallback($$props["type"], "arrow");
  let size = fallback($$props["size"], null);
  let rotation = fallback($$props["rotation"], 0);
  let svgPath = fallback($$props["svgPath"], null);
  let svgViewBox = fallback($$props["svgViewBox"], "0 0 24 24");
  let marginLeft = fallback($$props["marginLeft"], false);
  let marginRight = fallback($$props["marginRight"], false);
  const paths = {
    arrow: {
      d: "m10 .2-.9.9c-.1.1-.1.4 0 .5l4 4H.6c-.2 0-.4.2-.4.4v1.2c0 .2.2.4.4.4h12.5l-3.9 3.7c-.2.2-.2.4 0 .6l.8.9c.2.2.4.2.6 0L16.8 7c.2-.2.2-.4 0-.6L10.7.3c-.3-.2-.5-.2-.7-.1Z",
      viewBox: "0 0 17 13"
    },
    carret: {
      d: "M1.4,0.1l4.5,5.1l4.5,-5.1a0.45,0.45 0,0,1 .6,0l.7,.7a.45,.45 0,0,1 0,.5l-5.5,6.2a.45,.45 0,0,1 -.6,0l-5.5,-6.1a.45,.45 0,0,1 0,-.6l.7,-.7a.45,.45 0,0,1 .6,0Z",
      viewBox: "0 0 11.8 7.7"
    },
    chevron: {
      d: "M.74,12.7l-.57,-.56a.5,.5 0,0,1 0,-.71l5,-5l-5,-5a.5,.5 0,0,1 0,-.71l.57,-.56a.5,.5 0,0,1 .71,0l5.93,5.93a.5,.5 0,0,1 0,.7l-5.93,5.93a.5,.5 0,0,1 -.71,0Z",
      viewBox: "0 0 8 13"
    },
    cog: {
      d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6Z",
      viewBox: "2 2 20 20"
    },
    code: {
      d: "M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z",
      viewBox: "2 2 20 20"
    },
    copy: {
      d: "M15 20H5V7c0-.55-.45-1-1-1s-1 .45-1 1v13c0 1.1.9 2 2 2h10c.55 0 1-.45 1-1s-.45-1-1-1m5-4V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2m-2 0H9V4h9z",
      viewBox: "2 2 20 20"
    },
    cross: {
      d: "M12 1.2086L10.7914 0L6 4.79155L1.20857 0L0 1.2086L4.79143 6.00015L0 10.7917L1.20857 12.0003L6 7.20875L10.7914 12.0003L12 10.7917L7.20857 6.00015L12 1.2086Z",
      viewBox: "0 0 12 12"
    },
    download: {
      d: "M5.6 9a.48.48 0 0 0 .7 0l3-3.2a.48.48 0 0 0 0-.7C9.3 5 9.2 5 9 5H7.5V.5A.47.47 0 0 0 7 0H5a.47.47 0 0 0-.5.5V5H3a.47.47 0 0 0-.5.5.37.37 0 0 0 .1.3Z M11.5 9H11a.47.47 0 0 0-.5.5v1h-9v-1A.47.47 0 0 0 1 9H.5a.47.47 0 0 0-.5.5v2a.47.47 0 0 0 .5.5h11a.47.47 0 0 0 .5-.5v-2a.47.47 0 0 0-.5-.5Z",
      viewBox: "0 0 12 12"
    },
    expand: {
      d: "M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z",
      viewBox: "4 4 16 16"
    },
    external: {
      d: "M13.5,9H13a.5.5,0,0,0-.5.5v3h-9v-9h3A.5.5,0,0,0,7,3V2.5A.5.5,0,0,0,6.5,2h-4a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,13.5,9Z M8.83,7.88a.51.51,0,0,0,.71,0l2.31-2.32,1.28,1.28A.51.51,0,0,0,14,6.49v-4a.52.52,0,0,0-.5-.5h-4A.51.51,0,0,0,9,2.52a.58.58,0,0,0,.14.33l1.28,1.28L8.12,6.46a.51.51,0,0,0,0,.71Z",
      viewBox: "2 2 12 12"
    },
    pin: {
      d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5Z",
      viewBox: "4 4 16 16"
    },
    print: {
      d: "M17 4H3C1.3 4 0 5.2 0 6.8v5.5h4V16h12v-3.7h4V6.8C20 5.2 18.7 4 17 4zm-3 10H6V9h8v5zm3-6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-1-8H4v3h12V0z",
      viewBox: "4 0 16 16"
    },
    search: {
      d: "M11.86 10.23 8.62 6.99a4.63 4.63 0 1 0-6.34 1.64 4.55 4.55 0 0 0 2.36.64 4.65 4.65 0 0 0 2.33-.65l3.24 3.23a.46.46 0 0 0 .65 0l1-1a.48.48 0 0 0 0-.62Zm-5-3.32a3.28 3.28 0 0 1-2.31.93 3.22 3.22 0 1 1 2.35-.93Z",
      viewBox: "0 0 12 12"
    },
    shrink: {
      d: "M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z",
      viewBox: "4 4 16 16"
    },
    signout: {
      d: "M13.85,7.65l-2.5-2.5a.5.5,0,0,0-.71,0,.48.48,0,0,0-.15.36V7h-3a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h3v1.5A.49.49,0,0,0,11,11a.48.48,0,0,0,.34-.14l2.51-2.5a.49.49,0,0,0,0-.68Z M8.5,14h-6a.5.5,0,0,1-.5-.5V2.5A.5.5,0,0,1,2.5,2h6a.5.5,0,0,1,.5.5V3a.5.5,0,0,1-.5.5h-5v9h5A.5.5,0,0,1,9,13v.5A.5.5,0,0,1,8.5,14Z",
      viewBox: "2 2 12 12"
    },
    tick: {
      d: "M14.35,3.9l-.71-.71a.5.5,0,0,0-.71,0h0L5.79,10.34,3.07,7.61a.51.51,0,0,0-.71,0l-.71.71a.51.51,0,0,0,0,.71l3.78,3.78a.5.5,0,0,0,.71,0h0L14.35,4.6A.5.5,0,0,0,14.35,3.9Z",
      viewBox: "1.5 3 13 10"
    },
    upload: {
      d: "M6.35.15c-.18-.19-.49-.2-.68-.02,0,0-.01.01-.02.02l-3,3.2c-.19.18-.2.49-.02.68,0,0,.01.01.02.02,0,.1.1.1.3.1h1.5v4.5c-.02.26.18.48.44.5.02,0,.04,0,.06,0h2c.26.02.48-.18.5-.44,0-.02,0-.04,0-.06v-4.5h1.5c.26.02.48-.18.5-.44,0-.02,0-.04,0-.06.01-.11-.02-.22-.1-.3L6.35.15ZM11.5,9h-.5c-.26-.02-.48.18-.5.44,0,.02,0,.04,0,.06v1H1.5v-1c.02-.26-.18-.48-.44-.5-.02,0-.04,0-.06,0h-.5C.24,8.98.02,9.18,0,9.44c0,.02,0,.04,0,.06v2c-.02.26.18.48.44.5.02,0,.04,0,.06,0h11c.26.02.48-.18.5-.44,0-.02,0-.04,0-.06v-2c.02-.26-.18-.48-.44-.5-.02,0-.04,0-.06,0Z",
      viewBox: "0 0 12 12"
    }
  };
  if (paths[type]) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<svg${attr_class(`ons-icon ${stringify(size ? `ons-icon--${size}` : "")}`, "svelte-1hbp24q", { "ons-u-ml-2xs": marginLeft, "ons-u-mr-2xs": marginRight })}${attr("viewBox", svgPath && svgViewBox ? svgViewBox : paths[type].viewBox)} xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor"${attr_style("", { transform: rotation ? `rotate(${rotation}deg)` : null })}><path${attr("d", svgPath || paths[type].d)}></path></svg>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
  bind_props($$props, {
    type,
    size,
    rotation,
    svgPath,
    svgViewBox,
    marginLeft,
    marginRight
  });
}
const isNumeric = (val) => isFinite(val) && val !== null;
const formatter = (dp = null) => {
  return Number.isInteger(dp) ? new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp
  }).format : new Intl.NumberFormat("en-GB").format;
};
const contrastColor = (color) => {
  if (!color || typeof color !== "string") return "black";
  const rgb = parse(color).rgb;
  if (rgb) {
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1e3;
    return brightness > 125 ? "black" : "white";
  }
  return "black";
};
const darkenColor = (color, factor = 0.5) => {
  if (!color || typeof color !== "string") return color;
  const hsl = parse(color).hsl;
  if (hsl) {
    hsl[2] = hsl[2] * factor;
    return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  }
  return color;
};
function Button($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let type = fallback($$props["type"], "button");
    let variant = fallback($$props["variant"], "primary");
    let href = fallback($$props["href"], null);
    let download = fallback($$props["download"], null);
    let noScroll = fallback($$props["noScroll"], false);
    let small = fallback($$props["small"], false);
    let icon = fallback($$props["icon"], null);
    let iconPosition = fallback($$props["iconPosition"], "before");
    let iconRotation = fallback($$props["iconRotation"], 0);
    let disabled = fallback($$props["disabled"], false);
    let hideLabel = fallback($$props["hideLabel"], false);
    let arialabel = fallback($$props["arialabel"], null);
    let color = fallback($$props["color"], null);
    let cls = fallback($$props["cls"], null);
    if (href) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a${attr("href", !disabled ? href : null)} role="button"${attr("download", download)}${attr_class(`ons-btn ons-btn--link ons-js-submit-btn ${stringify(cls)}`, void 0, {
        "ons-btn--small": small,
        "ons-btn--secondary": variant === "secondary",
        "ons-btn--ghost": variant === "ghost",
        "ons-btn--disabled": disabled
      })}${attr("aria-label", arialabel)}${attr("data-sveltekit-noscroll", noScroll)}><span class="ons-btn__inner"${attr_style("", {
        background: color,
        color: color ? contrastColor(color) : null,
        "box-shadow": color ? `0 0.1875rem 0 ${darkenColor(color)}` : null
      })}>`);
      if (iconPosition === "before") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "icon", {}, () => {
          if (icon) {
            $$renderer2.push("<!--[0-->");
            Icon($$renderer2, { type: icon, marginRight: !hideLabel, rotation: iconRotation });
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span${attr_class("ons-btn__text", void 0, { "ons-u-vh": hideLabel })}><!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></span> `);
      if (iconPosition === "after") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "icon", {}, () => {
          if (icon) {
            $$renderer2.push("<!--[0-->");
            Icon($$renderer2, { type: icon, marginLeft: !hideLabel, rotation: iconRotation });
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></span></a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button${attr("type", type)}${attr_class(`ons-btn ${stringify(cls)}`, void 0, {
        "ons-btn--small": small,
        "ons-btn--secondary": variant === "secondary",
        "ons-btn--ghost": variant === "ghost",
        "ons-btn--disabled": disabled
      })}${attr("disabled", disabled, true)}${attr("aria-label", arialabel)}><span class="ons-btn__inner"${attr_style("", {
        background: color,
        color: color ? contrastColor(color) : null,
        "box-shadow": color ? `0 0.1875rem 0 ${darkenColor(color)}` : null
      })}>`);
      if (iconPosition === "before") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "icon", {}, () => {
          if (icon) {
            $$renderer2.push("<!--[0-->");
            Icon($$renderer2, { type: icon, marginRight: !hideLabel, rotation: iconRotation });
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span${attr_class("ons-btn__text", void 0, { "ons-u-vh": hideLabel })}><!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></span> `);
      if (iconPosition === "after") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "icon", {}, () => {
          if (icon) {
            $$renderer2.push("<!--[0-->");
            Icon($$renderer2, { type: icon, marginLeft: !hideLabel, rotation: iconRotation });
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></span></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, {
      type,
      variant,
      href,
      download,
      noScroll,
      small,
      icon,
      iconPosition,
      iconRotation,
      disabled,
      hideLabel,
      arialabel,
      color,
      cls
    });
  });
}
function Footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let i18n;
    getContext("page");
    let compact = fallback($$props["compact"], false);
    let width = fallback($$props["width"], "wide");
    let theme = fallback($$props["theme"], null);
    let themeOverrides = fallback($$props["themeOverrides"], () => ({}), true);
    let baseurl = "https://www.ons.gov.uk";
    i18n = (text) => text;
    Theme($$renderer2, {
      theme,
      overrides: themeOverrides,
      children: ($$renderer3) => {
        $$renderer3.push(`<footer${attr_class("ons-footer svelte-1roy8em", void 0, { "ons-footer__full": width === "full" })}><div class="ons-footer__body" data-analytics="footer">`);
        Container($$renderer3, {
          width,
          children: ($$renderer4) => {
            if (!compact) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="ons-grid"><div class="ons-grid__col ons-col-4@m"><h2 class="ons-footer__heading ons-u-fs-r--b">${escape_html(i18n("Help"))}</h2> <ul class="ons-list ons-u-mb-no ons-list--bare"><li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/help/accessibility`)} class="ons-list__link">${escape_html(i18n("Accessibility statement"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/browsers`)} class="ons-list__link">${escape_html(i18n("Browsers"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/cookies`)} class="ons-list__link">${escape_html(i18n("Cookies"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/help/fairusepolicy`)} class="ons-list__link">${escape_html(i18n("Fair use policy"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/help/privacynotice`)} class="ons-list__link">${escape_html(i18n("Privacy notice"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/help/termsandconditions`)} class="ons-list__link">${escape_html(i18n("Terms and conditions"))}</a></li></ul></div> <div class="ons-grid__col ons-col-4@m ons-u-mt-l@2xs@m"><h2 class="ons-footer__heading ons-u-fs-r--b">${escape_html(i18n("About us"))}</h2> <ul class="ons-list ons-u-mb-no ons-list--bare"><li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/aboutus`)} class="ons-list__link">${escape_html(i18n("About us"))}</a></li> <li class="ons-list__item"><a href="https://careers.ons.gov.uk" class="ons-list__link">${escape_html(i18n("Careers"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/aboutus/contactus`)} class="ons-list__link">${escape_html(i18n("Contact us"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/news`)} class="ons-list__link">${escape_html(i18n("Media"))}</a></li> <li class="ons-list__item"><a href="https://blog.ons.gov.uk" class="ons-list__link">${escape_html(i18n("Blog"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/aboutus/transparencyandgovernance/freedomofinformationfoi`)} class="ons-list__link">${escape_html(i18n("Freedom of information"))}</a></li></ul></div> <div class="ons-grid__col ons-col-4@m ons-u-mt-l@2xs@m"><h2 class="ons-footer__heading ons-u-fs-r--b">${escape_html(i18n("Connect with us"))}</h2> <ul class="ons-list ons-u-mb-no ons-list--bare"><li class="ons-list__item"><a href="https://x.com/ONS" class="ons-list__link">${escape_html(i18n("X"))}</a></li> <li class="ons-list__item"><a href="https://www.instagram.com/officefornationalstatistics/" class="ons-list__link">${escape_html(i18n("Instagram"))}</a></li> <li class="ons-list__item"><a href="https://www.facebook.com/ONS" class="ons-list__link">${escape_html(i18n("Facebook"))}</a></li> <li class="ons-list__item"><a href="https://www.linkedin.com/company/office-for-national-statistics" class="ons-list__link">${escape_html(i18n("Linkedin"))}</a></li> <li class="ons-list__item"><a href="https://consultations.ons.gov.uk/" class="ons-list__link">${escape_html(i18n("Consultations"))}</a></li> <li class="ons-list__item"><a href="https://www.statsusernetwork.ons.gov.uk/" class="ons-list__link">${escape_html(i18n("Discussion forums"))}</a></li> <li class="ons-list__item"><a href="https://public.govdelivery.com/accounts/UKONS/subscribers/new" class="ons-list__link">${escape_html(i18n("Email alerts"))}</a></li></ul></div> <div class="ons-grid__col ons-u-mb-l"><hr class="ons-footer__hr"/></div></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> <div class="ons-grid ons-grid-flex--vertical-top ons-grid-flex--between"><div class="ons-grid__col">`);
            if (compact) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<ul class="ons-list ons-u-mb-s ons-footer--rows ons-list--bare ons-list--inline"><li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/help/accessibility`)} class="ons-list__link">${escape_html(i18n("Accessibility"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/cookies`)} class="ons-list__link">${escape_html(i18n("Cookies"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/help/privacynotice`)} class="ons-list__link">${escape_html(i18n("Privacy"))}</a></li> <li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}/help/termsandconditions`)} class="ons-list__link">${escape_html(i18n("Terms and conditions"))}</a></li></ul>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> <div class="ons-footer__license ons-u-mb-l"><svg class="ons-footer__ogl-img" xmlns="http://www.w3.org/2000/svg" width="50px" height="20px" viewBox="0 0 60 24" focusable="false" aria-hidden="true" role="img"><title>Open Government License logo</title><path d="M51.7,17.5V0l-6.2,4v19.8h13.8v-6.2H51.7z M36.7,16.3c-1,0.9-2.4,1.4-3.8,1.4c-3.2,0-5.8-2.6-5.8-5.8s2.6-5.8,5.8-5.8c2,0,3.9,1.1,4.9,2.7L43,5.6C40.9,2.2,37.1,0,32.9,0c-4.5,0-8.4,2.5-10.4,6.1C20.4,2.5,16.5,0,12,0C5.4,0,0,5.4,0,12s5.4,12,12,12c4.5,0,8.4-2.5,10.4-6.1c2.1,3.6,6,6.1,10.4,6.1c3,0,5.8-1.1,7.9-3l2.4,2.7h0.4V13h-9.8L36.7,16.3zM12,17.8c-3.2,0-5.8-2.6-5.8-5.8S8.8,6.2,12,6.2s5.8,2.6,5.8,5.8S15.2,17.8,12,17.8" fill="var(--ons-color-text-light)"></path></svg> ${escape_html(i18n("All content is available under the"))} <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" class="ons-external-link" target="_blank" rel="noopener"><span class="ons-external-link__text">${escape_html(i18n("Open Government Licence v3.0"))}</span><span class="ons-external-link__icon"> <svg class="ons-icon svelte-1roy8em" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" role="img" title="ons-icon-external-link"><path d="M13.5,9H13a.5.5,0,0,0-.5.5v3h-9v-9h3A.5.5,0,0,0,7,3V2.5A.5.5,0,0,0,6.5,2h-4a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,13.5,9Z" transform="translate(-2 -1.99)"></path><path d="M8.83,7.88a.51.51,0,0,0,.71,0l2.31-2.32,1.28,1.28A.51.51,0,0,0,14,6.49v-4a.52.52,0,0,0-.5-.5h-4A.51.51,0,0,0,9,2.52a.58.58,0,0,0,.14.33l1.28,1.28L8.12,6.46a.51.51,0,0,0,0,.71Z" transform="translate(-2 -1.99)"></path></svg></span><span class="ons-external-link__new-window-description ons-u-vh">(${escape_html(i18n("opens in a new tab"))})</span></a> , ${escape_html(i18n("except where otherwise stated"))}</div> <div class="ons-footer__logo-container ons-u-mb-l ons-grid-flex ons-grid-flex--vertical-top"><a class="ons-footer__logo-link"${attr("href", baseurl)}><svg class="ons-icon--logo" xmlns="http://www.w3.org/2000/svg" width="250" height="24" viewBox="33 2 552 60" aria-labelledby="ons-logo-en-footer-alt" role="img"><title id="ons-logo-en-footer-alt">${escape_html(i18n("Office for National Statistics"))}</title><g class="ons-icon--logo__group ons-icon--logo__group--secondary svelte-1roy8em" fill="#a8bd3a"><path d="M0,34.6c.8-1.69,1.39-3,2.32-4.6A38.28,38.28,0,0,1,0,23.4V34.6M5,3S0,3,0,9.25v1A62.12,62.12,0,0,0,4.2,27a43.77,43.77,0,0,1,9.42-10.79C21.69,9.21,31.16,5.13,45.9,3Z"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--primary svelte-1roy8em" fill="#003c57"><path d="M53.06,6.42C36.2,8,24.68,12.92,16.43,20.07A41.46,41.46,0,0,0,6.4,32.2C12.87,44.93,28.88,57,46.6,57H47s6.32.21,6.32-6.91V6.36a1.22,1.22,0,0,1-.26.06M9.72,42.67a44.25,44.25,0,0,1-5-7.42A80.59,80.59,0,0,0,0,46.38V56.91L31.06,57c-9.83-3-15.74-7.64-21.34-14.3"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--text svelte-1roy8em" fill="#003c57"><path d="M82,47.49c-9.07,0-13.13-7.51-13.13-16.77S72.91,14,82,14s13.1,7.61,13.1,16.77S91.1,47.54,82,47.54m0-30.91c-6.69,0-9.07,7.33-9.07,14.05s2.16,13.9,9.07,13.9,9-7.28,9-13.9-2.34-14-9-14"></path><path d="M106.36,23.81V46.88h-3.67V23.81H98.93V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z"></path><path d="M121.53,23.81V46.88h-3.67V23.81H114.1V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z"></path><path d="M132.85,16.72a2.28,2.28,0,0,1-2.33-2.23v0a2.34,2.34,0,0,1,4.67,0,2.28,2.28,0,0,1-2.3,2.26h0M131,21.56h3.71V46.88H131Z"></path><path d="M150.53,47.49c-6,0-10.63-5.16-10.63-13.29S144.52,21,150.66,21a9.76,9.76,0,0,1,6.17,1.74l-1,2.25a7.53,7.53,0,0,0-4.4-1.36c-5.15,0-7.78,4.46-7.78,10.48,0,6.2,3,10.62,7.65,10.62a8,8,0,0,0,4.49-1.37l1,2.45a10.21,10.21,0,0,1-6.3,1.73"></path><path d="M162.84,35.75c.48,6,3.76,9,8.9,9a14.66,14.66,0,0,0,6.88-1.55l1.08,2.59a18,18,0,0,1-8.22,1.73c-7.12,0-12.18-4.23-12.18-13.34,0-8.69,4.67-13.2,11-13.2s10.37,3.95,10.37,12.4Zm7.35-12.41c-4.1,0-7.56,3.2-7.52,10.29l14.39-2c0-5.87-2.81-8.32-6.87-8.32"></path><path d="M198.57,23.81V46.88H194.9V23.81h-3.76V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.39,0,.87.05.87.05v2.35h-.44c-2.54,0-4.84,1.64-4.84,5.12v4.09h5.28v2.25Z"></path><path d="M217.28,47.49c-7.47,0-10.89-5.78-10.89-13.24S209.81,21,217.28,21s10.85,5.82,10.85,13.3-3.37,13.24-10.85,13.24m0-24c-5.53,0-7.13,5.59-7.13,10.81s1.73,10.56,7.13,10.56,7.13-5.35,7.13-10.56-1.6-10.81-7.13-10.81"></path><path d="M244.08,23.91c-2.34-.61-5.75-.52-7.35.47v22.5H233V22.69c2.67-1.13,5.36-1.74,10.11-1.74H245Z"></path><path d="M277.42,47.13,263.07,25a32.2,32.2,0,0,1-1.85-3.29h-.09s.13,1.88.13,3.85V47.13h-4.71V14.8h5.31l13.61,20.82A28.76,28.76,0,0,1,277.38,39h.08s-.17-1.84-.17-3.77V14.8H282V47.13Z"></path><path d="M297.52,47.79c-7.43,0-10.93-3-10.93-7.81,0-6.8,7.12-8.64,15.59-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L288.23,23a24,24,0,0,1,9.12-1.83c5.61,0,9.93,2.3,9.93,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.26.67-10.45,1.84-10.45,6.73,0,3.42,2.42,4.88,6.22,4.88a10.09,10.09,0,0,0,4.23-.84Z"></path><path d="M322,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.55V21.81h3.55V16.12l5.4-1.5v7.19H325v3.28h-5V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52"></path><path d="M331.91,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z"></path><path d="M350.88,47.79c-7.73,0-11.57-5.74-11.57-13.3s3.84-13.34,11.57-13.34,11.54,5.78,11.54,13.34-3.8,13.3-11.54,13.3m0-23.17c-4.66,0-6.05,4.89-6.05,9.82s1.47,9.63,6.05,9.63,6.05-4.7,6.05-9.63-1.38-9.82-6.05-9.82"></path><path d="M382.52,47.13V29c0-3.24-2.77-4.47-5.88-4.47a12.3,12.3,0,0,0-4.37.76v21.8h-5.39V23a26.81,26.81,0,0,1,10.06-1.83c6.61,0,11,2.25,11,7.8V47.13Z"></path><path d="M403.18,47.79c-7.43,0-10.94-3-10.94-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L393.89,23A24,24,0,0,1,403,21.15c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.43,4.88,6.23,4.88a10.09,10.09,0,0,0,4.23-.84Z"></path><polygon points="418.52 47.13 418.52 34.91 418.52 10.25 423.92 10.25 423.92 22.76 423.92 47.13 418.52 47.13"></polygon><path d="M445.39,47.79A19.11,19.11,0,0,1,436.58,46l1.51-4a13.48,13.48,0,0,0,6.22,1.55c3.76,0,6.44-2.21,6.44-5.41,0-7.09-13.44-4.36-13.44-14.42,0-5.13,4.15-9.59,10.72-9.59A15.82,15.82,0,0,1,455.8,16l-1.38,3.52a11.93,11.93,0,0,0-5.66-1.5c-3.5,0-5.79,2.11-5.79,5.12,0,7,13.74,3.94,13.74,14.65,0,5.74-4.71,10-11.32,10"></path><path d="M470.41,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.12,5.12,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52"></path><path d="M487.27,47.79c-7.44,0-10.93-3-10.93-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.38-4.51-5.84-4.51a18,18,0,0,0-6.87,1.46L478,23a23.94,23.94,0,0,1,9.11-1.83c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83M492,33.16c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.42,4.88,6.22,4.88a10,10,0,0,0,4.24-.84Z"></path><path d="M511.73,47.69c-5.32,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52"></path><path d="M521.66,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.45V47.13h-5.45Z"></path><path d="M536.19,47.79A15.9,15.9,0,0,1,528.54,46L530,42.48a10.53,10.53,0,0,0,5.52,1.5c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.86-7.42A13.56,13.56,0,0,1,545.34,23l-1.42,3.14a8.47,8.47,0,0,0-4.62-1.45c-2.81,0-4.54,1.69-4.54,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9"></path><path d="M559.83,47.69c-5.31,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.93v3.28h-4.93V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.64,5.64,0,0,0,1.47-.23v3.33a7.72,7.72,0,0,1-3,.52"></path><path d="M569.77,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z"></path><path d="M588.14,47.79c-6.23,0-11-5.08-11-13.35s4.88-13.29,11-13.29A10.51,10.51,0,0,1,594.66,23l-1.21,3a6.87,6.87,0,0,0-4-1.22c-4.4,0-6.69,3.81-6.69,9.49s2.63,9.59,6.61,9.59a6.74,6.74,0,0,0,4-1.28L594.7,46c-1.12.94-3.33,1.84-6.56,1.84"></path><path d="M605.1,47.79A15.9,15.9,0,0,1,597.45,46l1.42-3.47A10.54,10.54,0,0,0,604.4,44c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.85-7.42a13.49,13.49,0,0,1,7.1,1.83l-1.42,3.14a8.42,8.42,0,0,0-4.63-1.45c-2.8,0-4.53,1.69-4.53,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9"></path></g></svg></a></div></div></div>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></footer>`);
      },
      $$slots: { default: true }
    });
    bind_props($$props, { compact, width, theme, themeOverrides });
  });
}
function HeaderNav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let width = fallback($$props["width"], "wide");
    let headerBorder = fallback($$props["headerBorder"], false);
    let menuBorder = fallback($$props["menuBorder"], false);
    let search = fallback($$props["search"], true);
    let bilingual = fallback($$props["bilingual"], true);
    let lang = fallback($$props["lang"], "en");
    let baseurl = fallback($$props["baseurl"], "https://www.ons.gov.uk");
    let baseother = fallback($$props["baseother"], "https://cy.ons.gov.uk");
    let path = fallback($$props["path"], "");
    let i18n = fallback($$props["i18n"], (text) => text);
    const menu = {
      main: [
        {
          label_en: "Taking part in a survey?",
          label_cy: "Cymryd rhan mewn arolwg?",
          description_en: "It's never been more important.",
          description_cy: "Nid yw erioed wedi bod mor bwysig.",
          url: "/surveys"
        },
        {
          label_en: "Release calendar",
          label_cy: "Calendar datganiadau",
          description_en: "View our latest and upcoming releases.",
          description_cy: "Gweld ein datganiadau",
          url: "/releasecalendar"
        },
        {
          label_en: "Methodology",
          label_cy: "Methodoleg",
          description_en: "Information on our methods.",
          description_cy: "Gwybodaeth am ein dulliau.",
          url: "/methodology"
        }
      ],
      topics: [
        {
          label_en: "People, population and community",
          label_cy: "Pobl, y boblogaeth a chymunedau",
          url: "/peoplepopulationandcommunity",
          children: [
            {
              label_en: "Armed forces community",
              label_cy: "Cymuned y Lluoedd Arfog",
              url: "/peoplepopulationandcommunity/armedforcescommunity"
            },
            {
              label_en: "Births, deaths and marriages",
              label_cy: "Genedigaethau, marwolaethau a phriodasau",
              url: "/peoplepopulationandcommunity/birthsdeathsandmarriages"
            },
            {
              label_en: "Crime and justice",
              label_cy: "Troseddu a chyfiawnder",
              url: "/peoplepopulationandcommunity/crimeandjustice"
            },
            {
              label_en: "Cultural identity",
              label_cy: "Hunaniaeth ddiwylliannol",
              url: "/peoplepopulationandcommunity/culturalidentity"
            },
            {
              label_en: "Education and childcare",
              label_cy: "Addysg a gofal plant",
              url: "/peoplepopulationandcommunity/educationandchildcare"
            },
            {
              label_en: "Elections",
              label_cy: "Etholiadau",
              url: "/peoplepopulationandcommunity/elections"
            },
            {
              label_en: "Health and social care",
              label_cy: "Iechyd a gofal cymdeithasol",
              url: "/peoplepopulationandcommunity/healthandsocialcare"
            },
            {
              label_en: "Household characteristics",
              label_cy: "Nodweddion aelwydydd",
              url: "/peoplepopulationandcommunity/householdcharacteristics"
            },
            {
              label_en: "Housing",
              label_cy: "Tai",
              url: "/peoplepopulationandcommunity/housing"
            },
            {
              label_en: "Leisure and tourism",
              label_cy: "Hamdden a thwristiaeth",
              url: "/peoplepopulationandcommunity/leisureandtourism"
            },
            {
              label_en: "Personal and household finances",
              label_cy: "Cyllid personol a chyllid aelwydydd",
              url: "/peoplepopulationandcommunity/personalandhouseholdfinances"
            },
            {
              label_en: "Population and migration",
              label_cy: "Poblogaeth ac ymfudo",
              url: "/peoplepopulationandcommunity/populationandmigration"
            },
            {
              label_en: "Well-being",
              label_cy: "Lles",
              url: "/peoplepopulationandcommunity/wellbeing"
            }
          ]
        },
        {
          label_en: "Business, industry and trade",
          label_cy: "Busnes, diwydiant a masnach",
          url: "/businessindustryandtrade",
          children: [
            {
              label_en: "Business",
              label_cy: "Busnes",
              url: "/businessindustryandtrade/business"
            },
            {
              label_en: "Changes to business",
              label_cy: "Newidiadau i fusnesau",
              url: "/businessindustryandtrade/changestobusiness"
            },
            {
              label_en: "Construction industry",
              label_cy: "Diwydiant adeiladu",
              url: "/businessindustryandtrade/itandinternetindustry"
            },
            {
              label_en: "International trade",
              label_cy: "Masnach ryngwladol",
              url: "/businessindustryandtrade/constructionindustry"
            },
            {
              label_en: "IT and internet industry",
              label_cy: "Y diwydiant TGCh a'r rhyngrwyd",
              url: "/businessindustryandtrade/internationaltrade"
            },
            {
              label_en: "Manufacturing and production industry",
              label_cy: "Y diwydiant gweithgynhyrchu a chynhyrchu",
              url: "/businessindustryandtrade/manufacturingandproductionindustry"
            },
            {
              label_en: "Retail industry",
              label_cy: "Y diwydiant manwerthu",
              url: "/businessindustryandtrade/retailindustry"
            },
            {
              label_en: "Tourism industry",
              label_cy: "Y diwydiant twristiaeth",
              url: "/businessindustryandtrade/tourismindustry"
            }
          ]
        },
        {
          label_en: "Employment and labour market",
          label_cy: "Cyflogaeth a'r farchnad lafur",
          url: "/employmentandlabourmarket",
          children: [
            {
              label_en: "People in work",
              label_cy: "Pobl mewn gwaith",
              url: "/employmentandlabourmarket/peopleinwork"
            },
            {
              label_en: "People not in work",
              label_cy: "Pobl nad ydynt mewn gwaith",
              url: "/employmentandlabourmarket/peoplenotinwork"
            }
          ]
        },
        {
          label_en: "Economy",
          label_cy: "Yr economi",
          url: "/economy",
          children: [
            {
              label_en: "Economic output and productivity",
              label_cy: "Allbwn economaidd a chynhyrchiant",
              url: "/economy/economicoutputandproductivity"
            },
            {
              label_en: "Government, public sector and taxes",
              label_cy: "Llywodraeth, y sector cyhoeddus a threthi",
              url: "/economy/governmentpublicsectorandtaxes"
            },
            {
              label_en: "Gross Value Added (GVA)",
              label_cy: "Gwerth Ychwanegol Gros",
              url: "/economy/grossvalueaddedgva"
            },
            {
              label_en: "Investments, pensions and trusts",
              label_cy: "Buddsoddiadau, pensiynau ac ymddiriedolaethau",
              url: "/economy/investmentspensionsandtrusts"
            },
            {
              label_en: "Regional accounts",
              label_cy: "Cyfrifon rhanbarthol",
              url: "/economy/regionalaccounts"
            },
            {
              label_en: "Environmental accounts",
              label_cy: "Cyfrifon amgylcheddol",
              url: "/economy/environmentalaccounts"
            },
            {
              label_en: "Gross Domestic Product (GDP)",
              label_cy: "Cynnyrch Domestig Gros (CDG)",
              url: "/economy/grossdomesticproductgdp"
            },
            {
              label_en: "Inflation and price indices",
              label_cy: "Chwyddiant a mynegrifau prisiau",
              url: "/economy/inflationandpriceindices"
            },
            {
              label_en: "National Accounts",
              label_cy: "Cyfrifon gwladol",
              url: "/economy/nationalaccounts"
            }
          ]
        }
      ],
      searches: [
        { label_en: "Cost of living", label_cy: "cost byw" },
        { label_en: "Inflation", label_cy: "Chwyddiant" },
        {
          label_en: "NHS waiting times",
          label_cy: "Amseroedd aros y GIG"
        },
        { label_en: "Wellbeing", label_cy: "Llesiant" },
        { label_en: "Baby names", label_cy: "Enwau babanod" }
      ]
    };
    const columns = [
      [menu.topics[0]],
      [menu.topics[1], menu.topics[2]],
      [menu.topics[3]]
    ];
    $$renderer2.push(`<div${attr_class("ons-header__top svelte-1m3m1gv", void 0, { "ons-header--border": headerBorder })}>`);
    Container($$renderer2, {
      width,
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="ons-header__grid-top ons-grid ons-grid-flex ons-grid-flex--between ons-grid-flex--vertical-center ons-grid-flex--no-wrap ons-grid--gutterless svelte-1m3m1gv"><div class="ons-grid__col ons-col-auto"><a class="ons-header__org-logo-link"${attr("href", baseurl)}${attr("aria-label", `${stringify(i18n("Office for National Statistics"))} - ${stringify(i18n("Homepage"))}`)}><div class="ons-header__org-logo ons-header__org-logo--large"><svg class="ons-icon--logo" xmlns="http://www.w3.org/2000/svg" width="250" height="24" viewBox="33 2 552 60" aria-labelledby="ons-logo-en-alt" role="img"><title id="ons-logo-en-alt">${escape_html(i18n("Office for National Statistics logo"))}</title><g class="ons-icon--logo__group ons-icon--logo__group--secondary" fill="#a8bd3a"><path d="M0,34.6c.8-1.69,1.39-3,2.32-4.6A38.28,38.28,0,0,1,0,23.4V34.6M5,3S0,3,0,9.25v1A62.12,62.12,0,0,0,4.2,27a43.77,43.77,0,0,1,9.42-10.79C21.69,9.21,31.16,5.13,45.9,3Z"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--primary svelte-1m3m1gv" fill="#003c57"><path d="M53.06,6.42C36.2,8,24.68,12.92,16.43,20.07A41.46,41.46,0,0,0,6.4,32.2C12.87,44.93,28.88,57,46.6,57H47s6.32.21,6.32-6.91V6.36a1.22,1.22,0,0,1-.26.06M9.72,42.67a44.25,44.25,0,0,1-5-7.42A80.59,80.59,0,0,0,0,46.38V56.91L31.06,57c-9.83-3-15.74-7.64-21.34-14.3"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--text svelte-1m3m1gv" fill="#003c57"><path d="M82,47.49c-9.07,0-13.13-7.51-13.13-16.77S72.91,14,82,14s13.1,7.61,13.1,16.77S91.1,47.54,82,47.54m0-30.91c-6.69,0-9.07,7.33-9.07,14.05s2.16,13.9,9.07,13.9,9-7.28,9-13.9-2.34-14-9-14"></path><path d="M106.36,23.81V46.88h-3.67V23.81H98.93V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z"></path><path d="M121.53,23.81V46.88h-3.67V23.81H114.1V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z"></path><path d="M132.85,16.72a2.28,2.28,0,0,1-2.33-2.23v0a2.34,2.34,0,0,1,4.67,0,2.28,2.28,0,0,1-2.3,2.26h0M131,21.56h3.71V46.88H131Z"></path><path d="M150.53,47.49c-6,0-10.63-5.16-10.63-13.29S144.52,21,150.66,21a9.76,9.76,0,0,1,6.17,1.74l-1,2.25a7.53,7.53,0,0,0-4.4-1.36c-5.15,0-7.78,4.46-7.78,10.48,0,6.2,3,10.62,7.65,10.62a8,8,0,0,0,4.49-1.37l1,2.45a10.21,10.21,0,0,1-6.3,1.73"></path><path d="M162.84,35.75c.48,6,3.76,9,8.9,9a14.66,14.66,0,0,0,6.88-1.55l1.08,2.59a18,18,0,0,1-8.22,1.73c-7.12,0-12.18-4.23-12.18-13.34,0-8.69,4.67-13.2,11-13.2s10.37,3.95,10.37,12.4Zm7.35-12.41c-4.1,0-7.56,3.2-7.52,10.29l14.39-2c0-5.87-2.81-8.32-6.87-8.32"></path><path d="M198.57,23.81V46.88H194.9V23.81h-3.76V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.39,0,.87.05.87.05v2.35h-.44c-2.54,0-4.84,1.64-4.84,5.12v4.09h5.28v2.25Z"></path><path d="M217.28,47.49c-7.47,0-10.89-5.78-10.89-13.24S209.81,21,217.28,21s10.85,5.82,10.85,13.3-3.37,13.24-10.85,13.24m0-24c-5.53,0-7.13,5.59-7.13,10.81s1.73,10.56,7.13,10.56,7.13-5.35,7.13-10.56-1.6-10.81-7.13-10.81"></path><path d="M244.08,23.91c-2.34-.61-5.75-.52-7.35.47v22.5H233V22.69c2.67-1.13,5.36-1.74,10.11-1.74H245Z"></path><path d="M277.42,47.13,263.07,25a32.2,32.2,0,0,1-1.85-3.29h-.09s.13,1.88.13,3.85V47.13h-4.71V14.8h5.31l13.61,20.82A28.76,28.76,0,0,1,277.38,39h.08s-.17-1.84-.17-3.77V14.8H282V47.13Z"></path><path d="M297.52,47.79c-7.43,0-10.93-3-10.93-7.81,0-6.8,7.12-8.64,15.59-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L288.23,23a24,24,0,0,1,9.12-1.83c5.61,0,9.93,2.3,9.93,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.26.67-10.45,1.84-10.45,6.73,0,3.42,2.42,4.88,6.22,4.88a10.09,10.09,0,0,0,4.23-.84Z"></path><path d="M322,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.55V21.81h3.55V16.12l5.4-1.5v7.19H325v3.28h-5V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52"></path><path d="M331.91,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z"></path><path d="M350.88,47.79c-7.73,0-11.57-5.74-11.57-13.3s3.84-13.34,11.57-13.34,11.54,5.78,11.54,13.34-3.8,13.3-11.54,13.3m0-23.17c-4.66,0-6.05,4.89-6.05,9.82s1.47,9.63,6.05,9.63,6.05-4.7,6.05-9.63-1.38-9.82-6.05-9.82"></path><path d="M382.52,47.13V29c0-3.24-2.77-4.47-5.88-4.47a12.3,12.3,0,0,0-4.37.76v21.8h-5.39V23a26.81,26.81,0,0,1,10.06-1.83c6.61,0,11,2.25,11,7.8V47.13Z"></path><path d="M403.18,47.79c-7.43,0-10.94-3-10.94-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L393.89,23A24,24,0,0,1,403,21.15c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.43,4.88,6.23,4.88a10.09,10.09,0,0,0,4.23-.84Z"></path><polygon points="418.52 47.13 418.52 34.91 418.52 10.25 423.92 10.25 423.92 22.76 423.92 47.13 418.52 47.13"></polygon><path d="M445.39,47.79A19.11,19.11,0,0,1,436.58,46l1.51-4a13.48,13.48,0,0,0,6.22,1.55c3.76,0,6.44-2.21,6.44-5.41,0-7.09-13.44-4.36-13.44-14.42,0-5.13,4.15-9.59,10.72-9.59A15.82,15.82,0,0,1,455.8,16l-1.38,3.52a11.93,11.93,0,0,0-5.66-1.5c-3.5,0-5.79,2.11-5.79,5.12,0,7,13.74,3.94,13.74,14.65,0,5.74-4.71,10-11.32,10"></path><path d="M470.41,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.12,5.12,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52"></path><path d="M487.27,47.79c-7.44,0-10.93-3-10.93-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.38-4.51-5.84-4.51a18,18,0,0,0-6.87,1.46L478,23a23.94,23.94,0,0,1,9.11-1.83c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83M492,33.16c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.42,4.88,6.22,4.88a10,10,0,0,0,4.24-.84Z"></path><path d="M511.73,47.69c-5.32,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52"></path><path d="M521.66,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.45V47.13h-5.45Z"></path><path d="M536.19,47.79A15.9,15.9,0,0,1,528.54,46L530,42.48a10.53,10.53,0,0,0,5.52,1.5c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.86-7.42A13.56,13.56,0,0,1,545.34,23l-1.42,3.14a8.47,8.47,0,0,0-4.62-1.45c-2.81,0-4.54,1.69-4.54,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9"></path><path d="M559.83,47.69c-5.31,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.93v3.28h-4.93V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.64,5.64,0,0,0,1.47-.23v3.33a7.72,7.72,0,0,1-3,.52"></path><path d="M569.77,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z"></path><path d="M588.14,47.79c-6.23,0-11-5.08-11-13.35s4.88-13.29,11-13.29A10.51,10.51,0,0,1,594.66,23l-1.21,3a6.87,6.87,0,0,0-4-1.22c-4.4,0-6.69,3.81-6.69,9.49s2.63,9.59,6.61,9.59a6.74,6.74,0,0,0,4-1.28L594.7,46c-1.12.94-3.33,1.84-6.56,1.84"></path><path d="M605.1,47.79A15.9,15.9,0,0,1,597.45,46l1.42-3.47A10.54,10.54,0,0,0,604.4,44c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.85-7.42a13.49,13.49,0,0,1,7.1,1.83l-1.42,3.14a8.42,8.42,0,0,0-4.63-1.45c-2.8,0-4.53,1.69-4.53,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9"></path></g></svg></div> <div class="ons-header__org-logo ons-header__org-logo--small"><svg class="ons-icon--logo" xmlns="http://www.w3.org/2000/svg" width="120" height="27" viewBox="0 5 595 116" aria-labelledby="ons-logo-stacked-en-alt" role="img"><title id="ons-logo-stacked-en-alt">${escape_html(i18n("Office for National Statistics logo"))}</title><g class="ons-icon--logo__group ons-icon--logo__group--secondary" fill="#a8bd3a"><path d="M0,70.5c1.8-3.7,3.6-7.2,5.6-10.7A127.94,127.94,0,0,1,0,42.6V70.5M10.9,0S0,0,0,13.5v7.2A128.06,128.06,0,0,0,7.9,56.2a114.75,114.75,0,0,1,22.3-26C47.8,15.1,71.5,4.7,103.7.1Z"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--primary svelte-1m3m1gv" fill="#003c57"><path d="M115.9,7.3c-36.8,3.5-62,14-80,29.4a108.15,108.15,0,0,0-23.6,29c14.1,27.4,41.1,47.6,86,50.5h4.4s13.8.5,13.8-14.9V7.2l-.6.1M21.2,85.4a92.68,92.68,0,0,1-11-16A173,173,0,0,0,0,93.4v22.7l73.6.1c-22.9-5.5-40.1-16.4-52.4-30.8"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--text svelte-1m3m1gv" fill="#003c57"><path d="M161,51.9c-11.3,0-16.3-9.3-16.3-20.8s5-20.8,16.3-20.8,16.3,9.5,16.3,20.8c-.1,11.5-5.1,20.8-16.3,20.8m0-38.3c-8.3,0-11.3,9.1-11.3,17.4s2.7,17.3,11.3,17.3,11.2-9.1,11.2-17.3S169.3,13.6,161,13.6m30.2,8.9V51.2h-4.5V22.6H182V19.8h4.7V15.2c0-5.7,3.4-9.9,10-9.9a8,8,0,0,1,1.1.1V8.3h-.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8l-6.7-.1Zm18.9,0V51.2h-4.5V22.6h-4.7V19.8h4.7V15.2c0-5.7,3.4-9.9,10-9.9a8,8,0,0,1,1.1.1V8.3h-.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8l-6.7-.1Zm14-8.8a2.82,2.82,0,0,1-2.9-2.8,2.9,2.9,0,0,1,5.8,0,2.76,2.76,0,0,1-2.9,2.8m-2.3,6h4.6V51.2h-4.6Zm24.3,32.2c-7.4,0-13.2-6.4-13.2-16.5,0-10.3,5.8-16.5,13.4-16.5a12.36,12.36,0,0,1,7.7,2.2l-1.2,2.8a8.92,8.92,0,0,0-5.5-1.7c-6.4,0-9.7,5.5-9.7,13,0,7.7,3.7,13.2,9.5,13.2a9.8,9.8,0,0,0,5.6-1.7l1.2,3c-1.3,1.2-4,2.2-7.8,2.2m15.3-14.6c.6,7.4,4.7,11.1,11.1,11.1a18.36,18.36,0,0,0,8.5-1.9l1.3,3.2a22.58,22.58,0,0,1-10.2,2.1c-8.8,0-15.1-5.3-15.1-16.6,0-10.8,5.8-16.4,13.7-16.4s12.9,4.9,12.9,15.4l-22.2,3.1ZM270.5,22c-5.1,0-9.4,4-9.3,12.8l17.9-2.5C279,25,275.5,22,270.5,22m42.2.5V51.2h-4.5V22.6h-4.7V19.8h4.7V15.2c0-5.7,3.4-9.9,10-9.9a8,8,0,0,1,1.1.1V8.3h-.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8Zm23.2,29.4c-9.3,0-13.5-7.2-13.5-16.5s4.2-16.5,13.5-16.5,13.5,7.2,13.5,16.5-4.2,16.5-13.5,16.5m0-29.8c-6.9,0-8.8,7-8.8,13.4s2.1,13.1,8.8,13.1c6.9,0,8.9-6.6,8.9-13.1s-2-13.4-8.9-13.4m33.3.6c-2.9-.8-7.1-.6-9.1.6V51.2h-4.6V21.1c3.3-1.4,6.6-2.2,12.5-2.2h2.4c0,.1-1.2,3.8-1.2,3.8ZM171.3,114.8,153.5,87.3c-1.3-2.1-2.3-4.1-2.3-4.1h-.1s.2,2.3.2,4.8v26.8h-5.8V74.7h6.6L169,100.5a46.13,46.13,0,0,1,2.4,4.1h.1s-.2-2.3-.2-4.7V74.6h5.9v40.1l-5.9.1Zm25,.8c-9.2,0-13.6-3.7-13.6-9.7,0-8.5,8.8-10.7,19.4-11.7V92.4c0-4.3-2.9-5.6-7.2-5.6a22.34,22.34,0,0,0-8.5,1.8l-1.6-3.8a30.2,30.2,0,0,1,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9c-2.7,1.4-6.9,2.3-12.1,2.3m5.8-18.2c-7.8.8-13,2.3-13,8.3,0,4.2,3,6.1,7.7,6.1a12.33,12.33,0,0,0,5.3-1.1Zm24.5,18.1c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2c0,2.5,1.4,4.4,4.3,4.4a5.66,5.66,0,0,0,1.8-.3v4.1a11.47,11.47,0,0,1-3.7.6M239,77.9a3.52,3.52,0,1,1,3.9-3.5,3.71,3.71,0,0,1-3.9,3.5m-3.4,5.5h6.8v31.4h-6.8Zm26.9,32.2c-9.6,0-14.4-7.1-14.4-16.5s4.8-16.6,14.4-16.6,14.3,7.2,14.3,16.6-4.7,16.5-14.3,16.5m0-28.7c-5.8,0-7.5,6.1-7.5,12.2s1.8,11.9,7.5,11.9,7.5-5.8,7.5-11.9-1.7-12.2-7.5-12.2m39.3,27.9V92.3c0-4-3.4-5.5-7.3-5.5a16,16,0,0,0-5.4.9v27.1h-6.7v-30a32.8,32.8,0,0,1,12.5-2.3c8.2,0,13.7,2.8,13.7,9.7v22.6Zm25.7.8c-9.2,0-13.6-3.7-13.6-9.7,0-8.5,8.9-10.7,19.4-11.7V92.4c0-4.3-2.9-5.6-7.2-5.6a22.34,22.34,0,0,0-8.5,1.8L316,84.8a30.2,30.2,0,0,1,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9c-2.7,1.4-6.9,2.3-12.1,2.3m5.8-18.2c-7.8.8-13,2.3-13,8.3,0,4.2,3,6.1,7.7,6.1a12.33,12.33,0,0,0,5.3-1.1Zm13.2,17.4V69h6.7v45.8Zm38.6.8a23.94,23.94,0,0,1-10.9-2.3l1.9-4.9a17,17,0,0,0,7.7,1.9c4.7,0,8-2.7,8-6.7,0-8.8-16.7-5.4-16.7-17.9,0-6.4,5.2-11.9,13.3-11.9a20.22,20.22,0,0,1,9.7,2.3l-1.7,4.4a14.57,14.57,0,0,0-7-1.9c-4.3,0-7.2,2.6-7.2,6.4,0,8.6,17.1,4.9,17.1,18.2-.1,7.1-6,12.4-14.2,12.4m31.1-.1c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2a4.07,4.07,0,0,0,4.3,4.4,5.66,5.66,0,0,0,1.8-.3v4.1a12.06,12.06,0,0,1-3.7.6m20.9.1c-9.2,0-13.6-3.7-13.6-9.7,0-8.5,8.9-10.7,19.4-11.7V92.4c0-4.3-2.9-5.6-7.2-5.6a22.34,22.34,0,0,0-8.5,1.8l-1.6-3.8a30.2,30.2,0,0,1,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9c-2.6,1.4-6.9,2.3-12.1,2.3m5.8-18.2c-7.8.8-13,2.3-13,8.3,0,4.2,3,6.1,7.7,6.1a12.33,12.33,0,0,0,5.3-1.1Zm24.6,18.1c-6.6,0-9.1-4.3-9.1-8.5V87.5H454V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2a4.07,4.07,0,0,0,4.3,4.4,5.66,5.66,0,0,0,1.8-.3v4.1a12.69,12.69,0,0,1-3.7.6m12.3-37.6a3.52,3.52,0,1,1,3.9-3.5,3.65,3.65,0,0,1-3.9,3.5m-3.4,5.5h6.8v31.4h-6.8Zm21.4,32.2a19.46,19.46,0,0,1-9.5-2.3l1.8-4.3a13.21,13.21,0,0,0,6.9,1.9c3.4,0,6.2-2.2,6.2-4.9,0-7.5-13.8-4-13.8-14.2,0-4.7,4.2-9.2,11-9.2a16.21,16.21,0,0,1,8.8,2.3l-1.8,3.9a10.31,10.31,0,0,0-5.7-1.8c-3.5,0-5.6,2.1-5.6,4.5,0,7,14,3.9,14,14.4,0,4.9-4.7,9.7-12.3,9.7m29.4-.1c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2c0,2.5,1.4,4.4,4.3,4.4a5.66,5.66,0,0,0,1.8-.3v4.1a12.06,12.06,0,0,1-3.7.6m12.3-37.6a3.52,3.52,0,1,1,3.9-3.5c.1,2-1.7,3.5-3.9,3.5m-3.3,5.5H543v31.4h-6.8Zm26.2,32.2c-7.7,0-13.6-6.3-13.6-16.6s6.1-16.5,13.7-16.5c3.9,0,6.6,1.1,8,2.3L569,88.6a8.61,8.61,0,0,0-4.9-1.5c-5.5,0-8.3,4.7-8.3,11.8s3.3,11.9,8.2,11.9a8.39,8.39,0,0,0,4.9-1.6l1.7,4.1c-1.5,1.2-4.2,2.3-8.2,2.3m20.6,0a19.46,19.46,0,0,1-9.5-2.3l1.8-4.3a13.21,13.21,0,0,0,6.9,1.9c3.4,0,6.2-2.2,6.2-4.9,0-7.5-13.8-4-13.8-14.2,0-4.7,4.2-9.2,11-9.2a16.85,16.85,0,0,1,8.9,2.3l-1.8,3.9A10.31,10.31,0,0,0,587,87c-3.5,0-5.6,2.1-5.6,4.5,0,7,14,3.9,14,14.4-.1,4.9-4.9,9.7-12.4,9.7"></path></g></svg></div></a></div> <div class="ons-grid__col ons-col-auto ons-header__menu-links ons-u-ml-auto svelte-1m3m1gv"><div class="ons-header__links ons-grid__col"><button type="button" class="ons-btn ons-u-fs-r--b ons-js-toggle-nav-menu ons-u-db-no-js_disabled button-nav ons-btn--menu" aria-label="Toggle menu" aria-controls="menu-links" aria-expanded="false" aria-disabled="true"><span class="ons-btn__inner"><svg class="ons-icon ons-u-mr-2xs" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor" role="img" aria-hidden="true"><path d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z" transform="translate(-5.02 -1.59)"></path></svg><span class="ons-btn__text">${escape_html(i18n("Menu"))}</span></span></button></div> `);
        if (search) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="ons-header__links ons-grid__col ons-header__menu-links svelte-1m3m1gv"><button type="button" class="ons-btn ons-u-fs-s--b ons-js-toggle-header-search ons-u-db-no-js_disabled ons-btn--search-icon ons-btn--search" aria-label="Toggle search" aria-controls="search" aria-expanded="false" aria-disabled="true"><span class="ons-btn__inner"><svg class="ons-icon ons-u-mr-2xs" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" role="img"><path d="M11.86 10.23 8.62 6.99a4.63 4.63 0 1 0-6.34 1.64 4.55 4.55 0 0 0 2.36.64 4.65 4.65 0 0 0 2.33-.65l3.24 3.23a.46.46 0 0 0 .65 0l1-1a.48.48 0 0 0 0-.62Zm-5-3.32a3.28 3.28 0 0 1-2.31.93 3.22 3.22 0 1 1 2.35-.93Z"></path></svg><span class="ons-btn__text"></span></span></button></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div> `);
        if (bilingual) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="ons-header__links ons-grid__col ons-col-auto ons-header__links--language-section ons-u-d-no@2xs@m"><div class="ons-header__language ons-u-fs-r--b svelte-1m3m1gv"><ul class="ons-language-links"><li class="ons-language-links__item"><a${attr("href", `${stringify(baseother)}${stringify(path)}`)} class="language__link"${attr("lang", lang == "en" ? "cy" : "en")}><span class="ons-u-vh">${escape_html(i18n("Newid iaith i"))}</span>${escape_html(i18n("Cymraeg"))}</a></li></ul></div></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <nav${attr_class("ons-js-nav-menu ons-header-nav-menu ons-u-pt-2xl ons-u-d-no disabled svelte-1m3m1gv", void 0, { "ons-header-menu--border": menuBorder })} id="menu-links" aria-label="Menu navigation" aria-hidden="true">`);
    Container($$renderer2, {
      width,
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="ons-header-nav-menu__language ons-u-fs-s--b ons-u-d-no@m ons-u-d-no@2xl"><ul class="ons-language-links"><li class="ons-language-links__item"><a${attr("href", `${stringify(baseother)}${stringify(path)}`)}${attr("lang", lang == "en" ? "cy" : "en")}><span class="ons-u-vh">${escape_html(i18n("Newid iaith i"))}</span>${escape_html(i18n("Cymraeg"))}</a></li></ul></div> <ul class="ons-grid ons-header-nav-menu__key-list"><!--[-->`);
        const each_array = ensure_array_like(menu.main);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let item = each_array[$$index];
          $$renderer3.push(`<li class="ons-grid__col ons-col-4@m ons-header-nav-menu__col"><h2 class="ons-u-fs-s--b ons-u-mb-no ons-header-nav-menu__heading"><a${attr("href", `${stringify(baseurl)}${stringify(item.url)}`)} class="ons-header-nav-menu__link">${escape_html(item[`label_${lang}`])}</a></h2> <p class="ons-u-fs-s ons-u-mb-no ons-header-nav-menu__description">${escape_html(item[`description_${lang}`])}</p></li>`);
        }
        $$renderer3.push(`<!--]--></ul>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Container($$renderer2, {
      width,
      children: ($$renderer3) => {
        $$renderer3.push(`<ul class="ons-grid ons-list ons-list--bare"><!--[-->`);
        const each_array_1 = ensure_array_like(columns);
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let col = each_array_1[i];
          $$renderer3.push(`<li class="ons-grid__col ons-col-4@m ons-u-mb-no ons-header-nav-menu__col"><!--[-->`);
          const each_array_2 = ensure_array_like(col);
          for (let $$index_2 = 0, $$length2 = each_array_2.length; $$index_2 < $$length2; $$index_2++) {
            let topic = each_array_2[$$index_2];
            $$renderer3.push(`<h2 class="ons-u-fs-s--b ons-header-nav-menu__heading"><a${attr("href", `${stringify(baseurl)}${stringify(topic.url)}`)} class="ons-header-nav-menu__link">${escape_html(topic[`label_${lang}`])}</a></h2> <ul class="ons-list ons-list--bare ons-header-nav-menu__groupItem-list"><!--[-->`);
            const each_array_3 = ensure_array_like(topic.children);
            for (let $$index_1 = 0, $$length3 = each_array_3.length; $$index_1 < $$length3; $$index_1++) {
              let item = each_array_3[$$index_1];
              $$renderer3.push(`<li class="ons-u-mb-no"><p class="ons-u-fs-s ons-header-nav-menu_text"><a${attr("href", `${stringify(baseurl)}${stringify(item.url)}`)} class="ons-header-nav-menu__link">${escape_html(item[`label_${lang}`])}</a></p></li>`);
            }
            $$renderer3.push(`<!--]--></ul>`);
          }
          $$renderer3.push(`<!--]--></li>`);
        }
        $$renderer3.push(`<!--]--></ul>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></nav> `);
    if (search) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<nav${attr_class("ons-js-header-search ons-header-nav-search ons-u-d-no disabled svelte-1m3m1gv", void 0, { "ons-header-menu--border": menuBorder })} id="search" aria-label="Nav Search" aria-hidden="true">`);
      Container($$renderer2, {
        width,
        children: ($$renderer3) => {
          $$renderer3.push(`<form class="ons-header-nav-search__input" method="get" action="https://www.ons.gov.uk/search"><div class="ons-field"><label class="ons-label" for="search-field" id="header-search-input-label">${escape_html(i18n("Search the ONS"))}</label> <span class="ons-grid-flex ons-grid-flex--vertical-top ons-input_search-button ons-input__button--header-search"><input type="search" id="search-field" class="ons-input ons-input--text ons-input-type__input ons-search__input ons-input--header-search ons-input--w-full" name="q"/> <button type="submit" class="ons-btn ons-search__btn ons-btn--header-search"><span class="ons-btn__inner"><svg class="ons-icon" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" role="img"><path d="M11.86 10.23 8.62 6.99a4.63 4.63 0 1 0-6.34 1.64 4.55 4.55 0 0 0 2.36.64 4.65 4.65 0 0 0 2.33-.65l3.24 3.23a.46.46 0 0 0 .65 0l1-1a.48.48 0 0 0 0-.62Zm-5-3.32a3.28 3.28 0 0 1-2.31.93 3.22 3.22 0 1 1 2.35-.93Z"></path></svg><span class="ons-btn__text ons-u-vh@2xs@s"><span class="ons-u-vh">${escape_html(i18n("Search"))}</span></span></span></button></span></div></form>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Container($$renderer2, {
        width,
        children: ($$renderer3) => {
          $$renderer3.push(`<h2 class="ons-u-fs-r--b ons-u-mb-s ons-header-nav-search__heading">${escape_html(i18n("Popular searches"))}</h2> <ul class="ons-list ons-list--bare ons-list--inline"><!--[-->`);
          const each_array_4 = ensure_array_like(menu.searches);
          for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
            let item = each_array_4[$$index_4];
            $$renderer3.push(`<li class="ons-list__item"><a${attr("href", `${stringify(baseurl)}search?q=${stringify(item[`label_${lang}`])}`)} class="ons-u-fs-r ons-header-nav-search__text">${escape_html(item[`label_${lang}`])}</a></li>`);
          }
          $$renderer3.push(`<!--]--></ul>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></nav>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, {
      width,
      headerBorder,
      menuBorder,
      search,
      bilingual,
      lang,
      baseurl,
      baseother,
      path,
      i18n
    });
  });
}
function HeaderNavCompact($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let width = fallback($$props["width"], "wide");
    let headerBorder = fallback($$props["headerBorder"], false);
    let baseurl = fallback($$props["baseurl"], "https://www.ons.gov.uk");
    let i18n = fallback($$props["i18n"], (text) => text);
    $$renderer2.push(`<div${attr_class("ons-header__top svelte-1tjjm3s", void 0, { "ons-header--border": headerBorder })}>`);
    Container($$renderer2, {
      width,
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="ons-header__grid-top ons-grid ons-grid-flex ons-grid-flex--between ons-grid-flex--vertical-center ons-grid-flex--no-wrap ons-grid--gutterless"><div class="ons-grid__col ons-col-auto"><a class="ons-header__org-logo-link"${attr("href", baseurl)}${attr("aria-label", `${stringify(i18n("Office for National Statistics"))} - ${stringify(i18n("Homepage"))}`)}><div class="ons-header__org-logo ons-header__org-logo--large"><svg class="ons-icon--logo" xmlns="http://www.w3.org/2000/svg" width="250" height="24" viewBox="33 2 552 60" aria-labelledby="ons-logo-en-alt" role="img"><title id="ons-logo-en-alt">${escape_html(i18n("Office for National Statistics logo"))} - ${escape_html(i18n("Homepage"))}</title><g class="ons-icon--logo__group ons-icon--logo__group--secondary" fill="#a8bd3a"><path d="M0,34.6c.8-1.69,1.39-3,2.32-4.6A38.28,38.28,0,0,1,0,23.4V34.6M5,3S0,3,0,9.25v1A62.12,62.12,0,0,0,4.2,27a43.77,43.77,0,0,1,9.42-10.79C21.69,9.21,31.16,5.13,45.9,3Z"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--primary svelte-1tjjm3s" fill="#003c57"><path d="M53.06,6.42C36.2,8,24.68,12.92,16.43,20.07A41.46,41.46,0,0,0,6.4,32.2C12.87,44.93,28.88,57,46.6,57H47s6.32.21,6.32-6.91V6.36a1.22,1.22,0,0,1-.26.06M9.72,42.67a44.25,44.25,0,0,1-5-7.42A80.59,80.59,0,0,0,0,46.38V56.91L31.06,57c-9.83-3-15.74-7.64-21.34-14.3"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--text svelte-1tjjm3s" fill="#003c57"><path d="M82,47.49c-9.07,0-13.13-7.51-13.13-16.77S72.91,14,82,14s13.1,7.61,13.1,16.77S91.1,47.54,82,47.54m0-30.91c-6.69,0-9.07,7.33-9.07,14.05s2.16,13.9,9.07,13.9,9-7.28,9-13.9-2.34-14-9-14"></path><path d="M106.36,23.81V46.88h-3.67V23.81H98.93V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z"></path><path d="M121.53,23.81V46.88h-3.67V23.81H114.1V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z"></path><path d="M132.85,16.72a2.28,2.28,0,0,1-2.33-2.23v0a2.34,2.34,0,0,1,4.67,0,2.28,2.28,0,0,1-2.3,2.26h0M131,21.56h3.71V46.88H131Z"></path><path d="M150.53,47.49c-6,0-10.63-5.16-10.63-13.29S144.52,21,150.66,21a9.76,9.76,0,0,1,6.17,1.74l-1,2.25a7.53,7.53,0,0,0-4.4-1.36c-5.15,0-7.78,4.46-7.78,10.48,0,6.2,3,10.62,7.65,10.62a8,8,0,0,0,4.49-1.37l1,2.45a10.21,10.21,0,0,1-6.3,1.73"></path><path d="M162.84,35.75c.48,6,3.76,9,8.9,9a14.66,14.66,0,0,0,6.88-1.55l1.08,2.59a18,18,0,0,1-8.22,1.73c-7.12,0-12.18-4.23-12.18-13.34,0-8.69,4.67-13.2,11-13.2s10.37,3.95,10.37,12.4Zm7.35-12.41c-4.1,0-7.56,3.2-7.52,10.29l14.39-2c0-5.87-2.81-8.32-6.87-8.32"></path><path d="M198.57,23.81V46.88H194.9V23.81h-3.76V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.39,0,.87.05.87.05v2.35h-.44c-2.54,0-4.84,1.64-4.84,5.12v4.09h5.28v2.25Z"></path><path d="M217.28,47.49c-7.47,0-10.89-5.78-10.89-13.24S209.81,21,217.28,21s10.85,5.82,10.85,13.3-3.37,13.24-10.85,13.24m0-24c-5.53,0-7.13,5.59-7.13,10.81s1.73,10.56,7.13,10.56,7.13-5.35,7.13-10.56-1.6-10.81-7.13-10.81"></path><path d="M244.08,23.91c-2.34-.61-5.75-.52-7.35.47v22.5H233V22.69c2.67-1.13,5.36-1.74,10.11-1.74H245Z"></path><path d="M277.42,47.13,263.07,25a32.2,32.2,0,0,1-1.85-3.29h-.09s.13,1.88.13,3.85V47.13h-4.71V14.8h5.31l13.61,20.82A28.76,28.76,0,0,1,277.38,39h.08s-.17-1.84-.17-3.77V14.8H282V47.13Z"></path><path d="M297.52,47.79c-7.43,0-10.93-3-10.93-7.81,0-6.8,7.12-8.64,15.59-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L288.23,23a24,24,0,0,1,9.12-1.83c5.61,0,9.93,2.3,9.93,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.26.67-10.45,1.84-10.45,6.73,0,3.42,2.42,4.88,6.22,4.88a10.09,10.09,0,0,0,4.23-.84Z"></path><path d="M322,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.55V21.81h3.55V16.12l5.4-1.5v7.19H325v3.28h-5V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52"></path><path d="M331.91,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z"></path><path d="M350.88,47.79c-7.73,0-11.57-5.74-11.57-13.3s3.84-13.34,11.57-13.34,11.54,5.78,11.54,13.34-3.8,13.3-11.54,13.3m0-23.17c-4.66,0-6.05,4.89-6.05,9.82s1.47,9.63,6.05,9.63,6.05-4.7,6.05-9.63-1.38-9.82-6.05-9.82"></path><path d="M382.52,47.13V29c0-3.24-2.77-4.47-5.88-4.47a12.3,12.3,0,0,0-4.37.76v21.8h-5.39V23a26.81,26.81,0,0,1,10.06-1.83c6.61,0,11,2.25,11,7.8V47.13Z"></path><path d="M403.18,47.79c-7.43,0-10.94-3-10.94-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L393.89,23A24,24,0,0,1,403,21.15c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.43,4.88,6.23,4.88a10.09,10.09,0,0,0,4.23-.84Z"></path><polygon points="418.52 47.13 418.52 34.91 418.52 10.25 423.92 10.25 423.92 22.76 423.92 47.13 418.52 47.13"></polygon><path d="M445.39,47.79A19.11,19.11,0,0,1,436.58,46l1.51-4a13.48,13.48,0,0,0,6.22,1.55c3.76,0,6.44-2.21,6.44-5.41,0-7.09-13.44-4.36-13.44-14.42,0-5.13,4.15-9.59,10.72-9.59A15.82,15.82,0,0,1,455.8,16l-1.38,3.52a11.93,11.93,0,0,0-5.66-1.5c-3.5,0-5.79,2.11-5.79,5.12,0,7,13.74,3.94,13.74,14.65,0,5.74-4.71,10-11.32,10"></path><path d="M470.41,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.12,5.12,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52"></path><path d="M487.27,47.79c-7.44,0-10.93-3-10.93-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.38-4.51-5.84-4.51a18,18,0,0,0-6.87,1.46L478,23a23.94,23.94,0,0,1,9.11-1.83c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83M492,33.16c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.42,4.88,6.22,4.88a10,10,0,0,0,4.24-.84Z"></path><path d="M511.73,47.69c-5.32,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52"></path><path d="M521.66,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.45V47.13h-5.45Z"></path><path d="M536.19,47.79A15.9,15.9,0,0,1,528.54,46L530,42.48a10.53,10.53,0,0,0,5.52,1.5c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.86-7.42A13.56,13.56,0,0,1,545.34,23l-1.42,3.14a8.47,8.47,0,0,0-4.62-1.45c-2.81,0-4.54,1.69-4.54,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9"></path><path d="M559.83,47.69c-5.31,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.93v3.28h-4.93V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.64,5.64,0,0,0,1.47-.23v3.33a7.72,7.72,0,0,1-3,.52"></path><path d="M569.77,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z"></path><path d="M588.14,47.79c-6.23,0-11-5.08-11-13.35s4.88-13.29,11-13.29A10.51,10.51,0,0,1,594.66,23l-1.21,3a6.87,6.87,0,0,0-4-1.22c-4.4,0-6.69,3.81-6.69,9.49s2.63,9.59,6.61,9.59a6.74,6.74,0,0,0,4-1.28L594.7,46c-1.12.94-3.33,1.84-6.56,1.84"></path><path d="M605.1,47.79A15.9,15.9,0,0,1,597.45,46l1.42-3.47A10.54,10.54,0,0,0,604.4,44c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.85-7.42a13.49,13.49,0,0,1,7.1,1.83l-1.42,3.14a8.42,8.42,0,0,0-4.63-1.45c-2.8,0-4.53,1.69-4.53,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9"></path></g></svg></div> <div class="ons-header__org-logo ons-header__org-logo--small"><svg class="ons-icon--logo" xmlns="http://www.w3.org/2000/svg" width="120" height="27" viewBox="0 5 595 116" aria-labelledby="ons-logo-stacked-en-alt" role="img"><title id="ons-logo-stacked-en-alt">${escape_html(i18n("Office for National Statistics logo"))}</title><g class="ons-icon--logo__group ons-icon--logo__group--secondary" fill="#a8bd3a"><path d="M0,70.5c1.8-3.7,3.6-7.2,5.6-10.7A127.94,127.94,0,0,1,0,42.6V70.5M10.9,0S0,0,0,13.5v7.2A128.06,128.06,0,0,0,7.9,56.2a114.75,114.75,0,0,1,22.3-26C47.8,15.1,71.5,4.7,103.7.1Z"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--primary svelte-1tjjm3s" fill="#003c57"><path d="M115.9,7.3c-36.8,3.5-62,14-80,29.4a108.15,108.15,0,0,0-23.6,29c14.1,27.4,41.1,47.6,86,50.5h4.4s13.8.5,13.8-14.9V7.2l-.6.1M21.2,85.4a92.68,92.68,0,0,1-11-16A173,173,0,0,0,0,93.4v22.7l73.6.1c-22.9-5.5-40.1-16.4-52.4-30.8"></path></g><g class="ons-icon--logo__group ons-icon--logo__group--text svelte-1tjjm3s" fill="#003c57"><path d="M161,51.9c-11.3,0-16.3-9.3-16.3-20.8s5-20.8,16.3-20.8,16.3,9.5,16.3,20.8c-.1,11.5-5.1,20.8-16.3,20.8m0-38.3c-8.3,0-11.3,9.1-11.3,17.4s2.7,17.3,11.3,17.3,11.2-9.1,11.2-17.3S169.3,13.6,161,13.6m30.2,8.9V51.2h-4.5V22.6H182V19.8h4.7V15.2c0-5.7,3.4-9.9,10-9.9a8,8,0,0,1,1.1.1V8.3h-.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8l-6.7-.1Zm18.9,0V51.2h-4.5V22.6h-4.7V19.8h4.7V15.2c0-5.7,3.4-9.9,10-9.9a8,8,0,0,1,1.1.1V8.3h-.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8l-6.7-.1Zm14-8.8a2.82,2.82,0,0,1-2.9-2.8,2.9,2.9,0,0,1,5.8,0,2.76,2.76,0,0,1-2.9,2.8m-2.3,6h4.6V51.2h-4.6Zm24.3,32.2c-7.4,0-13.2-6.4-13.2-16.5,0-10.3,5.8-16.5,13.4-16.5a12.36,12.36,0,0,1,7.7,2.2l-1.2,2.8a8.92,8.92,0,0,0-5.5-1.7c-6.4,0-9.7,5.5-9.7,13,0,7.7,3.7,13.2,9.5,13.2a9.8,9.8,0,0,0,5.6-1.7l1.2,3c-1.3,1.2-4,2.2-7.8,2.2m15.3-14.6c.6,7.4,4.7,11.1,11.1,11.1a18.36,18.36,0,0,0,8.5-1.9l1.3,3.2a22.58,22.58,0,0,1-10.2,2.1c-8.8,0-15.1-5.3-15.1-16.6,0-10.8,5.8-16.4,13.7-16.4s12.9,4.9,12.9,15.4l-22.2,3.1ZM270.5,22c-5.1,0-9.4,4-9.3,12.8l17.9-2.5C279,25,275.5,22,270.5,22m42.2.5V51.2h-4.5V22.6h-4.7V19.8h4.7V15.2c0-5.7,3.4-9.9,10-9.9a8,8,0,0,1,1.1.1V8.3h-.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8Zm23.2,29.4c-9.3,0-13.5-7.2-13.5-16.5s4.2-16.5,13.5-16.5,13.5,7.2,13.5,16.5-4.2,16.5-13.5,16.5m0-29.8c-6.9,0-8.8,7-8.8,13.4s2.1,13.1,8.8,13.1c6.9,0,8.9-6.6,8.9-13.1s-2-13.4-8.9-13.4m33.3.6c-2.9-.8-7.1-.6-9.1.6V51.2h-4.6V21.1c3.3-1.4,6.6-2.2,12.5-2.2h2.4c0,.1-1.2,3.8-1.2,3.8ZM171.3,114.8,153.5,87.3c-1.3-2.1-2.3-4.1-2.3-4.1h-.1s.2,2.3.2,4.8v26.8h-5.8V74.7h6.6L169,100.5a46.13,46.13,0,0,1,2.4,4.1h.1s-.2-2.3-.2-4.7V74.6h5.9v40.1l-5.9.1Zm25,.8c-9.2,0-13.6-3.7-13.6-9.7,0-8.5,8.8-10.7,19.4-11.7V92.4c0-4.3-2.9-5.6-7.2-5.6a22.34,22.34,0,0,0-8.5,1.8l-1.6-3.8a30.2,30.2,0,0,1,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9c-2.7,1.4-6.9,2.3-12.1,2.3m5.8-18.2c-7.8.8-13,2.3-13,8.3,0,4.2,3,6.1,7.7,6.1a12.33,12.33,0,0,0,5.3-1.1Zm24.5,18.1c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2c0,2.5,1.4,4.4,4.3,4.4a5.66,5.66,0,0,0,1.8-.3v4.1a11.47,11.47,0,0,1-3.7.6M239,77.9a3.52,3.52,0,1,1,3.9-3.5,3.71,3.71,0,0,1-3.9,3.5m-3.4,5.5h6.8v31.4h-6.8Zm26.9,32.2c-9.6,0-14.4-7.1-14.4-16.5s4.8-16.6,14.4-16.6,14.3,7.2,14.3,16.6-4.7,16.5-14.3,16.5m0-28.7c-5.8,0-7.5,6.1-7.5,12.2s1.8,11.9,7.5,11.9,7.5-5.8,7.5-11.9-1.7-12.2-7.5-12.2m39.3,27.9V92.3c0-4-3.4-5.5-7.3-5.5a16,16,0,0,0-5.4.9v27.1h-6.7v-30a32.8,32.8,0,0,1,12.5-2.3c8.2,0,13.7,2.8,13.7,9.7v22.6Zm25.7.8c-9.2,0-13.6-3.7-13.6-9.7,0-8.5,8.9-10.7,19.4-11.7V92.4c0-4.3-2.9-5.6-7.2-5.6a22.34,22.34,0,0,0-8.5,1.8L316,84.8a30.2,30.2,0,0,1,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9c-2.7,1.4-6.9,2.3-12.1,2.3m5.8-18.2c-7.8.8-13,2.3-13,8.3,0,4.2,3,6.1,7.7,6.1a12.33,12.33,0,0,0,5.3-1.1Zm13.2,17.4V69h6.7v45.8Zm38.6.8a23.94,23.94,0,0,1-10.9-2.3l1.9-4.9a17,17,0,0,0,7.7,1.9c4.7,0,8-2.7,8-6.7,0-8.8-16.7-5.4-16.7-17.9,0-6.4,5.2-11.9,13.3-11.9a20.22,20.22,0,0,1,9.7,2.3l-1.7,4.4a14.57,14.57,0,0,0-7-1.9c-4.3,0-7.2,2.6-7.2,6.4,0,8.6,17.1,4.9,17.1,18.2-.1,7.1-6,12.4-14.2,12.4m31.1-.1c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2a4.07,4.07,0,0,0,4.3,4.4,5.66,5.66,0,0,0,1.8-.3v4.1a12.06,12.06,0,0,1-3.7.6m20.9.1c-9.2,0-13.6-3.7-13.6-9.7,0-8.5,8.9-10.7,19.4-11.7V92.4c0-4.3-2.9-5.6-7.2-5.6a22.34,22.34,0,0,0-8.5,1.8l-1.6-3.8a30.2,30.2,0,0,1,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9c-2.6,1.4-6.9,2.3-12.1,2.3m5.8-18.2c-7.8.8-13,2.3-13,8.3,0,4.2,3,6.1,7.7,6.1a12.33,12.33,0,0,0,5.3-1.1Zm24.6,18.1c-6.6,0-9.1-4.3-9.1-8.5V87.5H454V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2a4.07,4.07,0,0,0,4.3,4.4,5.66,5.66,0,0,0,1.8-.3v4.1a12.69,12.69,0,0,1-3.7.6m12.3-37.6a3.52,3.52,0,1,1,3.9-3.5,3.65,3.65,0,0,1-3.9,3.5m-3.4,5.5h6.8v31.4h-6.8Zm21.4,32.2a19.46,19.46,0,0,1-9.5-2.3l1.8-4.3a13.21,13.21,0,0,0,6.9,1.9c3.4,0,6.2-2.2,6.2-4.9,0-7.5-13.8-4-13.8-14.2,0-4.7,4.2-9.2,11-9.2a16.21,16.21,0,0,1,8.8,2.3l-1.8,3.9a10.31,10.31,0,0,0-5.7-1.8c-3.5,0-5.6,2.1-5.6,4.5,0,7,14,3.9,14,14.4,0,4.9-4.7,9.7-12.3,9.7m29.4-.1c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2c0,2.5,1.4,4.4,4.3,4.4a5.66,5.66,0,0,0,1.8-.3v4.1a12.06,12.06,0,0,1-3.7.6m12.3-37.6a3.52,3.52,0,1,1,3.9-3.5c.1,2-1.7,3.5-3.9,3.5m-3.3,5.5H543v31.4h-6.8Zm26.2,32.2c-7.7,0-13.6-6.3-13.6-16.6s6.1-16.5,13.7-16.5c3.9,0,6.6,1.1,8,2.3L569,88.6a8.61,8.61,0,0,0-4.9-1.5c-5.5,0-8.3,4.7-8.3,11.8s3.3,11.9,8.2,11.9a8.39,8.39,0,0,0,4.9-1.6l1.7,4.1c-1.5,1.2-4.2,2.3-8.2,2.3m20.6,0a19.46,19.46,0,0,1-9.5-2.3l1.8-4.3a13.21,13.21,0,0,0,6.9,1.9c3.4,0,6.2-2.2,6.2-4.9,0-7.5-13.8-4-13.8-14.2,0-4.7,4.2-9.2,11-9.2a16.85,16.85,0,0,1,8.9,2.3l-1.8,3.9A10.31,10.31,0,0,0,587,87c-3.5,0-5.6,2.1-5.6,4.5,0,7,14,3.9,14,14.4-.1,4.9-4.9,9.7-12.4,9.7"></path></g></svg></div></a></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { width, headerBorder, baseurl, i18n });
  });
}
function HeaderNavLegacy($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let search = fallback($$props["search"], true);
    let bilingual = fallback($$props["bilingual"], true);
    let lang = fallback($$props["lang"], "en");
    let baseurl = fallback($$props["baseurl"], "https://www.ons.gov.uk");
    let baseother = fallback($$props["baseother"], "https://cy.ons.gov.uk");
    let path = fallback($$props["path"], "");
    let i18n = fallback($$props["i18n"], (text) => text);
    const menu = [
      {
        label_en: "Business, industry and trade",
        label_cy: "Busnes, diwydiant a masnach",
        url: "/businessindustryandtrade",
        children: [
          {
            label_en: "Business",
            label_cy: "Busnes",
            url: "/businessindustryandtrade/business"
          },
          {
            label_en: "Changes to business",
            label_cy: "Newidiadau i fusnesau",
            url: "/businessindustryandtrade/changestobusiness"
          },
          {
            label_en: "Construction industry",
            label_cy: "Diwydiant adeiladu",
            url: "/businessindustryandtrade/constructionindustry"
          },
          {
            label_en: "IT and internet industry",
            label_cy: "Y diwydiant TG a'r rhyngrwyd",
            url: "/businessindustryandtrade"
          },
          {
            label_en: "International trade",
            label_cy: "Masnach ryngwladol",
            url: "/businessindustryandtrade/itandinternetindustry"
          },
          {
            label_en: "Manufacturing and production industry",
            label_cy: "Y diwydiant gweithgynhyrchu a chynhyrchu",
            url: "/businessindustryandtrade/manufacturingandproductionindustry"
          },
          {
            label_en: "Retail industry",
            label_cy: "Y diwydiant manwerthu",
            url: "/businessindustryandtrade/retailindustry"
          },
          {
            label_en: "Tourism industry",
            label_cy: "Y diwydiant twristiaeth",
            url: "/businessindustryandtrade/tourismindustry"
          }
        ]
      },
      {
        label_en: "Economy",
        label_cy: "Yr economi",
        url: "/economy",
        children: [
          {
            label_en: "Economic output and productivity",
            label_cy: "Allgynnyrch economaidd a chynhyrchiant",
            url: "/economy/economicoutputandproductivity"
          },
          {
            label_en: "Environmental accounts",
            label_cy: "Cyfrifon amgylcheddol",
            url: "/economy/environmentalaccounts"
          },
          {
            label_en: "Government, public sector and taxes",
            label_cy: "Llywodraeth, y sector cyhoeddus a threthi",
            url: "/economy/governmentpublicsectorandtaxes"
          },
          {
            label_en: "Gross Domestic Product (GDP)",
            label_cy: "Cynnyrch Domestig Gros (CDG)",
            url: "/economy/grossdomesticproductgdp"
          },
          {
            label_en: "Gross Value Added (GVA)",
            label_cy: "Gwerth Ychwanegol Gros",
            url: "/economy/grossvalueaddedgva"
          },
          {
            label_en: "Inflation and price indices",
            label_cy: "Mynegeion chwyddiant a phrisiau",
            url: "/economy/inflationandpriceindices"
          },
          {
            label_en: "Investments, pensions and trusts",
            label_cy: "Buddsoddiadau, pensiynau ac ymddiriedolaethau",
            url: "/economy/investmentspensionsandtrusts"
          },
          {
            label_en: "National accounts",
            label_cy: "Cyfrifon gwladol",
            url: "/economy/nationalaccounts"
          },
          {
            label_en: "Regional accounts",
            label_cy: "Cyfrifon rhanbarthol",
            url: "/economy/regionalaccounts"
          }
        ]
      },
      {
        label_en: "Employment and labour market",
        label_cy: "Cyflogaeth a'r farchnad lafur",
        url: "/employmentandlabourmarket",
        children: [
          {
            label_en: "People in work",
            label_cy: "Pobl mewn gwaith",
            url: "/employmentandlabourmarket/peopleinwork"
          },
          {
            label_en: "People not in work",
            label_cy: "Pobl nad ydynt mewn gwaith",
            url: "/employmentandlabourmarket/peoplenotinwork"
          }
        ]
      },
      {
        label_en: "People, population and community",
        label_cy: "Pobl, y boblogaeth a chymunedau",
        url: "/peoplepopulationandcommunity",
        children: [
          {
            label_en: "Births, deaths and marriages",
            label_cy: "Genedigaethau, marwolaethau a phriodasau",
            url: "/peoplepopulationandcommunity/birthsdeathsandmarriages"
          },
          {
            label_en: "Crime and justice",
            label_cy: "Troseddu a chyfiawnder",
            url: "/peoplepopulationandcommunity/crimeandjustice"
          },
          {
            label_en: "Cultural identity",
            label_cy: "Hunaniaeth ddiwylliannol",
            url: "/peoplepopulationandcommunity/culturalidentity"
          },
          {
            label_en: "Education and childcare",
            label_cy: "Addysg a gofal plant",
            url: "/peoplepopulationandcommunity/educationandchildcare"
          },
          {
            label_en: "Elections",
            label_cy: "Etholiadau",
            url: "/peoplepopulationandcommunity/elections"
          },
          {
            label_en: "Health and social care",
            label_cy: "Iechyd a gofal cymdeithasol",
            url: "/peoplepopulationandcommunity/healthandsocialcare"
          },
          {
            label_en: "Household characteristics",
            label_cy: "Nodweddion aelwydydd",
            url: "/peoplepopulationandcommunity/householdcharacteristics"
          },
          {
            label_en: "Housing",
            label_cy: "Tai",
            url: "/peoplepopulationandcommunity/housing"
          },
          {
            label_en: "Leisure and tourism",
            label_cy: "Hamdden a thwristiaeth",
            url: "/peoplepopulationandcommunity/leisureandtourism"
          },
          {
            label_en: "Personal and household finances",
            label_cy: "Cyllid personol a chyllid aelwydydd",
            url: "/peoplepopulationandcommunity/personalandhouseholdfinances"
          },
          {
            label_en: "Population and migration",
            label_cy: "Poblogaeth ac ymfudo",
            url: "/peoplepopulationandcommunity/populationandmigration"
          },
          {
            label_en: "Well-being",
            label_cy: "Lles",
            url: "/peoplepopulationandcommunity/wellbeing"
          }
        ]
      },
      {
        label_en: "Taking part in a survey?",
        label_cy: "Cymryd rhan mewn arolwg?",
        url: "/surveys"
      },
      {
        label_en: "Release calendar",
        label_cy: "Calendar datganiadau",
        url: "/releasecalendar",
        secondary: true
      },
      {
        label_en: "Methodology",
        label_cy: "Methodoleg",
        url: "/methodology",
        secondary: true
      },
      {
        label_en: "Media",
        label_cy: "Media",
        url: "/news",
        secondary: true
      },
      {
        label_en: "About",
        label_cy: "Amdanom ni",
        url: "/aboutus",
        secondary: true
      },
      {
        label_en: "Blog",
        label_cy: "Blog",
        url: "https://blog.ons.gov.uk/",
        secondary: true
      }
    ];
    $$renderer2.push(`<div class="ons-container"><div class="header col-wrap"><div class="col col--lg-one-third col--md-one-third"><a${attr("href", `${stringify(baseurl)}/`)}${attr("aria-label", `${stringify(i18n("Office for National Statistics logo"))} - ${stringify(i18n("Homepage"))}`)}><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 595.3 116.3" aria-hidden="true" class="logo"><title>${escape_html(i18n("Office for National Statistics logo"))} - ${escape_html(i18n("Homepage"))}</title><path class="ons-icon--logo__group ons-icon--logo__group--secondary" d="M0,70.5c1.8-3.7,3.6-7.2,5.6-10.7C3.3,54.2,1.5,48.5,0,42.6V70.5 M10.9,0C10.9,0,0,0,0,13.5v7.2
	C1,33,3.6,45,7.9,56.2c6.1-9.6,13.4-18.4,22.3-26C47.8,15.1,71.5,4.7,103.7,0.1L10.9,0z" fill="#a8bd3a"></path><path class="ons-icon--logo__group ons-icon--logo__group--primary" d="M115.9,7.3c-36.8,3.5-62,14-80,29.4c-9.7,8.3-17.3,18-23.6,29c14.1,27.4,41.1,47.6,86,50.5h4.4
	c0,0,13.8,0.5,13.8-14.9V7.2L115.9,7.3 M21.2,85.4c-4.2-4.9-7.9-10.3-11-16C6.3,76.9,2.9,84.9,0,93.4v22.7l73.6,0.1
	C50.7,110.7,33.5,99.8,21.2,85.4" fill="#003c57"></path><path class="ons-icon--logo__group ons-icon--logo__group--text" d="M161,51.9c-11.3,0-16.3-9.3-16.3-20.8c0-11.4,5-20.8,16.3-20.8s16.3,9.5,16.3,20.8
	C177.2,42.6,172.2,51.9,161,51.9 M161,13.6c-8.3,0-11.3,9.1-11.3,17.4c0,8.2,2.7,17.3,11.3,17.3s11.2-9.1,11.2-17.3
	C172.2,22.7,169.3,13.6,161,13.6 M191.2,22.5v28.7h-4.5V22.6H182v-2.8h4.7v-4.6c0-5.7,3.4-9.9,10-9.9c0.5,0,1.1,0.1,1.1,0.1v2.9
	h-0.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8L191.2,22.5L191.2,22.5z M210.1,22.5v28.7h-4.5V22.6h-4.7v-2.8h4.7v-4.6c0-5.7,3.4-9.9,10-9.9
	c0.5,0,1.1,0.1,1.1,0.1v2.9h-0.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8L210.1,22.5L210.1,22.5z M224.1,13.7c-1.6,0-2.9-1.2-2.9-2.8
	s1.3-2.9,2.9-2.9c1.6,0,2.9,1.3,2.9,2.9S225.8,13.7,224.1,13.7 M221.8,19.7h4.6v31.5h-4.6V19.7z M246.1,51.9
	c-7.4,0-13.2-6.4-13.2-16.5c0-10.3,5.8-16.5,13.4-16.5c3.8,0,6.3,1.1,7.7,2.2l-1.2,2.8c-1-0.8-2.9-1.7-5.5-1.7
	c-6.4,0-9.7,5.5-9.7,13c0,7.7,3.7,13.2,9.5,13.2c2.4,0,4.3-0.8,5.6-1.7l1.2,3C252.6,50.9,249.9,51.9,246.1,51.9 M261.4,37.3
	c0.6,7.4,4.7,11.1,11.1,11.1c3.9,0,6.8-1,8.5-1.9l1.3,3.2c-2,1.1-5.7,2.1-10.2,2.1c-8.8,0-15.1-5.3-15.1-16.6
	c0-10.8,5.8-16.4,13.7-16.4c8,0,12.9,4.9,12.9,15.4L261.4,37.3L261.4,37.3z M270.5,22c-5.1,0-9.4,4-9.3,12.8l17.9-2.5
	C279,25,275.5,22,270.5,22 M312.7,22.5v28.7h-4.5V22.6h-4.7v-2.8h4.7v-4.6c0-5.7,3.4-9.9,10-9.9c0.5,0,1.1,0.1,1.1,0.1v2.9h-0.5
	c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8L312.7,22.5z M335.9,51.9c-9.3,0-13.5-7.2-13.5-16.5s4.2-16.5,13.5-16.5s13.5,7.2,13.5,16.5
	C349.4,44.8,345.2,51.9,335.9,51.9 M335.9,22.1c-6.9,0-8.8,7-8.8,13.4c0,6.5,2.1,13.1,8.8,13.1c6.9,0,8.9-6.6,8.9-13.1
	S342.8,22.1,335.9,22.1 M369.2,22.7c-2.9-0.8-7.1-0.6-9.1,0.6v27.9h-4.6V21.1c3.3-1.4,6.6-2.2,12.5-2.2h2.4
	C370.4,19,369.2,22.7,369.2,22.7L369.2,22.7z M171.3,114.8l-17.8-27.5c-1.3-2.1-2.3-4.1-2.3-4.1h-0.1c0,0,0.2,2.3,0.2,4.8v26.8h-5.8
	V74.7h6.6l16.9,25.8c1.5,2.3,2.4,4.1,2.4,4.1h0.1c0,0-0.2-2.3-0.2-4.7V74.6h5.9v40.1L171.3,114.8L171.3,114.8z M196.3,115.6
	c-9.2,0-13.6-3.7-13.6-9.7c0-8.5,8.8-10.7,19.4-11.7v-1.8c0-4.3-2.9-5.6-7.2-5.6c-3.1,0-6.6,0.9-8.5,1.8l-1.6-3.8
	c2.2-0.9,6.3-2.3,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9C205.7,114.7,201.5,115.6,196.3,115.6 M202.1,97.4c-7.8,0.8-13,2.3-13,8.3
	c0,4.2,3,6.1,7.7,6.1c2.2,0,4.1-0.5,5.3-1.1V97.4z M226.6,115.5c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4v-4.1h4.4v-7l6.7-1.9v8.9h6.1v4.1
	h-6.1v19.2c0,2.5,1.4,4.4,4.3,4.4c0.6,0,1.2-0.1,1.8-0.3v4.1C229.7,115.1,228.4,115.5,226.6,115.5 M239,77.9c-2.1,0-3.9-1.6-3.9-3.5
	s1.8-3.5,3.9-3.5c2.1,0,3.9,1.6,3.9,3.5C242.9,76.4,241.1,77.9,239,77.9 M235.6,83.4h6.8v31.4h-6.8V83.4z M262.5,115.6
	c-9.6,0-14.4-7.1-14.4-16.5s4.8-16.6,14.4-16.6c9.6,0,14.3,7.2,14.3,16.6C276.9,108.5,272.1,115.6,262.5,115.6 M262.5,86.9
	c-5.8,0-7.5,6.1-7.5,12.2s1.8,11.9,7.5,11.9c5.8,0,7.5-5.8,7.5-11.9C270,92.9,268.3,86.9,262.5,86.9 M301.8,114.8V92.3
	c0-4-3.4-5.5-7.3-5.5c-2.1,0-4.1,0.4-5.4,0.9v27.1h-6.7v-30c2.9-1.3,7.6-2.3,12.5-2.3c8.2,0,13.7,2.8,13.7,9.7v22.6L301.8,114.8
	L301.8,114.8z M327.5,115.6c-9.2,0-13.6-3.7-13.6-9.7c0-8.5,8.9-10.7,19.4-11.7v-1.8c0-4.3-2.9-5.6-7.2-5.6c-3.1,0-6.6,0.9-8.5,1.8
	l-1.6-3.8c2.2-0.9,6.3-2.3,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9C336.9,114.7,332.7,115.6,327.5,115.6 M333.3,97.4
	c-7.8,0.8-13,2.3-13,8.3c0,4.2,3,6.1,7.7,6.1c2.2,0,4.1-0.5,5.3-1.1V97.4z M346.5,114.8V69h6.7v45.8H346.5z M385.1,115.6
	c-4.8,0-8.7-1.1-10.9-2.3l1.9-4.9c1.6,0.9,4.6,1.9,7.7,1.9c4.7,0,8-2.7,8-6.7c0-8.8-16.7-5.4-16.7-17.9c0-6.4,5.2-11.9,13.3-11.9
	c4.3,0,7.8,1.2,9.7,2.3l-1.7,4.4c-1.5-0.9-4.2-1.9-7-1.9c-4.3,0-7.2,2.6-7.2,6.4c0,8.6,17.1,4.9,17.1,18.2
	C399.2,110.3,393.3,115.6,385.1,115.6 M416.2,115.5c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4v-4.1h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2
	c0,2.5,1.5,4.4,4.3,4.4c0.6,0,1.2-0.1,1.8-0.3v4.1C419.3,115.1,417.9,115.5,416.2,115.5 M437.1,115.6c-9.2,0-13.6-3.7-13.6-9.7
	c0-8.5,8.9-10.7,19.4-11.7v-1.8c0-4.3-2.9-5.6-7.2-5.6c-3.1,0-6.6,0.9-8.5,1.8l-1.6-3.8c2.2-0.9,6.3-2.3,11.3-2.3
	c7,0,12.3,2.9,12.3,10.9v19.9C446.6,114.7,442.3,115.6,437.1,115.6 M442.9,97.4c-7.8,0.8-13,2.3-13,8.3c0,4.2,3,6.1,7.7,6.1
	c2.2,0,4.1-0.5,5.3-1.1V97.4z M467.5,115.5c-6.6,0-9.1-4.3-9.1-8.5V87.5H454v-4.1h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2
	c0,2.5,1.5,4.4,4.3,4.4c0.6,0,1.2-0.1,1.8-0.3v4.1C470.5,115.1,469.2,115.5,467.5,115.5 M479.8,77.9c-2.1,0-3.9-1.6-3.9-3.5
	s1.8-3.5,3.9-3.5s3.9,1.6,3.9,3.5C483.7,76.4,482,77.9,479.8,77.9 M476.4,83.4h6.8v31.4h-6.8V83.4z M497.8,115.6
	c-3.9,0-7.6-1.1-9.5-2.3l1.8-4.3c1.3,0.9,4,1.9,6.9,1.9c3.4,0,6.2-2.2,6.2-4.9c0-7.5-13.8-4-13.8-14.2c0-4.7,4.2-9.2,11-9.2
	c3.9,0,6.7,1,8.8,2.3l-1.8,3.9c-1-0.7-3.1-1.8-5.7-1.8c-3.5,0-5.6,2.1-5.6,4.5c0,7,14,3.9,14,14.4
	C510.1,110.8,505.4,115.6,497.8,115.6 M527.2,115.5c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4v-4.1h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2
	c0,2.5,1.4,4.4,4.3,4.4c0.6,0,1.2-0.1,1.8-0.3v4.1C530.3,115.1,528.9,115.5,527.2,115.5 M539.5,77.9c-2.1,0-3.9-1.6-3.9-3.5
	s1.8-3.5,3.9-3.5c2.1,0,3.9,1.6,3.9,3.5C543.5,76.4,541.7,77.9,539.5,77.9 M536.2,83.4h6.8v31.4h-6.8V83.4z M562.4,115.6
	c-7.7,0-13.6-6.3-13.6-16.6c0-10.4,6.1-16.5,13.7-16.5c3.9,0,6.6,1.1,8,2.3l-1.5,3.8c-1-0.7-2.7-1.5-4.9-1.5
	c-5.5,0-8.3,4.7-8.3,11.8c0,7.2,3.3,11.9,8.2,11.9c2.1,0,3.8-0.8,4.9-1.6l1.7,4.1C569.1,114.5,566.4,115.6,562.4,115.6 M583,115.6
	c-3.9,0-7.6-1.1-9.5-2.3l1.8-4.3c1.3,0.9,4,1.9,6.9,1.9c3.4,0,6.2-2.2,6.2-4.9c0-7.5-13.8-4-13.8-14.2c0-4.7,4.2-9.2,11-9.2
	c3.9,0,6.7,1,8.9,2.3l-1.8,3.9c-1-0.7-3.1-1.8-5.7-1.8c-3.5,0-5.6,2.1-5.6,4.5c0,7,14,3.9,14,14.4
	C595.3,110.8,590.5,115.6,583,115.6" fill="#003c57"></path></svg></a></div> <div class="col col--lg-two-thirds col--md-two-thirds hide--sm print--hide language--js__container"><div class="language"${attr_style("", { "min-height": "20px" })}>`);
    if (bilingual && lang == "en") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span>English (EN) |</span> <a${attr("href", `${stringify(baseother)}${stringify(path)}`)} class="language__link" lang="cy">Cymraeg (CY)</a>`);
    } else if (bilingual) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<a${attr("href", `${stringify(baseother)}${stringify(path)}`)} class="language__link" lang="en">English (EN)</a> <span>| Cymraeg (CY)</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="secondary-nav col col--lg-two-thirds col--md-two-thirds print--hide"><ul class="secondary-nav__list js-nav-clone__list"><!--[-->`);
    const each_array = ensure_array_like(menu.filter((d) => d.secondary));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<li class="secondary-nav__item"><a class="secondary-nav__link js-nav-clone__link"${attr("href", `${stringify(baseurl)}${stringify(item.url)}`)}>${escape_html(item["label_" + lang])}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div></div></div> <div class="primary-nav print--hide"><nav aria-label="Header links"><ul class="nav--controls"><li class="nav--controls__item"><a href="#nav-primary" id="menu-toggle" aria-controls="nav-primary" aria-expanded="false" class="nav--controls__menu"><span class="nav--controls__text">${escape_html(i18n("Menu"))}</span></a></li> <li class="nav--controls__item"><a href="#nav-search" id="search-toggle" aria-controls="nav-search" aria-expanded="false" class="nav--controls__search"><span class="nav--controls__text">${escape_html(i18n("Search"))}</span></a></li></ul> <ul class="ons-container nav-main--hidden primary-nav__list" id="nav-primary" aria-expanded="false"><li class="primary-nav__item js-nav"><a class="primary-nav__link col col--md-7 col--lg-9"${attr("href", `${stringify(baseurl)}/`)}>${escape_html(i18n("Home"))}</a></li> <!--[-->`);
    const each_array_1 = ensure_array_like(menu.filter((d) => !d.secondary));
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let item = each_array_1[i];
      if (item.children) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<li class="primary-nav__item js-nav js-expandable"><a class="primary-nav__link col col--md-8 col--lg-10"${attr("href", `${stringify(baseurl)}${stringify(item.url)}`)} aria-expanded="false"${attr("aria-label", `${stringify(item["label_" + lang])} sub menu`)}><span aria-hidden="true" class="expansion-indicator"></span> <span class="submenu-title">${escape_html(item[`label_${lang}`])}</span></a> <ul class="primary-nav__child-list col col--md-16 col--lg-20 js-expandable__content js-nav-hidden jsEnhance" aria-expanded="false" aria-label="submenu"><!--[-->`);
        const each_array_2 = ensure_array_like([...item.children].sort((a, b) => a[`label_${lang}`].localeCompare(b[`label_${lang}`])));
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let child = each_array_2[$$index_1];
          $$renderer2.push(`<li class="primary-nav__child-item js-expandable__child"><a class="primary-nav__child-link" tabindex="-1"${attr("href", `${stringify(baseurl)}${stringify(child.url)}`)}>${escape_html(child[`label_${lang}`])}</a></li>`);
        }
        $$renderer2.push(`<!--]--></ul></li>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<li class="primary-nav__item js-nav"><a class="primary-nav__link col col--md-8 col--lg-10"${attr("href", `${stringify(baseurl)}${stringify(item.url)}`)}>${escape_html(item["label_" + lang])}</a></li>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> <li class="hide--md primary-nav__language">`);
    if (lang == "en") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span>English (EN) |</span> <a${attr("href", `${stringify(baseother)}${stringify(path)}`)} class="language__link" lang="cy">Cymraeg (CY)</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<a${attr("href", `${stringify(baseother)}${stringify(path)}`)} class="language__link" lang="en">English (EN)</a> <span>| Cymraeg (EN)</span>`);
    }
    $$renderer2.push(`<!--]--></li></ul></nav></div> `);
    if (search) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="search nav-search--hidden print--hide" id="searchBar"><div class="ons-container" role="search"><form class="col-wrap search__form"${attr("action", `${stringify(baseurl)}/search`)}><label class="search__label col col--md-23 col--lg-24" for="nav-search">${escape_html(i18n("Search for a keyword(s) or time series ID"))}</label> <input type="search" autocomplete="off" class="search__input col col--md-21 col--lg-32" id="nav-search" name="q" value=""/> <button type="submit" class="search__button col--md-3 col--lg-3" id="nav-search-submit"${attr("aria-label", i18n("Search"))}><span class="icon-search--light"><svg class="ons-svg-icon ons-svg-icon--m" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor"><path d="M11.86 10.23 8.62 6.99a4.63 4.63 0 1 0-6.34 1.64 4.55 4.55 0 0 0 2.36.64 4.65 4.65 0 0 0 2.33-.65l3.24 3.23a.46.46 0 0
								0 .65 0l1-1a.48.48 0 0 0 0-.62Zm-5-3.32a3.28 3.28 0 0 1-2.31.93 3.22 3.22 0 1 1 2.35-.93Z"></path></svg></span></button></form></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { search, bilingual, lang, baseurl, baseother, path, i18n });
  });
}
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let i18n;
    getContext("page");
    let title = fallback($$props["title"], null);
    let titleHref = fallback($$props["titleHref"], null);
    let width = fallback($$props["width"], "wide");
    let theme = fallback($$props["theme"], null);
    let themeOverrides = fallback($$props["themeOverrides"], () => ({}), true);
    let compact = fallback($$props["compact"], false);
    let search = fallback($$props["search"], true);
    let bilingual = fallback($$props["bilingual"], true);
    let headerBorder = fallback($$props["headerBorder"], false);
    let menuBorder = fallback($$props["menuBorder"], false);
    let legacy = fallback($$props["legacy"], false);
    let skipHref = fallback($$props["skipHref"], "#main");
    let lang = "en";
    let baseurl = "https://www.ons.gov.uk";
    let baseother = "https://cy.ons.gov.uk";
    let path = "";
    i18n = (text) => text;
    $$renderer2.push(`<header${attr_class("ons-header svelte-uc3n62", void 0, {
      "ons-header--basic": !compact && !legacy,
      "ons-header__full": width === "full"
    })} role="banner">`);
    if (skipHref) {
      $$renderer2.push("<!--[0-->");
      SkipLink($$renderer2, { href: skipHref });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    slot($$renderer2, $$props, "before", {}, null);
    $$renderer2.push(`<!--]--> `);
    Theme($$renderer2, {
      theme,
      overrides: themeOverrides,
      cls: ["dark", "blue", "navyblue"].includes(theme) ? "dark-mode" : null,
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="ons-browser-banner">`);
        Container($$renderer3, {
          width,
          children: ($$renderer4) => {
            $$renderer4.push(`<p class="ons-browser-banner__content"><span class="ons-browser-banner__lead">This website no longer supports your browser.</span><span class="ons-browser-banner__cta">You can <a class="ons-browser-banner__link" href="https://www.ons.gov.uk/help/browsers">upgrade your browser to the latest version</a>.</span></p>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div> `);
        if (compact) {
          $$renderer3.push("<!--[0-->");
          HeaderNavCompact($$renderer3, { width, headerBorder, baseurl, i18n });
        } else if (!legacy) {
          $$renderer3.push("<!--[1-->");
          HeaderNav($$renderer3, {
            width,
            headerBorder,
            menuBorder,
            search,
            bilingual,
            lang,
            baseurl,
            baseother,
            path,
            i18n
          });
        } else {
          $$renderer3.push("<!--[-1-->");
          HeaderNavLegacy($$renderer3, { search, bilingual, lang, baseurl, baseother, path, i18n });
        }
        $$renderer3.push(`<!--]--> `);
        if (title) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="ons-header__main">`);
          Container($$renderer3, {
            width,
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="ons-grid ons-grid-flex ons-grid-flex--between ons-grid-flex--vertical-center ons-grid-flex--no-wrap ons-grid--gutterless"><div class="ons-grid__col ons-col-auto ons-u-flex-shrink">`);
              if (titleHref) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<a class="ons-header__title-link"${attr("href", titleHref)}><div class="ons-header__title">${escape_html(title)}</div></a>`);
              } else {
                $$renderer4.push("<!--[-1-->");
                $$renderer4.push(`<div class="ons-header__title">${escape_html(title)}</div>`);
              }
              $$renderer4.push(`<!--]--></div></div>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></header>`);
    bind_props($$props, {
      title,
      titleHref,
      width,
      theme,
      themeOverrides,
      compact,
      search,
      bilingual,
      headerBorder,
      menuBorder,
      legacy,
      skipHref
    });
  });
}
function Em($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let text;
    let color = fallback($$props["color"], "lightgrey");
    let mode = fallback($$props["mode"], "default");
    let fontSize = fallback($$props["fontSize"], null);
    let nowrap = fallback($$props["nowrap"], true);
    let ariaLabel = fallback($$props["ariaLabel"], null);
    text = contrastColor(color);
    $$renderer2.push(`<mark role="presentation"${attr("aria-label", ariaLabel)}${attr_class("svelte-wbmdp4", void 0, {
      "ons-svelte-mark": mode === "default",
      "ons-svelte-badge": mode === "badge",
      "ons-u-nowrap": nowrap
    })}${attr_style("", { background: color, color: text, "font-size": fontSize })}><!--[-->`);
    slot($$renderer2, $$props, "default", {}, null);
    $$renderer2.push(`<!--]--></mark>`);
    bind_props($$props, { color, mode, fontSize, nowrap, ariaLabel });
  });
}
export {
  Button as B,
  Container as C,
  Em as E,
  Footer as F,
  Header as H,
  Theme as T,
  formatter as f,
  html as h,
  isNumeric as i
};
