<script>
    import Header from '$lib/components/header.svelte';
    import Footer from '$lib/components/footer.svelte';
    import '../app.css';
</script>

<div class="app">
    <Header />
    <main>
        <slot />
    </main>
    <Footer />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        background-color: #141414;
        color: #fff;
        font-family: Arial, sans-serif;
    }

    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 0;
        box-sizing: border-box;
    }

    @media (max-width: 768px) {
        main {
            padding: 0;
        }
    }
</style>