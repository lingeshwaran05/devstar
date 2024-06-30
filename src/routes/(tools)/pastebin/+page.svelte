<script>
		let code = '';
		let link = '';
	  
		async function submitCode() {
		  const response = await fetch('/pastebin', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code })
		  });
	  
		  const data = await response.json();
		  link = `/pastebin/${data.id}`;
		}
	  </script>
<div class="gap-16 items-center mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 overflow-hidden rounded-lg text-white">
	
	  
	  <main>
		<h1>Pastebin App</h1>
		<textarea class="text-black" bind:value={code} placeholder="Paste your code here"></textarea>
		<br>
		<button on:click={submitCode}>Generate Link</button>
	  
		{#if link}
		  <p>Your link: <a href={link}>{link}</a></p>
		{/if}
	  </main>
	  
</div>
<style>

</style>