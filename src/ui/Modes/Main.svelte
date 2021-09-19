<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import Campaign from "./Campaign.svelte";
  import BodyTrial from "./BodyTrial.svelte";
  import ElementalTrial from "./ElementalTrial.svelte";
  import MindTrial from "./MindTrial.svelte";

  import Deeplinks, { path } from "../Modes/Deeplink";
  import type { MatchThing } from "../Modes/Deeplink";

  let CurrentView;

  type MatchView = MatchThing<typeof Deeplinks.Modes, typeof SvelteComponent>;

  const views: MatchView = {
    Campaign,
    BodyTrial,
    ElementalTrial,
    MindTrial,
  };

  path.subscribe(({ stepName, args }) => {
    CurrentView = views[stepName];
  });

  CurrentView = Campaign;
</script>

<div class="">
  <button on:click={() => (CurrentView = Campaign)}>Campaign</button>
  <button on:click={() => (CurrentView = BodyTrial)}>Body Trial</button>
  <button on:click={() => (CurrentView = ElementalTrial)}
    >Elemental Trial</button
  >
  <button on:click={() => (CurrentView = MindTrial)}>Mind Trial</button>
  <svelte:component this={CurrentView} />
</div>
