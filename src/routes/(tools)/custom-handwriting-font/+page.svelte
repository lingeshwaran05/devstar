<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { saveCharacter, fetchHandwriting } from "./lib/api";

  let showTemplates = true;
  let showMyFonts = false;
  let showBasicsOptions = true;
  let showLanguagesOptions = true;

  const letters = generateAlphabet();
  let currentIndex = 0;
  let char = "";
  let previewText = "";
  let drawingCanvas;
  let drawingCtx;
  let text = "";
  let handwriting = writable({});

  onMount(() => {
    drawingCtx = drawingCanvas.getContext("2d");
    startDrawing();
    fetchHandwriting().then((data) => {
      const handwritingData = {};
      data.forEach((item) => {
        handwritingData[item.character] = item.image;
      });
      handwriting.set(handwritingData);
    });
  });

  function generateAlphabet() {
    let result = [];
    for (let i = 65; i <= 122; i++) {
      if ((i >= 65 && i <= 90) || (i >= 97 && i <= 122)) {
        result.push(String.fromCharCode(i));
      }
    }
    return result;
  }

  const saveHandwriting = async () => {
    const image = drawingCanvas.toDataURL();
    await saveCharacter(char, image);
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    char = "";
  };

  function updatePreview(letter) {
    previewText += letter;
  }

  function nextLetter() {
    currentIndex = (currentIndex + 1) % letters.length;
    previewText = "";
    char = letters[currentIndex];
  }

  function prevLetter() {
    currentIndex = (currentIndex - 1 + letters.length) % letters.length;
    previewText = "";
    char = letters[currentIndex];
  }

  function startDrawing() {
    drawingCtx.strokeStyle = "#000";
    drawingCtx.lineWidth = 2;
    drawingCtx.lineCap = "round";
    drawingCtx.lineJoin = "round";

    drawingCanvas.addEventListener("mousedown", handleMouseDown);
    drawingCanvas.addEventListener("mousemove", handleMouseMove);
    drawingCanvas.addEventListener("mouseup", handleMouseUp);
    drawingCanvas.addEventListener("mouseleave", handleMouseUp);
  }

  let isDrawing = false;

  function handleMouseDown(event) {
    isDrawing = true;
    drawingCtx.beginPath();
    drawingCtx.moveTo(event.offsetX, event.offsetY);
  }

  function handleMouseMove(event) {
    if (!isDrawing) return;
    drawingCtx.lineTo(event.offsetX, event.offsetY);
    drawingCtx.stroke();
  }

  function handleMouseUp() {
    isDrawing = false;
    drawingCtx.closePath();
  }

  const copyText = () => {
    const container = document.createElement("div");
    container.innerHTML = displayedText;
    document.body.appendChild(container);
    const range = document.createRange();
    range.selectNode(container);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    document.body.removeChild(container);
  };

  $: displayedText = text
    .split("")
    .map(
      (char) =>
        `<img src="${$handwriting[char]}" alt="${char}" style="display:inline-block;width:1em;height:1em;">`
    )
    .join("");
</script>

<section
  class="dark:border-gray-800 border-gray-200 border-4 items-center mb-4 grid lg:grid-cols-2 overflow-hidden rounded-2xl"
