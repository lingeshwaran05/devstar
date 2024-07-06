<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Whiteboard</title>
    <style>
        .inner-card {
            height: 600px;
            position: relative;
        }

        #whiteboard {
            width: 100%;
            height: 100%;
            border: 1px solid #ccc;
        }

        .nav-bar {
            width: 100%;
            position: relative;
        }

        .tool-btn {
            border: none;
            padding: 8px 16px;
            margin: 4px;
            cursor: pointer;
            border-radius: 4px;
            position: relative;
        }

        .tool-btn img {
            width: 24px;
            height: 24px;
        }

        .tool-btn:hover {
            background-color: #e0e0e0;
        }

        .dropdown {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            z-index: 1000;
            display: none;
            background-color: #fff;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
            border-radius: 4px;
            width: max-content;
        }

        .dropdown.active {
            display: block;
        }

        .dropdown-arrow {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 6px 6px 0 6px;
            border-color: #424242 transparent transparent transparent;
        }

        .dropdown-item {
            padding: 8px 16px;
            cursor: pointer;
        }

        .dropdown-item:hover {
            background-color: #f0f0f0;
        }

        .color-palette {
            display: flex;
            padding: 8px;
        }

        .color-swatch {
            width: 24px;
            height: 24px;
            margin: 4px;
            border-radius: 4px;
            cursor: pointer;
        }
        .tool-btn.active {
            background-color: #c0c0c0; /* Example color for active state */
            border: 1px solid #000;   /* Example border for active state */
        }
        .color-swatch.active {
           border: 2px solid #000; /* Example border for active state */
        }
        .color-palette {
    display: flex;
    flex-wrap: wrap;
    max-width: 150px; /* Adjust this width based on your design */
}

.color-swatch {
    width: 24px;
    height: 24px;
    margin: 4px;
    border-radius: 4px;
    cursor: pointer;
}



    </style>
