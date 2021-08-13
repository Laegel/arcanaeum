<script lang="ts">
  export let effective;
  export let total;
  export let color;
</script>

<div>
  <div class="h-1" style={`width:${effective / total * 100}%;background-color:${color}`}></div>
</div>