>
  <div class="px-4 py-10 h-full">
    <div class="p-2">
      <button
        on:click={() => (showTemplates = !showTemplates)}
        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-8 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
      >
        Templates
      </button>

      <div
        class="text-gray-900 text-sm px-4 py-2 dark:text-white flex flex-col w-auto"
      >
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div
          class="flex justify-between cursor-pointer mb-2"
          on:click={() => (showBasicsOptions = !showBasicsOptions)}
          on:keydown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            (showBasicsOptions = !showBasicsOptions)}
          tabindex="0"
        >
          Basics
          {#if showBasicsOptions}
            <span>-</span>
          {:else}
            <span>+</span>
          {/if}
        </div>
        {#if showBasicsOptions}
          <ul class="ml-4" id="basics-options">
            <li class="pb-2 flex">
              <button class="flex-none">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512">
                  <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                  <path fill="#63E6BE" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
              </button>
              <p class="grow px-2">Alphabet</p>
              <button class="flex-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="14"
                  width="12.25"
                  viewBox="0 0 448 512"
                  ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                    fill="#ff0000"
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  /></svg
                >
              </button>
            </li>
            <li class="pb-2 flex">
              <button class="flex-none">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512">
                  <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                  <path fill="#63E6BE" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
              </button>
              <p class="grow px-2">Numbers</p>
              <button class="flex-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="14"
                  width="12.25"
                  viewBox="0 0 448 512"
                  ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                    fill="#ff0000"
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  /></svg
                >
              </button>
            </li>
            <li class="pb-2 flex">
              <button class="flex-none">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512">
                  <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                  <path fill="#63E6BE" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
              </button>
              <p class="grow px-2">Punctuation</p>
              <button class="flex-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="14"
                  width="12.25"
                  viewBox="0 0 448 512"
                  ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                    fill="#ff0000"
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  /></svg
                >
              </button>
            </li>
          </ul>
        {/if}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div
          class="flex justify-between cursor-pointer mb-2"
          on:click={() => (showLanguagesOptions = !showLanguagesOptions)}
          tabindex="0"
          on:keydown={(e) =>
            e.key === "Enter" && (showLanguagesOptions = !showLanguagesOptions)}
        >
          Languages
          {#if showLanguagesOptions}
            <span>-</span>
          {:else}
            <span>+</span>
          {/if}
        </div>
      </div>
      <button
        on:click={() => (showMyFonts = !showMyFonts)}
        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-8 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        My Fonts
      </button>
      {#if showMyFonts}
        <div
          class="text-gray-900 text-sm px-4 py-2 dark:text-white flex flex-col w-auto"
        >
          <ul>
            {#each Object.keys($handwriting) as key}
              <li class="mb-2 flex items-center">
                <img src={$handwriting[key]} alt={key} class="w-8 h-8" />
                <span class="ml-2">{key}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>

    <div class="m-2">
      {#if showTemplates}
        <ul class="flex flex-wrap justify-center items-center gap-2">
          {#each letters as letter}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li
              class="flex justify-center items-center p-2 bg-gray-200 rounded shadow w-10 h-10"
              on:click={() => updatePreview(letter)}
            >
              {letter}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>

  <div class="dark:bg-gray-800 bg-gray-200 px-4 py-10 h-full">
    <div class="letters">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="letter dark:text-white text-gray-900 border dark:border-gray-600 border-gray-400"
        on:click={() => updatePreview(letters[currentIndex])}
      >
        {letters[currentIndex]}
      </div>
    </div>
    <div class="drawing-container">
      <canvas
        class="drawing-canvas"
        bind:this={drawingCanvas}
        width="800"
        height="300"
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </div>
    <div class="buttons my-4 flex items-center justify-center">
      <button
        class="cursor-pointer m-2 bg-blue-600 text-sm hover:bg-green-600 text-white px-6 py-4 rounded-lg"
        on:click={prevLetter}>Previous</button
      >
      <button
        class="cursor-pointer m-2 bg-blue-600 text-sm hover:bg-green-600 text-white px-6 py-4 rounded-lg"
        on:click={nextLetter}>Next</button
      >
      <button
        class="cursor-pointer m-2 bg-blue-600 text-sm hover:bg-green-600 text-white px-6 py-4 rounded-lg"
        on:click={saveHandwriting}>Save</button
      >
    </div>
  </div>
</section>

<style>
  .letters {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }

  .letter {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    margin: 5px;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    width: 80px;
    height: 80px;
  }

  .drawing-container {
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 20px;
    position: relative;
  }

  .drawing-canvas {
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
    cursor: crosshair;
    position: relative;
  }
</style>
