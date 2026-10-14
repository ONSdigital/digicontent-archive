<script>
  import {
    Header,
    Section,
    Footer,
    AccessibleSelect,
    Table,
    Em,
    Button,
    Container,
  } from "@onsvisual/svelte-components";

  const data = $props();
  const jsons = data.data.jsons;

  const options = jsons.map((item) => ({
    id: item.slug,
    label: item.page_title,
  }));

  let selectedPageSlug = $state();

  const selectPage = (e) => {
    console.log(e.detail);
    selectedPageSlug = e.detail.id;
  };
  // const tableData = jsons.map((item) => ({
  //   title: item.page_title[0],
  //   date: new Date(item.date_published[0]).toLocaleDateString(),
  // }));

  let jsonsSorted = [...jsons].sort(
    (a, b) => new Date(b.date_published[0]) - new Date(a.date_published[0]),
  );

  const tax1Colours = {
    peoplepopulationandcommunity: "#8DAEC9",
    employmentandlabourmarket: "#D4DE9D",
    economy: "#C38DAD",
    businessindustryandtrade: "#FBB0B4",
  };
  const colourFor = (tax1) => tax1Colours[tax1];
</script>

<Header title="Digicontent archive directory" />

<Container marginTop={true}>
  <div class="page-select">
    <div class="select-container">
      <AccessibleSelect title="Search for a page" {options} on:change={selectPage}
      ></AccessibleSelect>
    </div>
    <Button
      href={selectedPageSlug}
      small
      icon="arrow"
      iconPosition="after"
      disabled={selectedPageSlug == null}>Select</Button
    >
  </div>

  <div class="jsons-grid">
    {#each jsonsSorted as json}
      <div class="jsons-list">
        <p>
          <a href={json.slug}>{json.page_title}</a>
          <!-- <Em
      text={json.tax2} mode="badge" fontSize="10px" color={colourFor(json.tax1)}>{json.tax2}</Em> -->
        </p>
        <span class="date">
          {new Date(json.date_published[0]).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <p>
          <Em text={json.tax2} mode="badge" fontSize="10px" color={colourFor(json.tax1)}
            >{json.tax2}</Em
          >
        </p>
      </div>
    {/each}
  </div>
  <!-- <Table data={tableData} compact sortable>
</Table> -->
</Container>

<Footer compact />

<style>
  /* .jsons-list {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
} */

  .jsons-grid {
    display: grid;
    grid-template-columns: 1fr max-content max-content;
    gap: 0.5rem 1rem;
  }
  .jsons-list {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }

  .jsons-list p {
    flex: 1 1 auto;
    min-width: 0;
  }

  .jsons-list .date {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  .page-select {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .select-container {
    flex-grow: 1;
    margin-bottom: 40px;
  }
</style>
