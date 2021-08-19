<script lang="ts">
  import { basicEffectsList } from "../../data/effects";
  import runes from "../../data/runes";
  import { effects, spells } from "../../storage";

  import Slot from "../components/Slot.svelte";
  import SlotResult from "../components/SlotResult.svelte";
  import Item from "../components/Item.svelte";
  import type { SpellPattern, SpellSlot } from "../../types/spells";
  import type { Effect } from "../../types/effects";

  const getAllEffects = async () => {
    const createdEffects = await effects.toArray();
    return [...basicEffectsList, ...createdEffects];
  };

  const allEffectsPromise = getAllEffects();

  let pickedEffect: Effect = undefined

  let spellName = "New Spell";

  let items: SpellPattern = null;

  $: result =
    items && Object.values(items).every((item) => !!item)
      ? Object.values(items)
          .map(({ name }) => name)
          .join(", ")
      : undefined;
  // items.some(item => !!item) ? {name: items.map(({name}) => name).join(", ")
  let toggleEffectList = false;

  const handleClickEffect = (data) => {
    toggleEffectList = !toggleEffectList;
    toggleRuneList = false;
  };

  let toggleRuneList = false;
  let editingSlot = undefined;

  const handlePickEffect = (data) => {
    pickedEffect = data;    
    toggleEffectList = false;

    items = {};
    for (let i = 0; i < pickedEffect.effects.length; ++i) {
      items[i] = undefined;
    }
  };

  const handlePickRune = (data) => {
    items[editingSlot] = data;
    console.log(editingSlot, items);
    toggleRuneList = false;
  };

  const handleClickRune = (index) => {
    editingSlot = index;
    toggleRuneList = !toggleRuneList;
  };

  const handleClickItem = () => {
    spells.add({ name: spellName, effects: pickedEffect.effects.length ? pickedEffect.effects : [pickedEffect.name], scope: 5, targetEntityOnly: true, icon: pickedEffect.icon });
  };

  const getEffectByName = (effects, name) => effects.find(effect => effect.name === name);
</script>

<div class="">
  {#await allEffectsPromise}
    Loading effects...
  {:then allEffects}
    <Slot on:click={handleClickEffect} item={pickedEffect} />

    {#if pickedEffect}
      ⤅
      {#each pickedEffect.effects as item, index}
        <Slot on:click={() => handleClickRune(index)} item={items[index]} />
      {:else}
        <Slot on:click={() => handleClickRune(0)} item={items[0]} />
      {/each}
    {/if}
    =
    <SlotResult on:click={handleClickItem} item={result ? { name: result, icon: pickedEffect.icon } : undefined } /><input
      type="text"
      bind:value={spellName}
    />

    <div>
      {#if toggleEffectList}
        
          {#each allEffects as effect}
            <Item icon={effect.icon} name={effect.name} on:click={() => handlePickEffect(effect)} />
          {/each}
        
      {/if}
      {#if toggleRuneList}
        {#each Object.entries(runes) as [name, data]}
          <Item {name} icon={data.icon} on:click={() => handlePickRune({ name, ...data })} />
        {/each}
      {/if}
    </div>
  {/await}
</div>
