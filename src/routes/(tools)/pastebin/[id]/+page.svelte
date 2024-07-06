<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // Import $page from $app/stores
  import { HighlightAuto } from "svelte-highlight";
  import atomOneDark from "svelte-highlight/styles/atom-one-dark";
  let paste = null;
  let code = null;
  onMount(async () => {
    const id = $page.params.id; // Now $page is correctly imported and can be used
    console.log(`fetching /pastebin/api?id=${id}`);
    fetch(`/pastebin/api?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Fetched paste:", data.id);
        paste = data.id;
      })
      .catch((error) => {
        console.log("Error fetching paste:", error);
      });
  });

  function formatExpirationTime(expirationTimestamp) {
    const secondsRemaining = Math.floor(
      (expirationTimestamp - Date.now()) / 1000
    );

    if (secondsRemaining <= 0) {
      return "Expired";
    } else if (secondsRemaining < 60) {
      return `${secondsRemaining} seconds`;
    } else if (secondsRemaining < 3600) {
      return `${Math.floor(secondsRemaining / 60)} minutes`;
    } else if (secondsRemaining < 86400) {
      return `${Math.floor(secondsRemaining / 3600)} hours`;
    } else {
      return `${Math.floor(secondsRemaining / 86400)} days`;
    }
  }

  function handleassignment() {
    code = paste.text;
    return "";
  }
</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>

{#if paste}
  {handleassignment()}
  <div class="container mx-auto my-8">
    <div class="bg-gray-800 rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-4">{paste.title}</h1>

      <HighlightAuto {code} />

      <div class="card-actions justify-end">
        <div class="badge badge-outline">
          {formatExpirationTime(paste.expirationTimestamp)}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="container mx-auto my-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <p>Paste not found or expired.</p>
    </div>
  </div>
{/if}
