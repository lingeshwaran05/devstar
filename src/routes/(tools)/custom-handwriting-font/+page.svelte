<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let letters = Object.keys(generateAlphabet());
  let showTemplates = true;
  let currentIndex = 0;
  let char = letters[currentIndex];
  let previewText = "";
  let drawingCanvas;
  let drawingCtx;
  let handwriting = writable({});
  let savedLetters = writable([]);
  let isEraser = false;
  let penWidth = 2;
  let eraserWidth = 10;
  let fonts = writable([]); // Store for dynamic fonts

  // Constants for the SVG template, handle download properties
  const handleDownload = () => {
    const a4Width = 595;
    const a4Height = 842;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", a4Width);
    svg.setAttribute("height", a4Height);
    svg.setAttribute("viewBox", `0 0 ${a4Width} ${a4Height}`);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "#ffffff");
    svg.appendChild(rect);

    letters.forEach((letter, index) => {
      const x = startX + (index % 8) * (boxWidth + marginX);
      const y = startY + Math.floor(index / 8) * (boxHeight + marginY);

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", x + boxWidth / 2);
      text.setAttribute("y", y - headingOffsetY);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-family", "Arial");
      text.setAttribute("font-size", "14");
      text.setAttribute("fill", "#000000");
      text.textContent = letter;
      svg.appendChild(text);

      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", boxWidth);
      rect.setAttribute("height", boxHeight);
      rect.setAttribute("fill", "none");
      rect.setAttribute("stroke", "#000000");
      svg.appendChild(rect);
    });

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "handwriting_template.svg";
    link.click();
  };

  // Start the app
  onMount(() => {
    drawingCtx = drawingCanvas.getContext("2d");
    startDrawing();
    const saved = JSON.parse(localStorage.getItem("savedLetters")) || [];
    savedLetters.set(saved);
    saved.forEach((letter) => {
      const image = localStorage.getItem(letter);
      handwriting.update((h) => {
        h[letter] = image;
        return h;
      });
    });
    updateCanvas(char);
    window.addEventListener("keydown", handleKeyPress);
  });

  // Generate alphabet and numbers in the keyboard and canvas heading letters
  function generateAlphabet() {
    let result = {};
    for (let i = 65; i <= 90; i++) {
      result[String.fromCharCode(i)] = null;
    }
    for (let i = 97; i <= 122; i++) {
      result[String.fromCharCode(i)] = null;
    }
    for (let i = 48; i <= 57; i++) {
      // ASCII codes for 0-9
      result[String.fromCharCode(i)] = null;
    }
    return result;
  }

  // Save handwriting to local storage
  const saveHandwriting = async () => {
    const svg = createSvgFromCanvas(drawingCanvas);
    const letter = letters[currentIndex];
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    localStorage.setItem(letter, svgString);
    savedLetters.update((saved) => {
      if (!saved.includes(letter)) {
        saved.push(letter);
        localStorage.setItem("savedLetters", JSON.stringify(saved));
      }
      return saved;
    });

    handwriting.update((h) => {
      h[letter] = svgString;
      return h;
    });
  };

  // Create SVG from canvas
  function createSvgFromCanvas(canvas) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", canvas.width);
    svg.setAttribute("height", canvas.height);
    const image = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );
    image.setAttribute("href", canvas.toDataURL("image/png"));
    svg.appendChild(image);
    return svg;
  }

  // for delete button in the local storage
  function deleteLetter(letter) {
    savedLetters.update((saved) => {
      const index = saved.indexOf(letter);
      if (index !== -1) {
        saved.splice(index, 1);
        localStorage.removeItem(letter);
        localStorage.setItem("savedLetters", JSON.stringify(saved));
      }
      return saved;
    });
    handwriting.update((h) => {
      delete h[letter];
      return h;
    });
    if (letter === char) {
      updateCanvas(char);
    }
  }

  // for preview button
  function updatePreview(letter) {
    previewText += letter;
  }

  // handle keypress event
  function handleKeyPress(event) {
    const letter = event.key;

    if (letters.includes(letter)) {
      updatePreview(letter);
    } else if (letter === " ") {
      updatePreview(" ");
    } else if (event.key === "Backspace") {
      previewText = previewText.slice(0, -1);
    }
  }

  // for next button
  function nextLetter() {
    currentIndex = (currentIndex + 1) % letters.length;
    char = letters[currentIndex];
    updateCanvas(char);
  }

  // for previous button
  function prevLetter() {
    currentIndex = (currentIndex - 1 + letters.length) % letters.length;
    char = letters[currentIndex];
    updateCanvas(char);
  }

  // Update canvas with the selected letter
  function updateCanvas(letter) {
    const image = localStorage.getItem(letter);
    if (image) {
      const img = new Image();
      img.onload = () => {
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawingCtx.drawImage(img, 0, 0);
      };
      img.src = image;
    } else {
      drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
  }

  // Start drawing on the canvas
  function startDrawing() {
    updateTool();
    drawingCanvas.addEventListener("mousedown", handleMouseDown);
    drawingCanvas.addEventListener("mousemove", handleMouseMove);
    drawingCanvas.addEventListener("mouseup", handleMouseUp);
    drawingCanvas.addEventListener("mouseleave", handleMouseUp);
  }

  // Update the tool based on the selected tool
  $: updateTool = () => {
    drawingCtx.lineWidth = isEraser ? eraserWidth : penWidth;
    drawingCtx.strokeStyle = isEraser ? "#fff" : "#000";
    drawingCanvas.style.cursor = isEraser
      ? "url(data:image/svg+xml;base64," +
        btoa(
          '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="22.5" viewBox="0 0 576 512"><path fill="#e6657f" d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H288h9.4H512c17.7 0 32-14.3 32-32s-14.3-32-32-32H387.9L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416H288l-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"/></svg>'
        ) +
        ") 0 20, auto"
      : "url(data:image/svg+xml;base64," +
        btoa(
          '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path fill="#88bd14" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>'
        ) +
        ") 0 20, auto";
  };

  // Toggle eraser function
  function toggleEraser() {
    isEraser = !isEraser;
    updateTool();
  }

  let isDrawing = false;

  // Get mouse position
  function getMousePos(event) {
    const rect = drawingCanvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (drawingCanvas.width / rect.width),
      y: (event.clientY - rect.top) * (drawingCanvas.height / rect.height),
    };
  }

  // Handle mouse events when the user is drawing towards down
  function handleMouseDown(event) {
    const { x, y } = getMousePos(event);
    isDrawing = true;
    drawingCtx.beginPath();
    drawingCtx.moveTo(x, y);
  }

  // Handle mouse events when the user is drawing towards up
  function handleMouseMove(event) {
    if (!isDrawing) return;
    const { x, y } = getMousePos(event);
    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();
  }

  // Handle mouse events when the user is drawing towards up
  function handleMouseUp() {
    isDrawing = false;
    drawingCtx.closePath();
  }

  // Download the canvas as SVG
  const downloadCanvas = () => {
    const link = document.createElement("a");

    // Create an SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "320");
    svg.setAttribute("height", "320");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // Create a rectangle to fill the background with white
    const background = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    background.setAttribute("width", "100%");
    background.setAttribute("height", "100%");
    background.setAttribute("fill", "#ffffff");
    svg.appendChild(background);

    // Create an image element to hold the canvas content
    const image = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );
    image.setAttribute("width", "320");
    image.setAttribute("height", "320");
    image.setAttribute("href", drawingCanvas.toDataURL("image/png"));
    svg.appendChild(image);

    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Set up the download link
    link.download = `${char}.svg`;
    link.href = svgUrl;
    link.click();
  };

  // Add new font function
  function addFont() {
    fonts.update((current) => [
      ...current,
      { id: Date.now(), name: "My Font", editing: false },
    ]);
  }

  // Delete font function
  function deleteFont(id) {
    fonts.update((current) => current.filter((font) => font.id !== id));
  }

  // Edit font name function
  function editFont(id, newName) {
    fonts.update((current) =>
      current.map((font) =>
        font.id === id ? { ...font, name: newName, editing: false } : font
      )
    );
  }

  // Toggle editing state
  function toggleEditFont(id) {
    fonts.update((current) =>
      current.map((font) =>
        font.id === id ? { ...font, editing: !font.editing } : font
      )
    );
  }
