<script context="module">
    export async function load({ params, fetch }) {
      const response = await fetch(`/pastebin/${params.id}`);
      const snippet = await response.json();
      return { snippet };
    }
  </script>
  
  <script>
    export let snippet;
  </script>
  
  <main>
    <h1>Code Snippet</h1>
    <pre>{snippet.code}</pre>
  </main>
  