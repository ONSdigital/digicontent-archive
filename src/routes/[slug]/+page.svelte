<script>
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
    Container,
  } from "@onsvisual/svelte-components";

  let { data } = $props();
  let article = $derived(data.page);
  $inspect(article);

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

  function isInteractive(block) {
    return block.type === "interactive" && block.url != null;
  }

  function groupSuperblocks(blocks) {
    const superblocks = [];
    let current = null;

    for (const block of blocks) {
      const interactive = isInteractive(block);

      if (interactive) {
        // Interactives always get their own superblock
        if (current) superblocks.push(current);
        superblocks.push({ interactive: true, blocks: [block] });
        current = null;
      } else {
        if (!current) current = { interactive: false, blocks: [] };
        current.blocks.push(block);
      }
    }
    if (current) superblocks.push(current);
    return superblocks;
  }
  const has = (v) => v != null && v !== "";

function resolve(entry) {
  return {
    ...entry,
    text: has(entry.text_new) ? entry.text_new : entry.text,
    url: has(entry.url_new) ? entry.url_new : entry.url,
    src: has(entry.src_new) ? entry.src_new : entry.src,
    box_text: has(entry.box_text_new) ? entry.box_text_new : entry.box_text,
    box_items: entry.box_items_new?.length ? entry.box_items_new : entry.box_items,
  };
}

  const blocks = $derived(
    groupBody(article.body.map(resolve)).filter((b) => b.h2 !== "Table of contents")
  );
  const superblocks = $derived(groupSuperblocks(blocks));

function renderInline(text) {
  if (!text) return "";
  return text.replace(
    /\[((?:[^\[\]]|\[[^\]]*\])+)\]\(([^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  );
}
  function renderBoxText(text) {
    if (!text) return [];
    return text.split(/\n\n+/).map((para) => renderInline(para).replace(/\n/g, "<br>"));
  }

  let lede = $derived(
    article.lede ? (Object.keys(article.lede).length > 0 ? article.lede : null) : null,
  );
  $inspect(blocks);
</script>

{#snippet renderBlock(block, i)}
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
    {:else if block.type === "interactive" && block.url != null}
      <div class="interactive">
        <EmbedFrame
          id="interactive-{i}"
          url={"https://onsdigital.github.io/" + block.url}
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
          src={"https://onsdigital.github.io/visualisations" + block.src}
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
        <img
          src={"https://onsdigital.github.io/visualisations" + block.src}
          alt={block.alt || ""}
        />
      </figure>
    {/if}
{/snippet}

<PhaseBanner
  phase="Archived content"
  description="This is archived content originally published at {article.url}"
  href=""
></PhaseBanner>
<Header theme="grey" />
<Breadcrumb
  links={[{ label: "Back to digicontent archive directory", href: "/" }]}
  background="var(--ons-color-banner-bg)"
></Breadcrumb>

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

  {#each superblocks as superblock, s}
    <Container width={superblock.interactive ? "wide" : "narrow"}>
      <div class="body">
        {#each superblock.blocks as block, i}
          {@render renderBlock(block, `${s}-${i}`)}
        {/each}
      </div>
    </Container>
  {/each}

  <!-- <Container width="narrow">
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
          {:else if block.type === "interactive" && block.url != null}
            <div class="interactive">
              {#if block.title}<p class="caption">{block.title}</p>{/if}
              <EmbedFrame
                id="interactive-{i}"
                url={"https://onsdigital.github.io/" + block.url_new}
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
                src={"https://onsdigital.github.io/visualisations" + block.src_new}
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
              <img
                src={"https://onsdigital.github.io/visualisations" + block.src_new}
                alt={block.alt || ""}
              />
            </figure>
          {/if}
        {/if}
      {/each}
    </div>
  </Container> -->
</Main>
<Footer compact />

<style>
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
