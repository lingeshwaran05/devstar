<!-- routes/pastebin/[id]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { decryptData } from '$lib/encryptUtil';

  let paste = null;
  let showPassword = false;

  onMount(async () => {
    const id = $page.params.id;
    const response = await fetch(`/pastebin/api/${id}`);

    if (response.ok) {
      paste = await response.json();
    } else if (response.status === 404) {
      // Paste not found or expired
      paste = null;
    } else {
      // Handle other errors
      console.error('Error fetching paste:', response.status);
    }
  });

  function togglePassword() {
    showPassword = !showPassword;
  }

  function formatExpirationTime(expirationTimestamp) {
    const secondsRemaining = Math.floor((expirationTimestamp - Date.now()) / 1000);

    if (secondsRemaining <= 0) {
      return 'Expired';
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
</script>

{#if paste}
  <div class="container mx-auto my-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-4">{paste.title}</h1>
      {#if paste.encrypted}
        {#if showPassword}
          <p class="mb-4">{decryptData(paste.text)}</p>
        {:else}
          <p class="mb-4">This paste is encrypted. Enter the password to view the content.</p>
          <button class="btn btn-primary" on:click={togglePassword}>Enter Password</button>
        {/if}
      {:else}
        <p class="mb-4">{paste.text}</p>
      {/if}
      <div class="flex justify-end">
        <span class="badge badge-secondary">
          {paste.encrypted ? 'Encrypted' : 'Not Encrypted'}
        </span>
      </div>
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
