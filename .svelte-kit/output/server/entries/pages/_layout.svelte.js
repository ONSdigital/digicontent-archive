import { ac as slot } from "../../chunks/renderer.js";
function _layout($$renderer, $$props) {
  $$renderer.push(`<!--[-->`);
  slot($$renderer, $$props, "default", {}, null);
  $$renderer.push(`<!--]-->`);
}
export {
  _layout as default
};
