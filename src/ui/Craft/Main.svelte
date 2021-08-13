<script lang="ts">
  import Spell from "./Spell.svelte";
  import Effect from "./Effect.svelte";

  let CurrentView = Spell
</script>

<div class="">
  <button on:click={() => CurrentView = Spell }>Craft Spell</button>
  <button on:click={() => CurrentView = Effect }>Craft Effect</button>
  <svelte:component this={CurrentView}/>
</div>
