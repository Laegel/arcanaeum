<script lang="ts">
  export let location;

  import { onMount, onDestroy } from "svelte";

  import { spells, effects, battles } from "../../storage";
  import { basicSpellsList } from "../../types/spells";
  import basicEffects from "../../data/effects";
  import Slot from "../components/Slot.svelte";
  import launch from "../../scenes/babylon";
  import emitter, { UiToSceneEvent } from "../../uiToScene";
  import {
    Ally,
    Entity,
    Enemy,
    Player,
    Event as EntityEvent,
  } from "../../data/entity";
  import EntityDetails from "./components/EntityDetails.svelte";
  import Turns from "./components/Turns.svelte";
  import { cast } from "../../data/spells";
  import Results from "./components/Results.svelte";
  import Logs from "./components/Logs.svelte";
  import { execute } from "../Modes/Deeplink";
  import battlesData from "../../data/battle.json";
  import { getData } from "../../data/player";
  import { Mode } from "../../types/battle";

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
  let canvasTarget;
  let showResults = false;

  let currentSpell;
  const handleClickSpell = (spell) => {
    currentSpell = spell;
    console.log(currentSpell);

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
    const entityRemoved = turns.shift();
    entityRemoved.addAP(4);
    if (entityRemoved instanceof Player) {
      player.actionPoints = entityRemoved.actionPoints;
    }
    turns.push(entityRemoved);
    turns = turns;
    console.log(turns, entityRemoved);
    turn = turns[0];
    
    emitter.emit(UiToSceneEvent.BattleStartTurn, turns[0]);
  };

  if (!location.state.deeplink) {
    location.state.deeplink = "Modes.Campaign.0";
  }
  const [_, mode, index] = location.state.deeplink.split(".");

  const enemies = battlesData[mode][index].enemies.map((enemy, index) =>
    Enemy.from({ ...enemy, name: `Enemy ${index}` }),
  );

  let player = Player.from(getData());
  const entities = [player, ...enemies];

  let turns = [player, ...enemies];
  $: turn = turns[0];

  onMount(async () => {
    await launch(canvasTarget, entities, battlesData[mode][index].map);
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
  emitter.on(UiToSceneEvent.BattleEntityTarget, async (entities: Entity[][]) => {
    console.log(entities);

    const details = cast(currentSpell, turns[0], entities);
    details.forEach((line) =>
      line.forEach(
        ({ caster, target, value }) =>
          (logs = [
            ...logs,
            `${caster.getName()} cast ${
              currentSpell.name
            } on ${target.getName()} for ${value} points.`,
          ]),
      ),
    );

    const effects = await effectsPromise
    emitter.emit(UiToSceneEvent.BattleSpellClick, undefined);
    
    turns[0].substractAP(effects[currentSpell.effects[0]].potency[0].cost);
    if (turns[0] instanceof Player) {
      player.actionPoints = turns[0].actionPoints;
    }
    turns[0].cooldowns[currentSpell.effects[0]] += effects[currentSpell.effects[0]].potency[0].cooldown;
  });

  entities.forEach((entity) => {
    entity.on(EntityEvent.Death, () => {
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
        battles.add({ mode: Mode[mode as string], index: parseFloat(index) });
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
    });

    entity.on(EntityEvent.RequestMovementPermission, ([entity, cellsAmount]: [Entity, number]) => {
      const costAP = Math.ceil(cellsAmount / 2);
      entity.emit(EntityEvent.ReplyMovementPermission, entity.hasEnoughAP(costAP));
    });

    entity.on(EntityEvent.Move, ([entity, cellsAmount]: [Entity, number]) => {
      const costAP = Math.ceil(cellsAmount / 2);
      if (entity.hasEnoughAP(costAP)) {
        entity.substractAP(costAP);
        turns[0] = entity;
        if (entity instanceof Player) {
          player.actionPoints = entity.actionPoints;
        }
      }
    });
  });
</script>

<div>
  <div class="relative">
    {#if showResults}
      <Results />
      <button
        on:click={() => {
          const parts = location.state.deeplink.split(".");
          parts.pop();
          execute(parts.join("."));
        }}>Continue</button
      >
    {:else}
      <canvas bind:this={canvasTarget} />

      <div class="absolute right-0 top-0">
        <Turns {turns} />

        <EntityDetails entity={turn} />
        <!-- fixed bottom-0 z-10 -->
        {#await Promise.all([spellsPromise, effectsPromise])}
          ...
        {:then [spells, effects]}
          {#each spells as spell}
            <Slot
              item={{ ...spell, icon: effects[spell.effects[0]].icon }}
              on:click={() => handleClickSpell(spell)}
              disabled={player.hasNotEnoughAP(effects[spell.effects[0]].potency[0].cost) || player.hasCooldown(spell.effects[0])}
            />
          {/each}
        {/await}
        <button on:click={handleTurns}>End turn</button>
        <Logs {logs} />
      </div>
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
