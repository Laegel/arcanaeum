<script lang="ts">
  import { Link } from "svelte-routing";
  import Deeplink from "./Deeplink";

  import battlesData from "../../data/battle.json";
  import { Mode } from "../../types/battle";
  import { getBattlesPromise } from "./utils";
</script>

<div>
  <div>
    {#await getBattlesPromise(Mode.Campaign)}
      ...
    {:then allBattles}
      {#each battlesData.Campaign as battle, index}
        <div>
          {#if allBattles.find((clearedBattle) => clearedBattle.index === index)}
            {index} (Done)
          {:else}
            <Link
              to="battle"
              state={{
                deeplink: Deeplink.Modes.Campaign.fullPath + `.${index}`,
              }}
            >
              {index}
            </Link>
          {/if}
        </div>
      {/each}
    {/await}
  </div>
</div>
