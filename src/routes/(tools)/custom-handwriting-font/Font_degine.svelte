<script>
    import { onMount } from 'svelte';

    let currentIndex = 0; // Initial index for letters array
    const letters = generateAlphabet(); // Array of letters from 'A' to 'z'

    let previewText = ''; // Text to preview, initially empty

    let drawingCanvas;
    let ctx;

    function updatePreview(letter) {
        previewText += letter; // Append clicked letter to preview text
    }

    function nextLetter() {
        currentIndex = (currentIndex + 1) % letters.length; // Move to next letter circularly
        previewText = ''; // Reset preview text when changing letter
    }

    function prevLetter() {
        currentIndex = (currentIndex - 1 + letters.length) % letters.length; // Move to previous letter circularly
        previewText = ''; // Reset preview text when changing letter
    }

    function generateAlphabet() {
        let result = [];
        for (let i = 65; i <= 122; i++) { // ASCII codes for 'A' (65) to 'z' (122)
            result.push(String.fromCharCode(i));
        }
        return result;
    }

    function startDrawing() {
        ctx = drawingCanvas.getContext('2d');
        ctx.strokeStyle = '#000'; // Black color for drawing
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        drawingCanvas.addEventListener('mousedown', handleMouseDown);
        drawingCanvas.addEventListener('mousemove', handleMouseMove);
        drawingCanvas.addEventListener('mouseup', handleMouseUp);
        drawingCanvas.addEventListener('mouseleave', handleMouseUp);
    }

    function handleMouseDown(event) {
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }

    function handleMouseMove(event) {
        if (event.buttons !== 1) return; // Ensure left mouse button is pressed

        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }

    function handleMouseUp() {
        ctx.closePath();
    }

    onMount(() => {
        startDrawing();
    });
</script>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    h1 {
        text-align: center;
    }

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
        border: 1px solid #ccc;
        padding: 5px;
        border-radius: 4px;
        width: 80px;
        height: 80px;
    }

    .preview-text {
        margin-top: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        min-height: 50px;
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

    .drawing-canvas span {
        position: absolute;
        font-size: 24px;
    }

    .slide-button {
        font-size: 18px;
        cursor: pointer;
        padding: 8px 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        margin-top: 10px;
    }
</style>

<div class="container">
    <h1>Create Custom Handwriting Fonts</h1>

    <div class="letters">
        <div class="letter" on:click={() => updatePreview(letters[currentIndex])}>{letters[currentIndex]}</div>
    </div>

    <div class="preview-text">
        <p>Preview: {previewText}</p>
    </div>

    <div class="drawing-container">
        <canvas class="drawing-canvas" bind:this={drawingCanvas} width="800" height="300" contenteditable="true">
            Your browser does not support the HTML5 canvas tag.
        </canvas>
    </div>

    <div class="buttons">
        <button class="slide-button" on:click={prevLetter}>Previous</button>
        <button class="slide-button" on:click={nextLetter}>Next</button>
    </div>
</div>
