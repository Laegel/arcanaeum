<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { spells } from "../../storage";
  import Slot from "../components/Slot.svelte";
  import launch from "../../scenes/babylon";
  import emitter, { Event } from "../../uiToScene";
  import { basicSpellsList } from "../../types/spells";
  import { Ally, Entity, Enemy, Player } from "../../data/entity";
  import EntityDetails from "./components/EntityDetails.svelte";
  import Turns from "./components/Turns.svelte";

  const getAllSpells = async () => {
    const createdSpells = await spells.toArray();
    return [...basicSpellsList, ...createdSpells];
  };

  const spellsPromise = getAllSpells();
  let canvasTarget;

  const handleClickSpell = (spell) => {
    emitter.emit(Event.BattleSpellClick, spell);
  };

  const handleTurns = () => {
    const virtualTurns = [...turns];
    const entityRemoved = virtualTurns.shift();
    virtualTurns.push(entityRemoved);
    turns = [...virtualTurns];
    emitter.emit(Event.BattleStartTurn, turns[0]);
  };

  const player = new Player("Player", 100, 100, { x: 0, y: 0 });
  const ally = new Ally("Ally", 100, 100, { x: 2, y: 2 });
  const enemy = new Enemy("Enemy", 100, 100, { x: -4, y: -1 });

  const entities = [
    player, ally, enemy
  ];

  let turns = [player, enemy, ally];

  onMount(async () => {
    await launch(canvasTarget, entities);
    emitter.emit(Event.BattleStartTurn, turns[0]);
  });

  onDestroy(() => {
    emitter.clear(Event.BattleSpellClick);
  });

  let hoveredEntity: Entity;
  emitter.on(Event.BattleEntityMouseIn, (entity: Entity) => {
    hoveredEntity = entity;
  });

  emitter.on(Event.BattleEntityMouseOut, () => {
    hoveredEntity = undefined;
  });

  emitter.on(Event.BattleEntityTarget, (entity: Entity) => {
    player.castOn(100, entity);
    emitter.emit(Event.BattleSpellClick, undefined);
    handleTurns();
  });
</script>

<div>
  <canvas bind:this={canvasTarget} />

  <Turns turns={turns}/>

  {#if hoveredEntity}
    <EntityDetails entity={hoveredEntity}/>
  {/if}

  <div class="">
    <!-- fixed bottom-0 z-10 -->
    {#await spellsPromise}
      ...
    {:then spells}
      {#each spells as spell}
        <Slot item={spell} on:click={() => handleClickSpell(spell)} />
      {/each}
    {/await}
  </div>

</div>

<style>
  canvas {
    width: 633px;
    height: 822px;
    aspect-ratio: auto 633 / 822;
  }
</style>