<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import Spell from "./Spell.svelte";
  import Effect from "./Effect.svelte";
  import Gear from "./Gear.svelte";

  let CurrentView;

  import Deeplinks, { path } from "../Modes/Deeplink";
  import type { MatchThing } from "../Modes/Deeplink";

  type MatchView = MatchThing<typeof Deeplinks.Craft, typeof SvelteComponent>;

  const views: MatchView = {
    Spell,
    Effect,
    Gear
  };

  path.subscribe(({ stepName }) => {
    CurrentView = views[stepName];
  });
  CurrentView = Spell;
</script>

<div class="">
  <button on:click={() => (CurrentView = Spell)}>Spells</button>
  <button on:click={() => (CurrentView = Effect)}>Effects</button>
  <button on:click={() => (CurrentView = Gear)}>Gear</button>
  <svelte:component this={CurrentView} />
</div>
