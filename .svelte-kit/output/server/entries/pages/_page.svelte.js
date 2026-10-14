import { Z as fallback, J as attr_class, ad as stringify, G as attr, Y as escape_html, X as ensure_array_like, N as bind_props, K as attr_style } from "../../chunks/renderer.js";
import { H as Header, C as Container, F as Footer, B as Button, E as Em } from "../../chunks/Em.js";
function Dropdown($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let id = fallback($$props["id"], null);
    let name = fallback($$props["name"], id);
    let label = fallback($$props["label"], null);
    let hideLabel = fallback($$props["hideLabel"], false);
    let placeholder = fallback($$props["placeholder"], "Select an option");
    let value = fallback($$props["value"], null);
    let options = fallback($$props["options"], () => [], true);
    let width = fallback($$props["width"], 20);
    let cls = fallback($$props["cls"], null);
    $$renderer2.push(`<div${attr_class(`ons-field ${stringify(cls)}`, "svelte-1x6cz9m")}>`);
    if (label) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<label${attr_class("ons-label", void 0, { "ons-u-vh": hideLabel })}${attr("for", id)}>${escape_html(label)}</label>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    $$renderer2.select(
      {
        id,
        name,
        class: `ons-input ons-input--select ${stringify(Number.isInteger(width) ? `ons-input--w-${width}` : "")}`,
        value,
        style: ""
      },
      ($$renderer3) => {
        if (placeholder) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.option({ value: null, selected: true, disabled: true }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(placeholder)}`);
          });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--><!--[-->`);
        const each_array = ensure_array_like(options);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let option = each_array[$$index];
          $$renderer3.option({ value: option }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(option?.label || option)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-1x6cz9m",
      void 0,
      { width: typeof width === "string" ? width : null }
    );
    $$renderer2.push(`</div>`);
    bind_props($$props, {
      id,
      name,
      label,
      hideLabel,
      placeholder,
      value,
      options,
      width,
      cls
    });
  });
}
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let id = fallback($$props["id"], null);
    let name = fallback($$props["name"], id);
    let value = fallback($$props["value"], null);
    let label = fallback($$props["label"], null);
    let hideLabel = fallback($$props["hideLabel"], false);
    let description = fallback($$props["description"], null);
    let charLimit = fallback($$props["charLimit"], null);
    let width = fallback($$props["width"], 20);
    let prefix = fallback($$props["prefix"], null);
    let suffix = fallback($$props["suffix"], null);
    let unitLabel = fallback($$props["unitLabel"], prefix || suffix || "");
    let pattern = fallback($$props["pattern"], null);
    let numeric = fallback($$props["numeric"], false);
    let disabled = fallback($$props["disabled"], false);
    let error = fallback($$props["error"], false);
    let cls = fallback($$props["cls"], null);
    $$renderer2.push(`<div${attr_class(`ons-field ${stringify(cls)}`, "svelte-108dvlu")}>`);
    if (label) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<label${attr_class("ons-label", void 0, {
        "ons-label--with-description": description,
        "ons-u-vh": hideLabel
      })}${attr("aria-describedby", description ? `${id}-description-hint` : null)}${attr("for", id)}>${escape_html(label)}</label>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span${attr("id", `${stringify(id)}-description-hint`)} class="ons-label__description ons-input--with-description">${escape_html(description)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (prefix || suffix) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span${attr_class("ons-input-type", void 0, { "ons-input-type--prefix": prefix })}><span class="ons-input-type__inner"><input type="text"${attr("id", id)}${attr("name", name)}${attr("value", value)}${attr("maxlength", charLimit)}${attr("pattern", pattern ? pattern : numeric ? "[0-9]*" : null)}${attr("inputmode", numeric ? "numeric" : null)}${attr_class(`ons-input ons-input--text ons-input-type__input ${stringify(Number.isInteger(width) ? `ons-input--w-${width}` : "")}`, "svelte-108dvlu", { "ons-input--error": error })}${attr("aria-labelledby", `${stringify(id)} ${stringify(id)}-unit`)}${attr("aria-describedby", description ? `${id}-description-hint` : null)}${attr("disabled", disabled, true)}${attr_style("", { width: typeof width === "string" ? width : null })}/> <abbr${attr("id", `${stringify(id)}-unit`)} class="ons-input-type__type ons-js-input-abbr"${attr("aria-label", unitLabel)} role="figure"${attr("title", unitLabel)}>${escape_html(prefix || suffix)}</abbr></span></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<input type="text"${attr("id", id)}${attr("name", name)}${attr("value", value)}${attr("pattern", pattern ? pattern : numeric ? "[0-9]*" : null)}${attr("inputmode", numeric ? "numeric" : null)}${attr_class(`ons-input ons-input--text ons-input-type__input ${stringify(Number.isInteger(width) ? `ons-input--w-${width}` : "")}`, "svelte-108dvlu", { "ons-input--error": error })}${attr("aria-describedby", description ? `${id}-description-hint` : null)}${attr("disabled", disabled, true)}${attr_style("", { width: typeof width === "string" ? width : null })}/>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      id,
      name,
      value,
      label,
      hideLabel,
      description,
      charLimit,
      width,
      prefix,
      suffix,
      unitLabel,
      pattern,
      numeric,
      disabled,
      error,
      cls
    });
  });
}
function Select($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let id = fallback($$props["id"], "autocomplete");
    let name = fallback($$props["name"], id);
    let mode = fallback($$props["mode"], "default");
    let clearable = fallback($$props["clearable"], mode !== "search");
    let autoClear = fallback($$props["autoClear"], mode === "search");
    let autoFocus = fallback($$props["autoFocus"], false);
    let label = fallback($$props["label"], mode === "search" ? "Type to select" : "Select an option");
    let hideLabel = fallback($$props["hideLabel"], false);
    let placeholder = fallback($$props["placeholder"], mode === "search" ? "Enter text" : "Select one");
    let value = fallback($$props["value"], null);
    let options = fallback($$props["options"], () => [], true);
    let labelKey = fallback($$props["labelKey"], "label");
    let groupKey = fallback($$props["groupKey"], null);
    let renderFallback = fallback($$props["renderFallback"], false);
    let minLength = fallback($$props["minLength"], mode === "search" ? 1 : 0);
    let loadOptions = fallback($$props["loadOptions"], (query, populateResults) => {
      if (mode !== "search" && (!query || options.map((opt) => opt?.[labelKey]).includes(query))) populateResults(options);
      else {
        const regex = new RegExp(`\\b${query.replace(/[^\w\s]/gi, "")}`, "i");
        const filteredResults = options.filter((opt) => regex.test(opt?.[labelKey]));
        populateResults(filteredResults);
      }
    });
    let clearInput = fallback($$props["clearInput"], () => {
      value = null;
    });
    let cls = fallback($$props["cls"], null);
    if (renderFallback && true) {
      $$renderer2.push("<!--[0-->");
      if (mode === "search") {
        $$renderer2.push("<!--[0-->");
        Input($$renderer2, {
          id,
          name,
          label,
          hideLabel,
          value: value?.[labelKey],
          width: null
        });
      } else {
        $$renderer2.push("<!--[-1-->");
        Dropdown($$renderer2, {
          id,
          name,
          options,
          label,
          hideLabel,
          placeholder,
          value,
          width: null
        });
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attr_class(`ons-field ${stringify(cls)}`, "svelte-1ncg768")}>`);
      if (label) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<label${attr("for", id)}${attr_class("ons-label", void 0, { "ons-u-vh": hideLabel })}>${escape_html(label)}</label>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="ons-autocomplete-wrapper svelte-1ncg768">`);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, {
      id,
      name,
      mode,
      clearable,
      autoClear,
      autoFocus,
      label,
      hideLabel,
      placeholder,
      value,
      options,
      labelKey,
      groupKey,
      renderFallback,
      minLength,
      loadOptions,
      clearInput,
      cls
    });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { $$slots, $$events, ...data } = $$props;
    const jsons = data.data.jsons;
    const options = jsons.map((item) => ({ id: item.slug, label: item.page_title }));
    let selectedPageSlug = void 0;
    let jsonsSorted = [...jsons].sort((a, b) => new Date(b.date_published[0]) - new Date(a.date_published[0]));
    const tax1Colours = {
      peoplepopulationandcommunity: "#8DAEC9",
      employmentandlabourmarket: "#D4DE9D",
      economy: "#C38DAD",
      businessindustryandtrade: "#FBB0B4"
    };
    const colourFor = (tax1) => tax1Colours[tax1];
    Header($$renderer2, { title: "Digicontent archive directory" });
    $$renderer2.push(`<!----> `);
    Container($$renderer2, {
      marginTop: true,
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="page-select svelte-1uha8ag"><div class="select-container svelte-1uha8ag">`);
        Select($$renderer3, { title: "Search for a page", options });
        $$renderer3.push(`<!----></div> `);
        Button($$renderer3, {
          href: selectedPageSlug,
          small: true,
          icon: "arrow",
          iconPosition: "after",
          disabled: selectedPageSlug == null,
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Select`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div> <div class="jsons-grid svelte-1uha8ag"><!--[-->`);
        const each_array = ensure_array_like(jsonsSorted);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let json = each_array[$$index];
          $$renderer3.push(`<div class="jsons-list svelte-1uha8ag"><p class="svelte-1uha8ag"><a${attr("href", json.slug)}>${escape_html(json.page_title)}</a></p> <span class="date svelte-1uha8ag">${escape_html(new Date(json.date_published[0]).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }))}</span> <p class="svelte-1uha8ag">`);
          Em($$renderer3, {
            text: json.tax2,
            mode: "badge",
            fontSize: "10px",
            color: colourFor(json.tax1),
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(json.tax2)}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></p></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Footer($$renderer2, { compact: true });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
