<script lang="ts">
  import { spells, effects } from "../../storage";

  import { basicSpellsList } from "../../types/spells";
  import basicEffects from "../../data/effects";
  import Slot from "../components/Slot.svelte";

  const getAllSpells = async () => {
    const createdSpells = await spells.toArray();
    return [...basicSpellsList, ...createdSpells];
  };

  const getAllEffects = async () => {
    const createdEffects = await effects.toArray();
    return {
      ...basicEffects,
      ...Object.fromEntries(
        createdEffects.map((effect) => [effect.name, effect, effect.icon]),
      ),
    };
  };

  const spellsPromise = getAllSpells();
  const effectsPromise = getAllEffects();
</script>

<div class="">
  {#await Promise.all([spellsPromise, effectsPromise])}
    ...
  {:then [spells, effects]}
    {#each spells as spell}
      <Slot item={{ ...spell, icon: effects[spell.effects[0]].icon }} />
    {/each}
  {/await}
</div>
