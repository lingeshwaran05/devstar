<script>
	import { onMount } from 'svelte';
  
	let inputWidth = 50;
	let inputHeight = 50;
	let pathWidth = 10;
	let wallWidth = 2;
	let outerWidth = 2;
	let pathColor = '#ffffff';
	let wallColor = '#000000';
	let seed = 0;
	let maze = [];
  
	const seededRandom = (seed) => {
	  const xmur3 = str => {
		for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
		  h = Math.imul(h ^ str.charCodeAt(i), 3432918353), h = h << 13 | h >>> 19;
		return () => (h = Math.imul(h ^ h >>> 16, 2246822507), h = Math.imul(h ^ h >>> 13, 3266489909), (h ^= h >>> 16) >>> 0) / 4294967296;
	  };
	  const random = xmur3(seed.toString());
	  return () => random();
	};
  
	const generateMaze = () => {
	  const width = Math.floor(inputWidth / 2);
	  const height = Math.floor(inputHeight / 2);
	  const random = seededRandom(seed);
	  maze = generateRecursiveBacktrackingMaze(width, height, random);
	};
  
	const generateRecursiveBacktrackingMaze = (width, height, random) => {
	  const maze = Array.from({ length: height * 2 + 1 }, () => Array.from({ length: width * 2 + 1 }, () => 0));
  
	  const stack = [[1, 1]];
	  maze[1][1] = 1;
  
	  const directions = [
		[0, 2],  // down
		[2, 0],  // right
		[0, -2], // up
		[-2, 0]  // left
	  ];
  
	  while (stack.length > 0) {
		const [x, y] = stack[stack.length - 1];
		const neighbors = directions
		  .map(([dx, dy]) => [x + dx, y + dy])
		  .filter(([nx, ny]) => nx > 0 && ny > 0 && nx < width * 2 && ny < height * 2 && maze[ny][nx] === 0);
  
		if (neighbors.length > 0) {
		  const [nx, ny] = neighbors[Math.floor(random() * neighbors.length)];
		  stack.push([nx, ny]);
		  maze[(y + ny) / 2][(x + nx) / 2] = 1;
		  maze[ny][nx] = 1;
		} else {
		  stack.pop();
		}
	  }
  
	  return maze;
	};
  
	const downloadSVG = () => {
  const svgWidth = inputWidth * (pathWidth + wallWidth) + outerWidth;
  const svgHeight = inputHeight * (pathWidth + wallWidth) + outerWidth;

  let svgContent = `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${wallColor}" />
  `;

  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) {
        // Drawing horizontal walls
        if (x < maze[0].length - 1 && maze[y][x + 1] === 0) {
          svgContent += `
            <line 
              x1="${x * (pathWidth + wallWidth) + outerWidth / 2}" 
              y1="${y * (pathWidth + wallWidth) + outerWidth / 2}" 
              x2="${(x + 1) * (pathWidth + wallWidth) + outerWidth / 2}" 
              y2="${y * (pathWidth + wallWidth) + outerWidth / 2}" 
              stroke="${pathColor}" 
              stroke-width="${wallWidth}" 
            />
          `;
        }
        // Drawing vertical walls
        if (y < maze.length - 1 && maze[y + 1][x] === 0) {
          svgContent += `
            <line 
              x1="${x * (pathWidth + wallWidth) + outerWidth / 2}" 
              y1="${y * (pathWidth + wallWidth) + outerWidth / 2}" 
              x2="${x * (pathWidth + wallWidth) + outerWidth / 2}" 
              y2="${(y + 1) * (pathWidth + wallWidth) + outerWidth / 2}" 
              stroke="${pathColor}" 
              stroke-width="${wallWidth}" 
            />
          `;
        }
      }
    });
  });

  svgContent += '</svg>';

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'maze.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

	
  
	onMount(() => {
	  generateMaze();
	});
  </script>
  
  <style>
	.controls {
	  display: flex;
	  flex-wrap: wrap;
	  gap: 1rem;
	}
	.control-group {
	  display: flex;
	  align-items: center;
	  gap: 0.5rem;
	}
	.button-group {
	  display: flex;
	  gap: 0.5rem;
	}
	.maze {
	  margin-bottom: 1rem;
	}
	.card {
	  padding: 1rem;
	  background-color: #333;
	  border-radius: 8px;
	  color: white;
	}
  </style>
  
  <div class="card gap-16 items-center mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 overflow-hidden rounded-lg p-4 bg-gray-800 text-white">
	<div class="maze">
	  <svg width="{inputWidth * (pathWidth + wallWidth) + outerWidth}" height="{inputHeight * (pathWidth + wallWidth) + outerWidth}" xmlns="http://www.w3.org/2000/svg">
		<rect width="100%" height="100%" fill={wallColor} />
		{#each maze as row, y}
		  {#each row as cell, x}
			{#if !cell}
			  <!-- Drawing horizontal walls -->
			  {#if x < maze[0].length - 1 && maze[y][x + 1] === 0}
				<line x1="{x * (pathWidth + wallWidth) + outerWidth / 2}" y1="{y * (pathWidth + wallWidth) + outerWidth / 2}" x2="{(x + 1) * (pathWidth + wallWidth) + outerWidth / 2}" y2="{y * (pathWidth + wallWidth) + outerWidth / 2}" stroke={pathColor} stroke-width={wallWidth} />
			  {/if}
			  <!-- Drawing vertical walls -->
			  {#if y < maze.length - 1 && maze[y + 1][x] === 0}
				<line x1="{x * (pathWidth + wallWidth) + outerWidth / 2}" y1="{y * (pathWidth + wallWidth) + outerWidth / 2}" x2="{x * (pathWidth + wallWidth) + outerWidth / 2}" y2="{(y + 1) * (pathWidth + wallWidth) + outerWidth / 2}" stroke={pathColor} stroke-width={wallWidth} />
			  {/if}
			{/if}
		  {/each}
		{/each}
	  </svg>
	</div>
	<div class="controls">
	  <div class="control-group">
		<label for="inputWidth" class="text-white">Width: </label>
		<input id="inputWidth" type="number" bind:value={inputWidth} min="1" max="50" class="border p-1 m-1 text-white bg-gray-700">
	  </div>
	  <div class="control-group">
		<label for="inputHeight" class="text-white">Height: </label>
		<input id="inputHeight" type="number" bind:value={inputHeight} min="1" max="50" class="border p-1 m-1 text-white bg-gray-700">
	  </div>
	  <div class="control-group">
		<label for="pathWidth" class="text-white">Path Width: </label>
		<input id="pathWidth" type="number" bind:value={pathWidth} min="1" max="20" class="border p-1 m-1 text-white bg-gray-700">
	  </div>
	  <div class="control-group">
		<label for="wallWidth" class="text-white">Wall Width: </label>
		<input id="wallWidth" type="number" bind:value={wallWidth} min="1" max="20" class="border p-1 m-1 text-white bg-gray-700">
	  </div>
	  <div class="control-group">
		<label for="wallColor" class="text-white">Wall Color: </label>
		<input id="wallColor" type="color" bind:value={wallColor} class="border p-1 m-1 text-white bg-gray-700">
	  </div>
	  <div class="control-group">
		<label for="outerWidth" class="text-white">Outer Width: </label>
		<input id="outerWidth" type="number" bind:value={outerWidth} min="1" max="20" class="border p-1 m-1 text-white bg-gray-700">
	  </div>
	  <div class="control-group">
		<label for="pathColor" class="text-white">Path Color: </label>
		<input id="pathColor" type="color" bind:value={pathColor} class="border p-1 m-1 text-white bg-gray-700">
	  </div>
	  <div class="control-group">
		<label for="seed" class="text-white">Seed: </label>
		<input id="seed" type="number" bind:value={seed} class="border p-1 m-1 text-white bg-gray-700">
	  </div>
	  <div class="button-group">
		<button on:click={generateMaze} class="bg-blue-500 text-white p-2 rounded m-1">Generate Maze</button>
		<button on:click={downloadSVG} class="bg-green-500 text-white p-2 rounded m-1">Download SVG</button>
	  </div>
	</div>
  </div>
  