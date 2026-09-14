<script>
  import { onMount } from 'svelte';

  export let block; // interactive body entry, expects block.local_url and block.title

  let containerId = `pym-${Math.random().toString(36).slice(2)}`;
  let pymInstance;

  onMount(() => {
    async function loadPym() {
      if (!window.pym) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/lib/pym.v1.min.js'; // locally hosted copy
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      pymInstance = new window.pym.Parent(containerId, block.local_url, {});
    }
    loadPym();

    return () => {
      pymInstance?.remove?.();
    };
  });
</script>

{#if block.title}
  <p class="caption">{block.title}</p>
{/if}
<div id={containerId}></div>