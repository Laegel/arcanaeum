
<script lang="ts">
  import type { Entity } from "../../../data/entity";

  export let entity: Entity = undefined;
</script>

<div class="slot border-2 inline-block w-14 h-14 rounded-sm cursor-pointer">
  { entity.getName() }
  { entity.getCurrentHealth() }/{ entity.getMaxHealth() }
  { entity.getCurrentMagicka() }/{ entity.getMaxMagicka() }
</div>
