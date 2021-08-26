<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import { spells } from "../../storage";
  import { basicSpellsList } from "../../types/spells";
  import { effects } from "../../storage";
  import basicEffects from "../../data/effects";
  import Slot from "../components/Slot.svelte";
  import launch from "../../scenes/babylon";
  import emitter, { UiToSceneEvent } from "../../uiToScene";
  import { Ally, Entity, Enemy, Player, Event as EntityEvent } from "../../data/entity";
  import EntityDetails from "./components/EntityDetails.svelte";
  import Turns from "./components/Turns.svelte";
  import { applyEffect, cast, Element, elementalDividers, elementalMultipliers } from "../../data/spells";
  import type entity from "../../types/entity";
  import Results from "./components/Results.svelte";
  import Logs from "./components/Logs.svelte";

  const getAllSpells = async () => {
    const createdSpells = await spells.toArray();
    return [...basicSpellsList, ...createdSpells];
  };

  const getAllEffects = async () => {
    const createdEffects = await effects.toArray();
    return {...basicEffects, ...Object.fromEntries(createdEffects.map(effect => [effect.name, effect]))};
  };

  const spellsPromise = getAllSpells();
  const effectsPromise = getAllEffects();
  let canvasTarget;
  let showResults = false;

  let currentSpell;
  const handleClickSpell = (spell) => {
    currentSpell = spell;
    emitter.emit(UiToSceneEvent.BattleSpellClick, undefined);
    emitter.emit(UiToSceneEvent.BattleSpellClick, spell);

    window.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        emitter.emit(UiToSceneEvent.BattleSpellClick, undefined);
      }
    });
  };

  const handleTurns = () => {
    const virtualTurns = [...turns];
    const entityRemoved = virtualTurns.shift();
    virtualTurns.push(entityRemoved);
    turns = [...virtualTurns];
    emitter.emit(UiToSceneEvent.BattleStartTurn, turns[0]);
  };

  const player = new Player("Player", 100, 100, { x: 0, y: 0 }, 10, 5, 3, elementalMultipliers, {...elementalDividers, [Element[Element.Fire]]: -2});
  const ally = new Ally("Ally", 100, 100, { x: 2, y: 2 }, 10, 5, 3, elementalMultipliers, elementalDividers);
  const enemy = new Enemy("Enemy", 100, 100, { x: -4, y: -1 }, 1, 1, 1, elementalMultipliers, elementalDividers);

  const entities = [
    player, ally, enemy
  ];

  let turns = [player, enemy, ally];

  onMount(async () => {
    await launch(canvasTarget, entities);
    emitter.emit(UiToSceneEvent.BattleStartTurn, turns[0]);
  });

  onDestroy(() => {
    emitter.clear(UiToSceneEvent.BattleSpellClick);

    entities.forEach((entity) => {
      entity.clear();
    });
  });

  let hoveredEntity: Entity;
  emitter.on(UiToSceneEvent.BattleEntityMouseIn, (entity: Entity) => {
    hoveredEntity = entity;
  });

  emitter.on(UiToSceneEvent.BattleEntityMouseOut, () => {
    hoveredEntity = undefined;
  });

  let logs = [];
  emitter.on(UiToSceneEvent.BattleEntityTarget, (entities: Entity[][]) => {
    console.log(entities);
    
    const details = cast(currentSpell, turns[0], entities);
    details.forEach(line => line.forEach(({caster, target, value}) => logs = [...logs, `${caster.getName()} cast ${currentSpell.name} on ${target.getName()} for ${value} points.`]));
    emitter.emit(UiToSceneEvent.BattleSpellClick, undefined);
    handleTurns();
  });

  entities.forEach((entity) => {
    entity.on(
      EntityEvent.Death,
      () => {
        const enemiesRemain = !!entities.find(
          (entity) => entity instanceof Enemy && entity.getCurrentHealth() !== 0,
        );
        const alliesRemain = !!entities.find(
          (entity) =>  
            (entity instanceof Player && entity.getCurrentHealth() !== 0) ||
            (entity instanceof Ally && entity.getCurrentHealth() !== 0),
        );

        if (!enemiesRemain) {
          console.log("enemies defeated");
          showResults = true;
          entities.forEach((entity) => {
            entity.clear();
          });
        } else if (!alliesRemain) {
          console.log("allies defeated");
          showResults = true;
          entities.forEach((entity) => {
            entity.clear();
          });
        }
      },
    );

    entity.on(EntityEvent.RequestMovementPermission, (movementPoints) => {
      
    });

    entity.on(EntityEvent.Move, () => {

    });
  });
</script>

<div>
  <div class="relative">
    {#if showResults}
      <Results />
    {:else}
      <canvas bind:this={canvasTarget} />

      <Turns turns={turns}/>

      {#if hoveredEntity}
        <EntityDetails entity={hoveredEntity}/>
      {/if}

      <div class="">
        <!-- fixed bottom-0 z-10 -->
        {#await Promise.all([spellsPromise, effectsPromise])}
          ...
        {:then [spells, effects]}
          {#each spells as spell}
            <Slot item={{...spell, icon: effects[spell.effects[0]].icon}} on:click={() => handleClickSpell(spell)} />
          {/each}
        {/await}
      </div>
      <Logs logs={logs}/>
    {/if}
  </div>

</div>

<style>
  canvas {
    width: 633px;
    height: 822px;
    aspect-ratio: auto 633 / 822;
  }
</style>