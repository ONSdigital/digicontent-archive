<script>
  import {
    Header,
    Section,
    Footer,
    AccessibleSelect,
    Table,
    Button,
  } from "@onsvisual/svelte-components";

  const data = $props();
  const jsons = data.data.jsons;

  const options = jsons.map((item) => ({
    id: item.slug[0],
    label: item.page_title[0],
  }));

  let selectedPageSlug = $state();

  const selectPage = (e) => {
    console.log(e.detail);
    selectedPageSlug = e.detail.id;
  };
  const tableData = jsons.map((item) => ({
    title: item.page_title[0],
    date: new Date(item.date_published[0]).toLocaleDateString(),
  }));

  let jsonsSorted = [...jsons].sort(
    (a, b) => new Date(b.date_published[0]) - new Date(a.date_published[0]),
  );
  $inspect(jsons);
</script>

<Header title="Digicontent archive directory" />

<Section marginTop={true}>
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

  {#each jsonsSorted as json}
    <div class="jsons-list">
      <p>
        <a href={json.slug}>{json.page_title}</a>
      </p>
      <span class='date'>
      {new Date(json.date_published[0]).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
      </span>
    </div>
  {/each}
  <!-- <Table data={tableData} compact sortable>
</Table> -->
</Section>

<Footer compact />

<style>
  .jsons-list {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
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
