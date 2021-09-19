<script lang="ts">
  import type { Entity } from "../../../data/entity";
  import Bar from "./Bar.svelte";


  export let turns: Entity[] = [];
</script>

<div>
  {#each turns as entity}
    <div class="inline-block w-28">
      {entity.getName()}
      <Bar effective={entity.getCurrentHealth()} total={entity.getMaxHealth()} color='red'/>
    </div>
  {/each}
</div>