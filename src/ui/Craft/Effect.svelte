<script lang="ts">
  import basicEffects from "../../data/effects";

  import Slot from "../components/Slot.svelte";
  import SlotResult from "../components/SlotResult.svelte";
  import Item from "../components/Item.svelte";
  import { effects } from "../../storage";
import Operator, { Kind } from "../components/Operator.svelte";

  
  let effectName = "New Effect";
  
  const effectSlots = {
    0: undefined,
    1: undefined,
  };

  $: isReadyToCraft = effectSlots[0] && effectSlots[1];

  $: result =
    effectSlots && Object.values(effectSlots).every((item) => !!item)
      ? Object.values(effectSlots)
          .map(({ name }) => name)
          .join(", ")
      : undefined;

  const handleClickEffect = (index) => {
    editingSlot = index;
    toggleEffectList = !toggleEffectList;
  };

  let editingSlot = undefined;

  let toggleEffectList = false;

  const handlePickEffect = (data) => {
    effectSlots[editingSlot] = data;

    toggleEffectList = false;
  };

  const handleClickItem = () => {
    effects.add({ name: effectName, effects: [effectSlots[0].name, effectSlots[1].name], icon: effectSlots[0].icon });
  };
</script>

<div class="">
  <div class="slots">
    <Slot on:click={() => handleClickEffect(0)} item={effectSlots[0]} />
    <Operator operator={Kind.Plus}/>
    <Slot on:click={() => handleClickEffect(1)} item={effectSlots[1]} />
    <Operator operator={Kind.Equals}/>
    <SlotResult on:click={handleClickItem} item={{ name: effectName, icon: isReadyToCraft ? effectSlots[0].icon : "" }} /><input
      type="text"
      bind:value={effectName}
    />
  </div>

  <div>
    {#if toggleEffectList}
      {#each Object.entries(basicEffects) as [name, data]}
        <Item {name} icon={data.icon} on:click={() => handlePickEffect({ name, ...data })} />
      {/each}
    {/if}
  </div>
</div>
