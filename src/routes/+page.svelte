<script>
  import { base } from "$app/paths";
  import { Header, Section, Footer } from "@onsvisual/svelte-components";
  
  const data = $props()
  const jsons = data.data.jsons

  $inspect(jsons)

</script>

<Header title="Archived digicontent articles" />

<Section marginTop={true}>
  <p>
    Select a template below to preview. These templates are created using the <a
      href="https://github.com/ONSvisual/svelte-components/">ONS svelte-components library</a
    >. To use them in Svelte Kit projects, follow the
    <a href="https://github.com/ONSvisual/sveltekit-starter/">guidance in this readme</a>.
  </p>
</Section>

<Section>
{#each jsons as json}
  <p>
    <a href={json.slug}>{json.page_title}</a>
    {new Date(json.date_published).toLocaleDateString()}
  </p>

{/each}
</Section>

<Footer compact />
