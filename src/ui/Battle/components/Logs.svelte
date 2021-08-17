<script lang="ts">
  export let logs
</script>
<div>
  {#each logs as line}
    <div>{line}</div>
  {/each}
</div>