<script lang="ts">
	export let data: { pastes: any[] };
  
	function formatExpirationTime(expirationTimestamp: number): string {
	  const now = Date.now();
	  const secondsRemaining = Math.floor((expirationTimestamp - now) / 1000);
  
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
  
  <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center">
	<div class="max-w-4xl w-full">
	  <h1 class="text-4xl font-bold mb-8">Pastebin</h1>
  
	  <div class="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
		<h2 class="text-2xl font-bold mb-4">Create a New Paste</h2>
		<form method="POST" action="?/createPaste" class="space-y-4">
		  <div>
			<label for="title" class="block font-medium mb-2">Title</label>
			<input
			  type="text"
			  id="title"
			  name="title"
			  placeholder="Enter a title"
			  class="bg-gray-700 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
			  required
			/>
		  </div>
		  <div>
			<label for="text" class="block font-medium mb-2">Text</label>
			<textarea
			  id="text"
			  name="text"
			  rows="5"
			  placeholder="Enter your text here"
			  class="bg-gray-700 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
			  required
			></textarea>
		  </div>
		  <div>
			<label for="password" class="block font-medium mb-2">Password (Optional)</label>
			<input
			  type="password"
			  id="password"
			  name="password"
			  placeholder="Enter a password"
			  class="bg-gray-700 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
			/>
		  </div>
		  <div>
			<label for="paste_expiration" class="block font-medium mb-2">Paste Expiration</label>
			<select
			  id="paste_expiration"
			  name="paste_expiration"
			  class="bg-gray-700 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
			>
			  <option value="1 minute">1 Minute</option>
			  <option value="5 minutes">5 Minutes</option>
			  <option value="10 minutes">10 Minutes</option>
			  <option value="1 hour">1 Hour</option>
			  <option value="1 day">1 Day</option>
			</select>
		  </div>
		  <div class="flex items-center">
			<input
			  type="checkbox"
			  id="encrypt"
			  name="encrypt"
			  class="h-4 w-4 text-indigo-600 bg-gray-700 rounded focus:ring-indigo-500"
			/>
			<label for="encrypt" class="ml-2 block font-medium">Encrypt Paste</label>
		  </div>
		  <button
			type="submit"
			class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
		  >
			Submit
		  </button>
		</form>
	  </div>
  
	  <div class="bg-gray-800 rounded-lg shadow-lg p-8">
		<h2 class="text-2xl font-bold mb-4">Recent Pastes</h2>
		{#if data.pastes && data.pastes.length > 0}
		  <ul class="space-y-4">
			{#each data.pastes as paste}
			  <li class="bg-gray-700 rounded-lg p-4">
				<h3 class="text-xl font-bold mb-2">{paste.title}</h3>
				<p class="mb-2">{paste.text}</p>
				<p class="text-sm text-gray-400">
				  Expires in {formatExpirationTime(paste.paste_expiration)}
				</p>
			  </li>
			{/each}
		  </ul>
		{:else}
		  <p>No pastes found.</p>
		{/if}
	  </div>
	</div>
  </div>
  