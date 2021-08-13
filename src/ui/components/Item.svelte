<script lang="ts">
  export let name = "";
  export let icon = "";

  let styles = {
		"icon": `url(/assets/${icon})`,
	};
	
	$: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
</script>

<div class="icon bg-contain slot border-2 inline-block align-middle w-14 h-14 rounded-sm cursor-pointer" style={cssVarStyles} on:click title={name}>
  
</div>

<style>
  .icon {
		background-image: var(--icon);
	}
</style>