</head>
<body>
    <div class="card items-center mx-auto max-w-screen-xl lg:grid overflow-hidden rounded-lg">
        <!-- Navigation bar -->
        <div class="nav-bar bg-gray-200 p-2 flex items-center">
            <button id="pencil" class="tool-btn"><img src="/src/images/pencil.png" alt="" /></button>
            <div class="relative">
                <button id="eraser" class="tool-btn"><img src="/src/images/eraser.png" alt="" /><span class="dropdown-arrow"></span></button>
                <div id="eraser-width-dropdown" class="dropdown">
                    <div class="range-slider">
                        <input class="input-range" orient="vertical" id="sliderSelection" type="range" step="2" value="5" min="2" max="20" />
                        <span class="range-value"></span>
                    </div>
                </div>
            </div>

            <div class="relative">
                <button id="fill" class="tool-btn"><img src="/src/images/paint-bucket.png" alt="" /><span class="dropdown-arrow"></span></button>
                <div id="color-palette-dropdown" class="dropdown">
                    <div class="color-palette">
                        <div class="color-swatch" data-color="#FF4500" style="background-color: #FF4500;"></div> <!-- Orange Red -->
                        <div class="color-swatch" data-color="#32CD32" style="background-color: #32CD32;"></div> <!-- Lime Green -->
                        <div class="color-swatch" data-color="#1E90FF" style="background-color: #1E90FF;"></div> <!-- Dodger Blue -->
                        <div class="color-swatch" data-color="#FFD700" style="background-color: #FFD700;"></div> <!-- Gold -->
                        <div class="color-swatch" data-color="#EE82EE" style="background-color: #EE82EE;"></div> <!-- Violet -->
                        <div class="color-swatch" data-color="#8A2BE2" style="background-color: #8A2BE2;"></div> <!-- Blue Violet -->
                        <div class="color-swatch" data-color="#A52A2A" style="background-color: #A52A2A;"></div> <!-- Brown -->
                        <div class="color-swatch" data-color="#5F9EA0" style="background-color: #5F9EA0;"></div> <!-- Cadet Blue -->
                        <div class="color-swatch" data-color="#7FFF00" style="background-color: #7FFF00;"></div> <!-- Chartreuse -->
                        <div class="color-swatch" data-color="#D2691E" style="background-color: #D2691E;"></div> <!-- Chocolate -->
                        <div class="color-swatch" data-color="#FF7F50" style="background-color: #FF7F50;"></div> <!-- Coral -->
                        <div class="color-swatch" data-color="#6495ED" style="background-color: #6495ED;"></div> <!-- Cornflower Blue -->
                        <div class="color-swatch" data-color="#DC143C" style="background-color: #DC143C;"></div> <!-- Crimson -->
                        <div class="color-swatch" data-color="#00FA9A" style="background-color: #00FA9A;"></div> <!-- Medium Spring Green -->
                        <div class="color-swatch" data-color="#BA55D3" style="background-color: #BA55D3;"></div> <!-- Medium Orchid -->
                        <div class="color-swatch" data-color="#FFDAB9" style="background-color: #FFDAB9;"></div> <!-- Peach Puff -->
                        <div class="color-swatch" data-color="#FF6347" style="background-color: #FF6347;"></div> <!-- Tomato -->
                        <div class="color-swatch" data-color="#4682B4" style="background-color: #4682B4;"></div> <!-- Steel Blue -->
                        <div class="color-swatch" data-color="#40E0D0" style="background-color: #40E0D0;"></div> <!-- Turquoise -->
                        <div class="color-swatch" data-color="#DA70D6" style="background-color: #DA70D6;"></div> <!-- Orchid -->
                    </div>
                    
                    
                </div>
            </div>

            <div class="relative">
                <button id="shapes" class="tool-btn"><img src="/src/images/shapes.png" alt="" /><span class="dropdown-arrow"></span></button>
                <div id="shapes-dropdown" class="dropdown">
                    <div class="dropdown-item" data-shape="circle"><img src="/src/images/circle2.png" alt=""></div>
                    <div class="dropdown-item" data-shape="square"><img src="/src/images/square.png" alt=""></div>
                    <div class="dropdown-item" data-shape="triangle"><img src="/src/images/triangle.png" alt=""></div>
                    <div class="dropdown-item" data-shape="rectangle"><img src="/src/images/rectangle.png" alt=""></div>
                    <div class="dropdown-item" data-shape="line"><img src="/src/images/line.png" alt=""></div>
                </div>
            </div>
            <button id="add-image" class="tool-btn"><img src="/src/images/image.png" alt="" /></button>
            <input type="file" id="image-input" style="display: none;" accept="image/*" />
            <button id="undo" class="tool-btn"><img src="/src/images/undo.png" alt="" /></button>
            <button id="redo" class="tool-btn"><img src="/src/images/redo.png" alt="" /></button>
            <button id="download" class="tool-btn"><img src="/src/images/downloads.png" alt="Download" /></button>
            <button id="clear" class="tool-btn"><img src="/src/images/clear.png" alt="Clear Canvas" /></button>
            
          </div>

        <!-- Whiteboard area -->
        <div class="inner-card w-full bg-white">
            <canvas id="whiteboard"></canvas>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const canvas = document.getElementById("whiteboard");
            const ctx = canvas.getContext("2d");
            let isDrawing = false;
            let lastX = 0;
            let lastY = 0;
            let tool = "pencil";
            let eraserSize = 10;
            let drawingHistory = [];
            let historyIndex = -1;
            let fillColor = [0, 0, 0, 255]; // Default fill color is black
            let shape = null;
            let startX, startY;

            function resizeCanvas() {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                if (drawingHistory.length > 0) {
                    ctx.putImageData(drawingHistory[historyIndex], 0, 0);
                }
            }

            // Call resizeCanvas initially and on window resize
            resizeCanvas();
            window.addEventListener("resize", resizeCanvas);

            function startDrawing(e) {
                isDrawing = true;
                [lastX, lastY] = [e.offsetX, e.offsetY];
                if (tool === "shapes" && shape) {
                    startX = e.offsetX;
                    startY = e.offsetY;
                } else if (tool === "fill") {
                    floodFill(e.offsetX, e.offsetY, fillColor);
                    saveDrawingAction();
                }
            }

            function draw(e) {
                if (!isDrawing) return;
                ctx.lineWidth = tool === "eraser" ? eraserSize : 2;
                ctx.lineCap = "round";
                ctx.strokeStyle = tool === "eraser" ? "#fff" : "#000";

                if (tool === "shapes" && shape) {
                    // Redraw the last state of the canvas to avoid drawing artifacts
                    if (drawingHistory.length > 0) {
                        ctx.putImageData(drawingHistory[historyIndex], 0, 0);
                    }
                    switch (shape) {
                        case "circle":
                            drawCircle(startX, startY, e.offsetX, e.offsetY);
                            break;
                        case "square":
                            drawSquare(startX, startY, e.offsetX, e.offsetY);
                            break;
                        case "line":
                            drawLine(startX, startY, e.offsetX, e.offsetY);
                            break;
                        case "rectangle":
                            drawRectangle(startX, startY, e.offsetX, e.offsetY);
                            break;
                        case "triangle":
                            drawTriangle(startX, startY, e.offsetX, e.offsetY);
                            break;
                    }
                } else {
                    ctx.beginPath();
                    ctx.moveTo(lastX, lastY);
                    ctx.lineTo(e.offsetX, e.offsetY);
                    ctx.stroke();
                    [lastX, lastY] = [e.offsetX, e.offsetY];
                }
            }

            function stopDrawing() {
                if (!isDrawing) return;
                isDrawing = false;
                if (tool !== "eraser" && tool !== "shapes") {
                    saveDrawingAction();
                } else if (tool === "shapes" && shape) {
                    saveDrawingAction();
                }
            }

            function saveDrawingAction() {
                if (historyIndex < drawingHistory.length - 1) {
                    drawingHistory = drawingHistory.slice(0, historyIndex + 1);
                }
                drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                historyIndex++;
            }

            canvas.addEventListener("mousedown", startDrawing);
            canvas.addEventListener("mousemove", draw);
            canvas.addEventListener("mouseup", stopDrawing);
            canvas.addEventListener("mouseout", stopDrawing);

            function clearActiveTool() {
                document.querySelectorAll('.tool-btn').forEach(btn => {
                btn.classList.remove('active');
              });
            }

            document.getElementById("pencil").addEventListener("click", () => {
                clearActiveTool();
                tool = "pencil";
                document.getElementById("pencil").classList.add('active');
              });

              document.getElementById("eraser").addEventListener("click", () => {
                clearActiveTool();
                tool = "eraser";
                document.getElementById("eraser").classList.add('active');
                toggleDropdown("eraser-width-dropdown");
              });


            document.getElementById("sliderSelection").addEventListener("input", function () {
                eraserSize = parseInt(this.value);
                this.nextElementSibling.textContent = eraserSize;
            });

            
            document.getElementById("fill").addEventListener("click", () => {
                clearActiveTool();
                tool = "fill";
                document.getElementById("fill").classList.add('active');
                toggleDropdown("color-palette-dropdown");
            });
            
            document.querySelectorAll(".color-swatch").forEach(swatch => {
              swatch.addEventListener("click", function () {
              clearActiveColorSwatch();
              fillColor = hexToRgba(this.dataset.color);
              this.classList.add('active');
              }); 
            });

            
            document.getElementById("shapes").addEventListener("click", () => {
                clearActiveTool();
                tool = "shapes";
                document.getElementById("shapes").classList.add('active');
                toggleDropdown("shapes-dropdown");
            });


            document.getElementById("add-image").addEventListener("click", () => {
                document.getElementById("image-input").click();
            });

            document.getElementById("image-input").addEventListener("change", function () {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const img = new Image();
                        img.onload = function () {
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            saveDrawingAction();
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

            document.getElementById("undo").addEventListener("click", undo);
            document.getElementById("redo").addEventListener("click", redo);
            document.getElementById("clear").addEventListener("click", clearCanvas);

            document.getElementById("download").addEventListener("click", () => {
                // Save the current state of the canvas
                saveDrawingAction();
                // Temporarily draw a white background
                const tempCanvas = document.createElement("canvas");
                const tempCtx = tempCanvas.getContext("2d");
                // Set the size of the temporary canvas to match the whiteboard
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                // Fill the temporary canvas with white color
                tempCtx.fillStyle = "#FFFFFF";
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                // Draw the current content of the whiteboard on the temporary canvas
                tempCtx.drawImage(canvas, 0, 0);
                // Create a download link for the canvas data
                const dataURL = tempCanvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = dataURL;
                link.download = "whiteboard-drawing.png";
                link.click();
            });
            document.querySelectorAll(".color-swatch").forEach(swatch => {
                swatch.addEventListener("click", function () {
                    fillColor = hexToRgba(this.dataset.color);
                });
            });

            document.querySelectorAll(".dropdown-item").forEach(item => {
                item.addEventListener("click", function () {
                    shape = this.dataset.shape;
                    toggleDropdown("shapes-dropdown");
                });
            });

            function toggleDropdown(dropdownId) {
                const dropdown = document.getElementById(dropdownId);
                dropdown.classList.toggle("active");
            }

            function hexToRgba(hex) {
                let c;
                if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                    c = hex.substring(1).split("");
                    if (c.length === 3) {
                        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                    }
                    c = "0x" + c.join("");
                    return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 255];
                }
                throw new Error("Bad Hex");
            }

            function drawCircle(x1, y1, x2, y2) {
                const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                ctx.beginPath();
                ctx.arc(x1, y1, radius, 0, Math.PI * 2, false);
                ctx.stroke();
            }

            function drawSquare(x1, y1, x2, y2) {
                const side = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
                ctx.beginPath();
                ctx.rect(x1, y1, side, side);
                ctx.stroke();
            }

            function drawRectangle(x1, y1, x2, y2) {
                const width = x2 - x1;
                const height = y2 - y1;
                ctx.beginPath();
                ctx.rect(x1, y1, width, height);
                ctx.stroke();
            }

            function drawTriangle(x1, y1, x2, y2) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x1, y2);
                ctx.closePath();
                ctx.stroke();
            }
            function drawLine(x1, y1, x2, y2) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            function clearActiveColorSwatch() {
                document.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.classList.remove('active');
              });
            }



            function undo() {
                if (historyIndex > 0) {
                    historyIndex--;
                    ctx.putImageData(drawingHistory[historyIndex], 0, 0);
                }
            }

            function redo() {
                if (historyIndex < drawingHistory.length - 1) {
                    historyIndex++;
                    ctx.putImageData(drawingHistory[historyIndex], 0, 0);
                }
            }

            function clearCanvas() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                saveDrawingAction();
            }

            function floodFill(x, y, fillColor) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const targetColor = getColorAtPixel(imageData, x, y);
                if (!colorsMatch(targetColor, fillColor)) {
                    const stack = [[x, y]];
                    while (stack.length > 0) {
                        const [currentX, currentY] = stack.pop();
                        const currentColor = getColorAtPixel(imageData, currentX, currentY);
                        if (colorsMatch(currentColor, targetColor)) {
                            setColorAtPixel(imageData, currentX, currentY, fillColor);
                            stack.push([currentX + 1, currentY]);
                            stack.push([currentX - 1, currentY]);
                            stack.push([currentX, currentY + 1]);
                            stack.push([currentX, currentY - 1]);
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                }
            }

            function getColorAtPixel(imageData, x, y) {
                const index = (y * imageData.width + x) * 4;
                const data = imageData.data;
                return [data[index], data[index + 1], data[index + 2], data[index + 3]];
            }

            function setColorAtPixel(imageData, x, y, color) {
                const index = (y * imageData.width + x) * 4;
                const data = imageData.data;
                data[index] = color[0];
                data[index + 1] = color[1];
                data[index + 2] = color[2];
                data[index + 3] = color[3];
            }

            function colorsMatch(color1, color2) {
                return color1[0] === color2[0] &&
                       color1[1] === color2[1] &&
                       color1[2] === color2[2] &&
                       color1[3] === color2[3];
            }
        });
    </script>
</body>
</html>
