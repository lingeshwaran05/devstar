<!-- routes/pastebin/+page.svelte -->
<!-- routes/pastebin/+page.svelte -->
<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
  
	let formData = {
	  text: '',
	  title: '',
	  password: '',
	  paste_expiration: '1 minute',
	  encrypt: false,
	};
  
	function resetForm() {
	  formData = {
		text: '',
		title: '',
		password: '',
		paste_expiration: '1 minute',
		encrypt: false,
	  };
	}
  </script>
  
  <!-- HTML code for the paste creation form -->
  
  <div class="min-h-screen bg-black flex items-center justify-center p-4">
	<div class="max-w-2xl w-full bg-gray-800 rounded-lg shadow-lg">
	  <div class="px-8 py-6">
		<h2 class="text-2xl font-bold text-white mb-4">Create a New Paste</h2>
		<form method="POST" use:enhance={() => {
		  return async ({ result }) => {
			if (result.type === 'success') {
			  const { id } = await result.json();
			  resetForm();
			  goto(`/pastebin/${id}`);
			}
		  };
		}}>
		  <div class="mb-4">
			<label for="text" class="block text-white mb-2">Paste your Text</label>
			<textarea
			  id="text"
			  name="text"
			  class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			  rows="4"
			  placeholder="Text..."
			  bind:value={formData.text}
			></textarea>
		  </div>
		  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
			<div>
			  <label for="title" class="block text-white mb-2">Title</label>
			  <input
				id="title"
				name="title"
				type="text"
				class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				placeholder="Title..."
				required
				bind:value={formData.title}
			  />
			</div>
			<div>
			  <label for="password" class="block text-white mb-2">Password (Optional)</label>
			  <input
				id="password"
				name="password"
				type="password"
				class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				placeholder="Password..."
				bind:value={formData.password}
			  />
			</div>
		  </div>
		  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
			<div>
			  <label for="paste_expiration" class="block text-white mb-2">Paste Expiration</label>
			  <select
				id="paste_expiration"
				name="paste_expiration"
				class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				bind:value={formData.paste_expiration}
			  >
				<option>1 minute</option>
				<option>2 minutes</option>
				<option>5 minutes</option>
				<option>10 minutes</option>
				<option>1 hour</option>
			  </select>
			</div>
			<div>
			  <label for="encrypt" class="block text-white mb-2">Encryption</label>
			  <div class="flex items-center">
				<input
				  id="encrypt"
				  name="encrypt"
				  type="checkbox"
				  class="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500 rounded"
				  bind:checked={formData.encrypt}
				/>
				<label for="encrypt" class="ml-2 block text-white">Encrypt Paste?</label>
			  </div>
			</div>
		  </div>
		  <div class="flex justify-between">
			<button type="reset" class="btn btn-neutral bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 px-4 py-2 rounded" on:click={resetForm}>
			  Clear
			</button>
			<button type="submit" class="btn btn-primary bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2 rounded">
			  Submit
			</button>
		  </div>
		</form>
	  </div>
	</div>
  </div>
  