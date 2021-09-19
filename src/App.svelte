<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";

  import Modes from "./ui/Modes/Main.svelte";
  import Craft from "./ui/Craft/Main.svelte";
  import Bag from "./ui/Bag/Main.svelte";
  import Battle from "./ui/Battle/Battle.svelte";

  export let url = "";
</script>

<Router {url}>
  <nav>
    <Link to="/">Modes</Link>
    <Link to="bag">Bag</Link>
    <Link to="craft">Craft</Link>
    <Link to="battle">Battle</Link>
  </nav>
  <div>
    <Route path="battle" component={Battle} />
    <Route path="craft" component={Craft} />
    <Route path="bag" component={Bag} />
    <Route path="/" component={Modes} />
  </div>
</Router>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
