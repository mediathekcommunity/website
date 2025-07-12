<script lang="ts">
  import { signIn } from "@auth/sveltekit/client"
</script>
 
<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh;">
  <nav style="text-align: center;">
    <img src="/img/logo.svg" alt="Company Logo" />
    <button on:click={() => signIn()}>Signin</button>
  </nav>
</div>