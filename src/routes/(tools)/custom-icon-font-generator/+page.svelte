<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import JSZip from 'jszip';
	import { saveAs } from 'file-saver';
	
	//Main Script done by Kaif Satopay
	let inputFile: File | null = null;
	let fileName = '';
	let extension = '';
	let downloadUrl = '';
	let svgContent = '';
	let iconName = '';
  



	//This Part was done by Aryan Gupta 
	const getFileFormat = (e: Event) => {
	  inputFile = (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files[0] : null;
	  if (!inputFile) return;
	  
	  const file = inputFile.name.split('.');
	  fileName = file[0];
	  extension = file[1];
	};



	//This Part was done by Aryan Gupta 
	const convertFile = () => {
	  const input = document.getElementById('input-file') as HTMLInputElement;
	  const outputContainer = document.getElementById('output') as HTMLDivElement;
	  const downloadBtn = document.getElementById('download-btn') as HTMLAnchorElement;
  
	  const file = input.files ? input.files[0] : null;
	  if (!file) return;
  
	  const reader = new FileReader();
	  reader.onload = async (e: ProgressEvent<FileReader>) => {
		const imageSrc = e.target?.result as string;
		const img = new Image();
		img.src = imageSrc;
		img.onload = () => {
		  const canvas = document.createElement('canvas');
		  const ctx = canvas.getContext('2d')!;
		  canvas.width = img.width;
		  canvas.height = img.height;
		  ctx.drawImage(img, 0, 0);
  
		  const svgData = `
			<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
			  <image href="${canvas.toDataURL(`image/${extension}`)}" width="${canvas.width}" height="${canvas.height}"/>
			</svg>`;
		  
		  outputContainer.innerHTML = `<img src="data:image/svg+xml;base64,${btoa(svgData)}" alt="Converted Image" class="w-32 h-32">`;
		  svgContent = svgData;
		  downloadUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;
		  downloadBtn.style.display = 'block';
		  downloadBtn.href = downloadUrl;
		  downloadBtn.download = `${fileName}.svg`;
		};
	  };
	  reader.readAsDataURL(file);
	};




	//This PArt was done by Sambhav Bhansali
	const generateZip = () => {
	  const zip = new JSZip();
	  const svgName = iconName || fileName;
  
	  const cssContent = `
		.${svgName}:before {
		  content: "\\e900"; /* Unicode character for your icon */
		  font-family: 'Your-Icon-Font'; /* Replace with your icon font family */
		}
	  `;
  
	  const htmlContent = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>${svgName}</title>
		  <link rel="stylesheet" href="styles.css"> <!-- Link to your generated CSS file -->
		</head>
		<body>
		  <span class="${svgName}"></span>
		</body>
		</html>
	  `;
  
	  //This part was done by Kaif Satopay
	  zip.file('styles.css', cssContent);
	  zip.file('html/index.html', htmlContent);

	  const metadataFolder = zip.folder('metadata');
	  // Add files inside metadata folder (example)
	  metadataFolder.file('metadata/file1.txt', 'File 1 content');
	  metadataFolder.file('metadata/file2.txt', 'File 2 content');
 
	  zip.generateAsync({ type: 'blob' }).then((content) => {
		saveAs(content, `${svgName}.zip`);
	  });
	};
  
	const convertFormat = (event: Event) => {
	  event.preventDefault();
	  convertFile();
	};
  </script>







<!-- 
  The Formatting, Styling, Presenting, and Developing the UI was done by Simran Singh and Yadhukrishna Nair 
-->

  <section class="bg-white dark:bg-gray-900">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:px-12 card overflow-hidden rounded-lg">
	  <form class="gap-16 items-center mx-auto max-w-screen-xl lg:grid lg:grid-cols-3" on:submit={convertFormat}>
		<div class="p-8">
		  <Label for="input-file">Input File</Label>
		  <div class="flex items-center">
			<input type="file" name="input-file" id="input-file" class="rounded-lg border border-gray-400 dark:border-white dark:bg-white w-full" bind:value={inputFile} on:change={getFileFormat} accept="image/jpeg, image/jpg, image/png" required/>
		  </div>
		</div>
		<div class="p-8">
		  <Label for="icon-name">Icon Name</Label>
		  <div class="flex items-center">
			<input type="text" id="icon-name" bind:value={iconName} class="rounded-lg border border-gray-400 dark:border-white w-full" placeholder="Enter icon name (optional)" />
		  </div>
		</div>
		<div class="p-8">
		  <div class="p-4 flex rounded-lg items-center justify-center">
			<button type="submit" class="bg-gray-800 px-4 py-2 rounded-lg text-white border border-gray-400 dark:border-white w-24 mt-4 card">Convert</button>
		  </div>
		</div>
	  </form>
	  

	  <div class="flex justify-center" id="output"></div> 
	  <div class="flex justify-center mt-4">
		<a id="download-btn" href="#top" class="button text-gray-900 dark:text-white mr-3" download>Download SVG</a>
	  </div>
	  {#if svgContent}
		<div class="flex justify-center mt-4">
		  <button class="bg-blue-700 border text-white p-2 rounded-lg" on:click={generateZip}>Download HTML/CSS</button>
		</div>
	  {/if}
	</div>
  </section>
  
  <style>
	#download-btn {
	  display: none;
	}
	#download-btn.button {
	  padding: 0.5rem 1rem;
	  background-color: #3490DC;
	  color: #fff;
	  border: none;
	  border-radius: 0.375rem;
	  cursor: pointer;
	  text-decoration: none;
	  transition: background-color 0.3s ease;
	}
	#download-btn.button:hover {
	  background-color: #1D5C8F;
	}
	@media (max-width: 768px) {
	  .card {
		display: flex;
		flex-direction: column;
		align-items: center;
	  }
	  form {
		width: 100%;
	  }
	}
  </style>
  