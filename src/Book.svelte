<script>
  import { scale, slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";


  export const key = null;
  export let downloads = { epub: "#", pdf: "#" };
  export let title;
  export let subtitle = null;
  export let author;

  let showDownload = false;

</script>

<style>
  .book {
    position: relative;
    border: solid gray 1px;
    background-color: black;
    width: 15em;
    height: 22em;
    padding: 0.5em 0.5em 0 0.5em;
    transition: scale 100ms ease-in-out, transform 200ms ease-in-out;
  }

  @media (hover: hover) and (pointer: fine) {
    /* Check for actual mouse: https://medium.com/@mezoistvan/finally-a-css-only-solution-to-hover-on-touchscreens-c498af39c31c */
    .book:hover {
      scale: 1.2;
    }
  }

  .showDownload {
    scale: 1.2;
  }

  .book p {
    position: absolute;
    bottom: 0;
    font-weight: 100;
  }

  .book h1 {
    font-size: 2em;
    margin: 0;
  }

  .book h3 {
    font-size: 1.2em;
    color: lightgray;
    margin-top: 0;
  }

  .downloadOptions {
    /* transform: translateY(-1em); */
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    background-color: lightgray;
    color: black;
    height: 3em;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .downloadOptions a {
    text-decoration: none;
    color: black;
    font-weight: 300;
  }
</style>

<div
  on:click={() => (showDownload = !showDownload)}
  on:mouseleave={() => (showDownload = false)}
  class="book"
  class:showDownload
  in:scale={{ duration: 800, easing: cubicOut }}>
  <h1>{title}</h1>
  {#if subtitle}
    <h3>{subtitle}</h3>
  {/if}
  <p>{author}</p>
  {#if showDownload}
    <div
      transition:slide={{ duration: 100, easing: cubicOut }}
      class="downloadOptions">
      <a href={downloads.epub} download>.epub</a>
      <a href={downloads.pdf} download>.pdf</a>
    </div>
  {/if}
</div>
