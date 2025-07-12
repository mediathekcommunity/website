<script lang="ts">
  import { signIn } from "@auth/sveltekit/client"
</script>
 
<div>
  <nav>
    <img src="/img/logo.svg" alt="Company Logo" />
    <button on:click={signIn}>Signin</button>
  </nav>
</div>