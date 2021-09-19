<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let item: { name: string; icon: string } = null;
  export let disabled = false;
</script>

<div
  class="slot border-2 inline-block align-middle w-14 h-14 rounded-sm cursor-pointer"
  class:filter={disabled}
  class:grayscale={disabled}
  on:click={(e) => {
    if (disabled) {
      return;
    }
    dispatch("click", e);
  }}
  title={item?.name}
>
  {#if item}
    <div
      class="icon bg-contain w-full h-full"
      style={`background-image: url(/assets/${item.icon});`}
    />
  {:else}
    +
  {/if}
</div>

<style>
</style>
