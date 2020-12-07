<script>
	import Book from "./Book.svelte";
	import { onMount } from "svelte";

	let books = [];
	onMount(() => fetch('/books').then(res => res.json().then(res => {books = [...books, ...res]})));
</script>
<div>
	<div class="shelf-container">
		{#each books as book}
			<Book {...book}/>
		{/each}
	</div>
</div>
<footer>
	<div>Made with&nbsp</div>
	<a href="https://svelte.dev/"><img src="https://raw.githubusercontent.com/sveltejs/branding/master/svelte-horizontal.svg" alt="Svelte"></a>
	<a href="https://github.com/bunze/bookshelf"><img height="32" width="32" style=" filter: invert(1); margin-left: 1em" src="https://unpkg.com/simple-icons@v4/icons/github.svg" alt="github"></a>
</footer>

<style>

	.shelf-container {
		margin: 3rem;
		display: grid;
		grid-gap: 3rem;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		justify-items: center;
	
	}

	footer {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 5rem;
		grid-row-start: 2;
		grid-row-end: 3;
		align-items: center;
		font-weight: 100;
		font-size: 0.8em;
	}

	footer img, footer a {
		height: 1.5em;
	}

</style>