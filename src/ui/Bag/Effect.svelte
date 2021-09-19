<script lang="ts">
  import { basicEffectsList } from "../../data/effects";
  import { effects } from "../../storage";

  import Item from "../components/Item.svelte";

  const getAllEffects = async () => {
    const createdEffects = await effects.toArray();
    return [...basicEffectsList, ...createdEffects];
  };

  const allEffectsPromise = getAllEffects();


</script>

<div class="">
  {#await allEffectsPromise}
    Loading effects...
  {:then allEffects}
    {#each allEffects as effect}
      <Item
        icon={effect.icon}
        name={effect.name}
      />
    {/each}
  {/await}
</div>
