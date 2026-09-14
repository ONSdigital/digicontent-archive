<script>
  import articleData from "$lib/data/a-million-fewer-people-are-gaining-health-benefits-from-nature-since-2020.json";
  import {
    Notice,
    PhaseBanner,
    Breadcrumb,
    Header,
    Hero,
    Highlight,
    Section,
    Container,
    Divider,
    Main,
    Blockquote,
    Em,
    Footer,
    Table,
  } from "@onsvisual/svelte-components";

  const article = articleData;

  function groupBody(body) {
    const blocks = [];
    let currentList = null;
    let lastH2 = null,
      lastH3 = null,
      lastH4 = null,
    lastH5 = null;

    function flushList() {
      if (currentList) blocks.push(currentList);
      currentList = null;
    }

    for (const entry of body) {
      if (entry.type === "p" && entry.text === "") continue;
      const h2Changed = entry.h2 !== lastH2;
      const h3Changed = entry.h3 !== lastH3;
      const h4Changed = entry.h4 !== lastH4;
      const h5Changed = entry.h5 !== lastH5;

      if (h2Changed || h3Changed || h4Changed || h5Changed) {
        flushList();

        if (h2Changed && entry.h2) blocks.push({ type: "heading", level: 2, text: entry.h2 });
        if ((h2Changed || h3Changed) && entry.h3)
          blocks.push({ type: "heading", level: 3, text: entry.h3 });
        if ((h2Changed || h3Changed || h4Changed) && entry.h4)
          blocks.push({ type: "heading", level: 4, text: entry.h4 });
        if ((h2Changed || h3Changed || h4Changed || h5Changed) && entry.h5)
          blocks.push({ type: "heading", level: 5, text: entry.h5 });

        lastH2 = entry.h2;
        lastH3 = entry.h3;
        lastH4 = entry.h4;
        lastH5 = entry.h5;
      }

      if (entry.type === "li") {
        if (!currentList) currentList = { type: "list", items: [] };
        currentList.items.push(entry.text);
      } else {
        flushList();
        blocks.push(entry);
      }
    }
    flushList();
    return blocks;
  }

  const blocks = groupBody(article.body);

  function renderInline(text) {
    if (!text) return "";
    return text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );
  }
  function renderBoxText(text) {
    if (!text) return [];
    return text.split(/\n\n+/).map((para) => renderInline(para).replace(/\n/g, "<br>"));
  }
</script>

<PhaseBanner
  phase="Archived content"
  description="This is archived content originally published on https://www.ons.gov.uk"
  href=""
></PhaseBanner>
<Header theme="grey" />
<Breadcrumb
  links={article.breadcrumb.map((crumb) => ({
    label: crumb.text,
    href: crumb.href ?? undefined,
  }))}
  background="var(--ons-color-banner-bg)"
  `
/>
<Main>
  <Hero
    title={article.title}
    theme="grey"
    meta={[
      { key: "Published", value: article.date_published },
      { key: "Modified", value: article.date_modified },
      // add in if statement so modified only rendered when modified
      // add in parseDate function
    ]}
    lede={article.lede}
  ></Hero>

  <Section>
    <div class="body">
      {#each blocks as block}
        {#if block.type === "heading"}
          {#if block.level === 2}
            <h2>{block.text}</h2>
          {:else if block.level === 3}
            <h3>{block.text}</h3>
          {:else if block.level === 4}
            <h4>{block.text}</h4>
          {:else}
            <h5>{block.text}</h5>
          {/if}
        {:else if block.type === "p"}
          <p>{@html renderInline(block.text)}</p>
        {:else if block.type === "list"}
          <ul>
            {#each block.items as item}
              <li>{@html renderInline(item)}</li>
            {/each}
          </ul>
        {:else if block.type === "quote"}
          <Blockquote attribution={block.source}>
            {block.text}</Blockquote
          >
        {:else if block.type === "box"}
          <Notice>
            {#if block.box_h2}<h2>{block.box_h2}</h2>{/if}
            {#if block.box_h3}<h3>{block.box_h3}</h3>{/if}
            {#if block.box_text}
              {#each renderBoxText(block.box_text) as para}
                <p>{@html para}</p>
              {/each}
            {/if}
            {#if block.box_items && block.box_items.length > 0}
              <ul>
                {#each block.box_items as item}
                  <li>{@html renderInline(item)}</li>
                {/each}
              </ul>
            {/if}
          </Notice>
        {:else if block.type === "interactive"}
          <div class="interactive">
            {#if block.title}<p class="caption">{block.title}</p>{/if}
            <iframe
              src={block.url}
              title={block.title || "Interactive visualisation"}
              width="100%"
              height="500"
              loading="lazy"
            ></iframe>
          </div>
        {:else if block.type === "chartbuilder"}
          <figure class="chartbuilder">
            {#if block.chartbuilder_h3}<figcaption class="chart-title">
                {block.chartbuilder_h3}
              </figcaption>{/if}
            {#if block.chartbuilder_h4}<p class="chart-subtitle">{block.chartbuilder_h4}</p>{/if}
            <img src={block.img_src} alt={block.chartbuilder_h3 || ""} />
          </figure>
        {:else if block.type === "table"}
          <figure class="table">
            {#if block.caption}<h4 class="table-caption">{block.caption}</h4>{/if}

            <Table data={block.data} columns={block.columns} />

            {#if block.source_note}
              <p class="table-source">{block.source_note}</p>
            {/if}

            {#if block.footnotes && block.footnotes.length > 0}
              <ol class="table-footnotes">
                {#each block.footnotes as note}
                  <li>{@html renderInline(note)}</li>
                {/each}
              </ol>
            {/if}
          </figure>
        {:else if block.type === "image"}
          <figure class="body-image">
            <img src={block.src} alt={block.alt || ""} />
          </figure>
        {/if}
      {/each}
    </div>
  </Section>
</Main>
<Footer compact />

<style>
  .interactive iframe {
    border: none;
  }
  .chartbuilder img {
    max-width: 100%;
  }
  .chart-title {
    font-weight: 600;
  }
  .chart-subtitle {
    font-size: 0.9rem;
    color: #555;
  }
</style>
