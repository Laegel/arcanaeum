<script lang="ts" context="module">
  export enum Kind {
    Plus = "+",
    Equals = "="
  }
</script>

<script lang="ts">
  export let operator: Kind;
</script>

<div class="operator inline-block text-lg">
  {operator}
</div>
