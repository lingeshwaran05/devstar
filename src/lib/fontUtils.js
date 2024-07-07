import opentype from 'opentype.js';
import svgpath from 'svgpath';

export function createFontFromSVGs() {
  const glyphs = [];
  const svgKeys = Object.keys(localStorage).filter(key => /^[A-Za-z0-9]$/.test(key));
  
  console.log(`Found ${svgKeys.length} SVG keys in localStorage`);

  svgKeys.forEach((key, index) => {
    const svgData = localStorage.getItem(key);
    if (svgData) {
      try {
        console.log(`Processing SVG for key "${key}":`, svgData);
        const pathCommands = convertSVGPathToCommands(svgData);
        console.log(`Converted path commands:`, pathCommands);
        
        if (pathCommands.length === 0) {
          console.warn(`No path commands generated for key "${key}"`);
          return;
        }

        const glyph = new opentype.Glyph({
          name: key,
          unicode: key.charCodeAt(0),
          advanceWidth: 600,
          path: new opentype.Path(pathCommands)
        });

        glyphs.push(glyph);
        console.log(`Successfully created glyph for "${key}"`);
      } catch (error) {
        console.error(`Error creating glyph for "${key}":`, error);
      }
    } else {
      console.warn(`No SVG data found for key "${key}"`);
    }
  });

  console.log(`Created ${glyphs.length} glyphs`);

  if (glyphs.length === 0) {
    console.error("No glyphs created. Cannot generate font.");
    return;
  }

  try {
    // Create font with ascender and descender
    const font = new opentype.Font({
      familyName: 'CustomFont',
      styleName: 'Regular',
      unitsPerEm: 1000,
      ascender: 800,
      descender: -200,
      glyphs: glyphs
    });

    console.log("Font created successfully");

    // Convert font to array buffer
    const arrayBuffer = font.toArrayBuffer();
    console.log(`Font array buffer size: ${arrayBuffer.byteLength} bytes`);

    if (arrayBuffer.byteLength === 0) {
      console.error("Generated font buffer is empty");
      return;
    }

    const blob = new Blob([arrayBuffer], { type: 'font/ttf' });
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger click
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CustomFont.ttf';
    link.click();

    console.log("Font download triggered");
  } catch (error) {
    console.error("Error creating or downloading font:", error);
  }
}

function convertSVGPathToCommands(svgData) {
  console.log("Converting SVG path:", svgData);
  const path = svgpath(svgData);
  const commands = [];

  path.iterate((segment, index, x, y) => {
    const type = segment[0].toLowerCase();
    const params = segment.slice(1);

    console.log(`Processing path segment: type=${type}, params=${params}`);

    switch (type) {
      case 'm':
        commands.push({type: 'M', x: params[0], y: params[1]});
        break;
      case 'l':
        commands.push({type: 'L', x: params[0], y: params[1]});
        break;
      case 'c':
        commands.push({
          type: 'C',
          x1: params[0],
          y1: params[1],
          x2: params[2],
          y2: params[3],
          x: params[4],
          y: params[5]
        });
        break;
      case 'q':
        commands.push({
          type: 'Q',
          x1: params[0],
          y1: params[1],
          x: params[2],
          y: params[3]
        });
        break;
      case 'z':
        commands.push({type: 'Z'});
        break;
      default:
        console.warn(`Unsupported path type: ${type}`);
    }
  });

  console.log("Converted commands:", commands);
  return commands;
}