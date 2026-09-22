<script>
  import pym from "pym.js";
  import { onMount } from "svelte";

  let { id, url, name = null, title = null } = $props();

  onMount(() => {
    const pymParent = new pym.Parent(id, url, { id: `${id}-iframe`, name, title });
    return { destroy: () => pymParent.remove() };
  });
</script>

<div {id}></div>