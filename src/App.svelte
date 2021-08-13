<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";

  import Home from "./ui/Home.svelte";
  import Craft from "./ui/Craft/Main.svelte";
  import Battle from "./ui/Battle/Battle.svelte";

  export let url = "";
</script>

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="craft">Craft</Link>
    <Link to="battle">Battle</Link>
  </nav>
  <div>
    <Route path="craft" component={Craft} />
    <Route path="battle" component={Battle} />
    <Route path="/"><Home /></Route>
  </div>
</Router>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
