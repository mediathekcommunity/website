<script>
  import { page } from '$app/stores';
</script>

<nav>
  <a href="/">Home</a>
  <a href="/movies">Movies</a>
  <a href="/series">Series</a>
  <a href="/youth">Youth</a>
</nav>

<style>
  nav {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: #f0f0f0;
  }
  a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }
  a:hover {
    color: #007bff;
  }
</style>