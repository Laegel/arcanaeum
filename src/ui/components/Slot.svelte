<script lang="ts">
  export let item: { name: string, icon: string } = null;

</script>

<div
  class="slot border-2 inline-block align-middle w-14 h-14 rounded-sm cursor-pointer"
  on:click
  title={item?.name}
>
  {#if item}
    <div class="icon bg-contain w-full h-full" style={`background-image: url(/assets/${item.icon});`}></div>
  {:else}
    +
  {/if}
</div>

<style>
</style>