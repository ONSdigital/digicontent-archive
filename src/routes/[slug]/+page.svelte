<script>
  // import articleData from "$lib/data/scraped_jsons/understanding-ai-uptake-and-sentiment-among-people-and-businesses-in-the-uk-june-2023.json";
  import EmbedFrame from "$lib/components/EmbedFrame.svelte";
  import {
    Notice,
    PhaseBanner,
    Breadcrumb,
    Header,
    Hero,
    Section,
    Main,
    Blockquote,
    Footer,
    Table,
    Details,
  } from "@onsvisual/svelte-components";

  let {data} = $props()
  let article = $derived(data.page)
  $inspect(article)

  function groupBody(body) {
  const blocks = [];
  let currentList = null;

  function flushList() {
    if (currentList) blocks.push(currentList);
    currentList = null;
  }

  for (const entry of body) {
    if (entry.type === "p" && entry.text === "") continue;

    if (entry.type === "heading") {
      flushList();
      blocks.push({
        type: "heading",
        level: Number(entry.level.replace("h", "")),
        text: entry.text,
        h2: entry.h2,
        h3: entry.h3,
        h4: entry.h4,
        h5: entry.h5,
      });
      continue;
    }

    if (entry.type === "li") {
      if (!currentList || currentList.h2 !== entry.h2 || currentList.h3 !== entry.h3) {
        flushList();
        currentList = {
          type: "list",
          items: [],
          h2: entry.h2,
          h3: entry.h3,
          h4: entry.h4,
          h5: entry.h5,
        };
      }
      currentList.items.push(entry.text);
    } else {
      flushList();
      blocks.push({ ...entry });
    }
  }
  flushList();
  return blocks;
}

  const blocks = $derived(groupBody(article.body));

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

  let lede = $derived(Object.keys(article.lede).length > 0 ? article.lede : null);
</script>

<PhaseBanner
  phase="Archived content"
  description="This is archived content originally published at {article.url}"
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
      { key: "Published", value: new Date(article.date_published).toLocaleDateString() },
      ...(article.date_published !== article.date_modified
        ? [{ key: "Modified", value: new Date(article.date_modified).toLocaleDateString() }]
        : []),
    ]}
    {lede}
  ></Hero>

  <Section>
    <div class="body">
      {#each blocks as block, i}
        {#if block.h2 !== "Table of contents"}
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
        {:else if block.type === "correction"}
          <Details title={block.title}>
            <p>{block.date}</p>
            <p>{@html renderInline(block.text)}</p>
            {#if block.superseded_text}
              <p>{@html renderInline(block.superseded_text)}</p>
            {/if}
          </Details>
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
            <EmbedFrame
              id="interactive-{i}"
              url={block.url}
              title={block.title || "Interactive visualisation"}
            ></EmbedFrame>
          </div>
        {:else if block.type === "chartbuilder"}
          <figure class="chartbuilder">
            {#if block.chartbuilder_h3}<figcaption class="chart-title">
                {block.chartbuilder_h3}
              </figcaption>{/if}
            {#if block.chartbuilder_h4}<p class="chart-subtitle">{block.chartbuilder_h4}</p>{/if}
            <img
              src="/data/chartbuilder_imgs/{block.local_filename}"
              alt={block.chartbuilder_h3 || ""}
            />
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
