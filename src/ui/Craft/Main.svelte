<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import Spell from "./Spell.svelte";
  import Effect from "./Effect.svelte";

  let CurrentView;

  import Deeplinks, { path } from "../Modes/Deeplink";
  import type { MatchThing } from "../Modes/Deeplink";

  type MatchView = MatchThing<typeof Deeplinks.Craft, typeof SvelteComponent>;

  const views: MatchView = {
    Spell,
    Effect,
  };

  path.subscribe(({ stepName }) => {
    CurrentView = views[stepName];
  });
  CurrentView = Spell;
</script>

<div class="">
  <button on:click={() => (CurrentView = Spell)}>Craft Spell</button>
  <button on:click={() => (CurrentView = Effect)}>Craft Effect</button>
  <svelte:component this={CurrentView} />
</div>
