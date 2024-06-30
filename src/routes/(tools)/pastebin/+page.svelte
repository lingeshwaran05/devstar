<script>
	import axios from 'axios';
  
	let pasteContent = '';
	let pasteName = '';
	let duration = 5;
	let pasteLink = '';
  
	async function createPaste() {
	  try {
		const response = await axios.post('/api/pastes', {
		  content: pasteContent,
		  name: pasteName,
		  duration: duration,
		});
  
		pasteLink = response.data.link;
	  } catch (error) {
		console.error('Error creating paste:', error);
	  }
	}
  </script>
  
  <main class="bg-black text-white min-h-screen flex items-center justify-center">
	<div class="w-full max-w-md p-6 bg-gray-800 rounded-lg">
	  <h1 class="text-2xl mb-4">Create a Pastebin Paste</h1>
	  <label class="block mb-2">
		<span class="text-gray-400">Paste Name:</span>
		<input type="text" bind:value={pasteName} class="block w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white" />
	  </label>
	  <label class="block mb-2">
		<span class="text-gray-400">Paste Content:</span>
		<textarea bind:value={pasteContent} class="block w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white"></textarea>
	  </label>
	  <label class="block mb-4">
		<span class="text-gray-400">Duration:</span>
		<select bind:value={duration} class="block w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
		  <option value="5">5 minutes</option>
		  <option value="10">10 minutes</option>
		  <option value="30">30 minutes</option>
		  <option value="60">1 hour</option>
		</select>
	  </label>
	  <button on:click={createPaste} class="w-full p-2 bg-blue-600 rounded hover:bg-blue-700">Create Paste</button>
	  {#if pasteLink}
		<p class="mt-4">Paste created! <a href="{pasteLink}" class="text-blue-400 underline">{pasteLink}</a></p>
	  {/if}
	</div>
  </main>
  
  <style>
	main {
	  font-family: Arial, sans-serif;
	}
  </style>
  