</script>

<section
  class="dark:border-gray-800 border-gray-200 border-4 items-center mb-4 grid lg:grid-cols-2 overflow-hidden rounded-2xl"
>
  <!-- Sidebar div starts here -->
  <div class="px-6 py-10 h-full">
    <!-- Fonts Collection -->
    <div class="flex gap-4 pb-4">
      <p class="dark:text-white text-gray-900 text-xl">Fonts Collection</p>

      <button on:click={addFont}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          width="20"
          viewBox="0 0 512 512"
          ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
            fill="#63E6BE"
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
          /></svg
        >
      </button>
      <button on:click={handleDownload}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          width="20"
          viewBox="0 0 512 512"
          ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
            fill="#63E6BE"
            d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM127 281c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l71 71L232 136c0-13.3 10.7-24 24-24s24 10.7 24 24l0 182.1 71-71c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 393c-9.4 9.4-24.6 9.4-33.9 0L127 281z"
          /></svg
        >
      </button>
    </div>

    <hr class="py-2" />

    <!-- My Fonts -->
    <div
      class="text-gray-900 text-sm px-4 py-2 dark:text-white flex flex-col w-auto"
    >
      <ul>
        {#each $fonts as font}
          <li class="mb-2 flex items-center">
            {#if font.editing}
              <input
                type="text"
                class="px-2 py-1 w-full border dark:bg-gray-700 dark:text-white"
                bind:value={font.name}
                on:blur={() => editFont(font.id, font.name)}
                on:keydown={(e) =>
                  e.key === "Enter" && editFont(font.id, font.name)}
              />
            {:else}
              <span
                class="ml-2 cursor-pointer"
                on:dblclick={() => toggleEditFont(font.id)}>{font.name}</span
              >
            {/if}
            <button class="flex-none ml-2" on:click={() => deleteFont(font.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14"
                width="12.25"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#ff0000"
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                />
              </svg>
            </button>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Keyboard -->
    <div class="m-4">
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

    <!-- Preview -->
    <div class="preview-text my-6 w-full bg-blue-50 rounded-lg">
      <p class="p-4">
        {#if previewText}
          {previewText}
        {:else}
          Preview your font
        {/if}
      </p>
    </div>
  </div>

  <!-- Canvas div starts here -->
  <div class="dark:bg-gray-800 bg-gray-200 px-4 py-10 h-full">
    <!-- Upper div -->
    <div class="letters flex justify-center items-center mx-2 my-6">
      <!-- display letter -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="letter flex items-center justify-center text-4xl px-5 py-3 rounded-xl dark:text-white text-gray-900 border dark:border-gray-600 border-gray-400"
        on:click={() => updatePreview(letters[char])}
      >
        {char}
      </div>

      <!-- toggle button eraser and pen -->
      <button
        class="cursor-pointer mx-6 text-sm p-4 bg-blue-500 rounded-full hover:bg-green-600"
        on:click={toggleEraser}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="28"
          width={isEraser ? "28" : "28"}
          viewBox={isEraser ? "0 0 576 512" : "0 0 512 512"}
        >
          <path
            fill={isEraser ? "#e6657f" : "#88bd14"}
            d={isEraser
              ? "M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H288h9.4H512c17.7 0 32-14.3 32-32s-14.3-32-32-32H387.9L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416H288l-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"
              : "M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"}
          />
        </svg>
      </button>

      {#if !isEraser}
        <div
          class="flex items-center justify-center text-black dark:text-white"
        >
          <label for="penWidth" class="mr-2">Stroke:</label>
          <input
            type="range"
            id="penWidth"
            min="1"
            max="10"
            bind:value={penWidth}
            on:input={updateTool}
          />
          <span class="ml-2">{penWidth}</span>
        </div>
      {/if}
      {#if isEraser}
        <div
          class="flex items-center justify-center text-black dark:text-white"
        >
          <label for="eraserWidth" class="mr-2">Area:</label>
          <input
            type="range"
            id="eraserWidth"
            min="10"
            max="50"
            bind:value={eraserWidth}
            on:input={updateTool}
          />
          <span class="ml-2">{eraserWidth}</span>
        </div>
      {/if}
    </div>

    <!-- Drawing Container -->
    <div
      class="drawing-container w-80 h-80 mx-auto rounded-xl mb-4 border-4 border-gray-500"
    >
      <canvas
        class="drawing-canvas w-full h-full bg-white rounded-lg relative"
        bind:this={drawingCanvas}
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </div>

    <!-- All the 5 buttons -->
    <div class="m-4 flex gap-6 items-center justify-center">
      <!-- delete svg font button -->
      <button
        class="cursor-pointer"
        on:click={() => deleteLetter(letters[currentIndex])}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="34"
          width="38"
          viewBox="0 0 448 512"
        >
          <path
            fill="#ff0000"
            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
          />
        </svg>
      </button>

      <!-- Previous button -->
      <button class="cursor-pointer" on:click={prevLetter}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="40"
          width="40"
          viewBox="0 0 448 512"
        >
          <path
            fill="#7d52ff"
            d="M0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96L0 416zM128 256c0-6.7 2.8-13 7.7-17.6l112-104c7-6.5 17.2-8.2 25.9-4.4s14.4 12.5 14.4 22l0 208c0 9.5-5.7 18.2-14.4 22s-18.9 2.1-25.9-4.4l-112-104c-4.9-4.5-7.7-10.9-7.7-17.6z"
          />
        </svg>
      </button>

      <!-- Next button -->
      <button class="cursor-pointer" on:click={nextLetter}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="40"
          width="40"
          viewBox="0 0 448 512"
        >
          <path
            fill="#7d52ff"
            d="M448 96c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320zM320 256c0 6.7-2.8 13-7.7 17.6l-112 104c-7 6.5-17.2 8.2-25.9 4.4s-14.4-12.5-14.4-22l0-208c0-9.5 5.7-18.2 14.4-22s18.9-2.1 25.9 4.4l112 104c4.9-4.5 7.7 10.9 7.7 17.6z"
          />
        </svg>
      </button>

      <!-- Save font on local storage button -->
      <button class="cursor-pointer" on:click={saveHandwriting}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="34"
          width="24"
          viewBox="0 0 384 512"
        >
          <path
            fill="#f58f00"
            d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z"
          />
        </svg>
      </button>

      <!-- download svg font button -->
      <button class="cursor-pointer" on:click={downloadCanvas}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="34"
          width="40"
          viewBox="0 0 512 512"
        >
          <path
            fill="#22cc00"
            d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
          />
        </svg>
      </button>
    </div>
  </div>
</section>
