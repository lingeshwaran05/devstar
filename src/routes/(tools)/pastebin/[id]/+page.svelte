<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // Import $page from $app/stores
  import { HighlightAuto } from "svelte-highlight";
  import atomOneDark from "svelte-highlight/styles/atom-one-dark";
  import ClipboardJS from "clipboard";
  import toast, { Toaster } from "svelte-french-toast";
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
        new ClipboardJS(".btn-clip");
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
      <div class="card-actions">
        <div
          class="badge badge-outline flex justify-betweenflex justify-between"
        >
          <h1 class="text-2xl mb-4">{paste.title}</h1>
          {formatExpirationTime(paste.expirationTimestamp)}
        </div>

        <HighlightAuto {code} />
      </div>
      <button
        on:click={() => {
          // toast("Here is your toast.");
          toast.success("copied to clipboard");
        }}
        class="btn-clip bg-green-600 hover:bg-lime-600 text-white font-medium py-2 px-4 mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        data-clipboard-text={code}
      >
        COPY TEXT
      </button>
      <Toaster />
    </div>
  </div>
{:else}
  <div class="container mx-auto my-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <p>Paste not found or expired.</p>
    </div>
  </div>
{/if}
