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
        </style>
    </head>
    <body>
        <div
            class="card items-center mx-auto max-w-screen-xl lg:grid overflow-hidden rounded-lg"
        >
            <!-- Navigation bar -->
            <div class="nav-bar bg-gray-200 p-2 flex items-center">
                <button id="pencil" class="tool-btn"
                    ><img src="/src/images/pencil.png" alt="" /></button
                >
                <div class="relative">
                    <button id="eraser" class="tool-btn"
                        ><img src="/src/images/eraser.png" alt="" /><span
                            class="dropdown-arrow"
                        ></span></button
                    >
                    <div id="eraser-width-dropdown" class="dropdown">
                        <div class="dropdown-item" data-width="5">5px</div>
                        <div class="dropdown-item" data-width="10">10px</div>
                        <div class="dropdown-item" data-width="15">15px</div>
                        <div class="dropdown-item" data-width="20">20px</div>
                    </div>
                </div>

                <div class="relative">
                    <button id="fill" class="tool-btn"
                        ><img src="/src/images/paint-bucket.png" alt="" /><span
                            class="dropdown-arrow"
                        ></span></button
                    >
                    <div id="color-palette-dropdown" class="dropdown">
                        <div class="color-palette">
                            <div
                                class="color-swatch"
                                data-color="#FF0000"
                                style="background-color: #FF0000;"
                            ></div>
                            <div
                                class="color-swatch"
                                data-color="#00FF00"
                                style="background-color: #00FF00;"
                            ></div>
                            <div
                                class="color-swatch"
                                data-color="#0000FF"
                                style="background-color: #0000FF;"
                            ></div>
                            <div
                                class="color-swatch"
                                data-color="#FFFF00"
                                style="background-color: #FFFF00;"
                            ></div>
                            <div
                                class="color-swatch"
                                data-color="#FF00FF"
                                style="background-color: #FF00FF;"
                            ></div>
                            <div
                                class="color-swatch"
                                data-color="#00FFFF"
                                style="background-color: #00FFFF;"
                            ></div>
                            <div
                                class="color-swatch"
                                data-color="#000000"
                                style="background-color: #000000;"
                            ></div>
                            <div
                                class="color-swatch"
                                data-color="#FFFFFF"
                                style="background-color: #FFFFFF;"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <button id="shapes" class="tool-btn"
                        ><img src="/src/images/shapes.png" alt="" /><span
                            class="dropdown-arrow"
                        ></span></button
                    >
                    <div id="shapes-dropdown" class="dropdown">
                        <div class="dropdown-item" data-shape="circle">
                            Circle
                        </div>
                        <div class="dropdown-item" data-shape="square">
                            Square
                        </div>
                        <div class="dropdown-item" data-shape="line">Line</div>
                    </div>
                </div>
                <button id="undo" class="tool-btn"
                    ><img src="/src/images/undo.png" alt="" /></button
                >
                <button id="redo" class="tool-btn"
                    ><img src="/src/images/redo.png" alt="" /></button
                >
                <button id="clear" class="tool-btn"
                    ><img
                        src="/src/images/clear.png"
                        alt="Clear Canvas"
                    /></button
                >
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
                            ctx.putImageData(
                                drawingHistory[historyIndex],
                                0,
                                0
                            );
                        }
                        switch (shape) {
                            case "circle":
                                drawCircle(
                                    startX,
                                    startY,
                                    e.offsetX,
                                    e.offsetY
                                );
                                break;
                            case "square":
                                drawSquare(
                                    startX,
                                    startY,
                                    e.offsetX,
                                    e.offsetY
                                );
                                break;
                            case "line":
                                drawLine(startX, startY, e.offsetX, e.offsetY);
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
                        drawingHistory = drawingHistory.slice(
                            0,
                            historyIndex + 1
                        );
                    }
                    drawingHistory.push(
                        ctx.getImageData(0, 0, canvas.width, canvas.height)
                    );
                    historyIndex++;
                }

                function undoDrawing() {
                    if (historyIndex > 0) {
                        historyIndex--;
                        ctx.putImageData(drawingHistory[historyIndex], 0, 0);
                    }
                }

                function redoDrawing() {
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
                    const imageData = ctx.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    const data = imageData.data;
                    const targetColor = getColorAtPixel(data, x, y);

                    if (colorsMatch(targetColor, fillColor)) return;

                    const stack = [[x, y]];

                    while (stack.length) {
                        const [currentX, currentY] = stack.pop();
                        const currentPos =
                            (currentY * canvas.width + currentX) * 4;

                        if (
                            !colorsMatch(
                                getColorAtPixel(data, currentX, currentY),
                                targetColor
                            )
                        )
                            continue;

                        setColorAtPixel(data, currentX, currentY, fillColor);

                        stack.push([currentX + 1, currentY]);
                        stack.push([currentX - 1, currentY]);
                        stack.push([currentX, currentY + 1]);
                        stack.push([currentX, currentY - 1]);
                    }

                    ctx.putImageData(imageData, 0, 0);
                    saveDrawingAction();
                }

                function getColorAtPixel(data, x, y) {
                    const pos = (y * canvas.width + x) * 4;
                    return [
                        data[pos],
                        data[pos + 1],
                        data[pos + 2],
                        data[pos + 3],
                    ];
                }

                function setColorAtPixel(data, x, y, color) {
                    const pos = (y * canvas.width + x) * 4;
                    [data[pos], data[pos + 1], data[pos + 2], data[pos + 3]] =
                        color;
                }

                function colorsMatch(color1, color2) {
                    return (
                        color1[0] === color2[0] &&
                        color1[1] === color2[1] &&
                        color1[2] === color2[2] &&
                        color1[3] === color2[3]
                    );
                }

                function activateTool(newTool) {
                    tool = newTool;
                    canvas.style.cursor =
                        tool === "eraser"
                            ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23ffffff'%3E%3Cpath fill-rule='evenodd' d='M5 13V6h10v7H5zm11 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5h12zM7 8v2h6V8H7z' clip-rule='evenodd'/%3E%3C/svg%3E\") 14 14, auto"
                            : "crosshair";
                    hideDropdowns();
                }

                function toggleDropdown(dropdown) {
                    const isActive = dropdown.classList.toggle("active");
                    dropdown.parentElement
                        .querySelector(".dropdown-arrow")
                        .classList.toggle("active", isActive);
                }

                function drawCircle(x1, y1, x2, y2) {
                    const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    ctx.beginPath();
                    ctx.arc(x1, y1, radius, 0, Math.PI * 2);
                    ctx.stroke();
                }

                function drawSquare(x1, y1, x2, y2) {
                    const side = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
                    ctx.strokeRect(x1, y1, side, side);
                }

                function drawLine(x1, y1, x2, y2) {
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }

                canvas.addEventListener("mousedown", startDrawing);
                canvas.addEventListener("mousemove", draw);
                canvas.addEventListener("mouseup", stopDrawing);
                canvas.addEventListener("mouseout", stopDrawing);

                document
                    .getElementById("pencil")
                    .addEventListener("click", () => activateTool("pencil"));
                document
                    .getElementById("eraser")
                    .addEventListener("click", () => {
                        activateTool(tool === "eraser" ? "pencil" : "eraser");
                        toggleDropdown(
                            document.getElementById("eraser-width-dropdown")
                        );
                    });

                document.querySelectorAll(".dropdown-item").forEach((item) => {
                    item.addEventListener("click", function () {
                        eraserSize = parseInt(this.getAttribute("data-width"));
                        hideDropdowns();
                    });
                });

                document
                    .getElementById("fill")
                    .addEventListener("click", () => {
                        activateTool("fill");
                        toggleDropdown(
                            document.getElementById("color-palette-dropdown")
                        );
                    });

                document.querySelectorAll(".color-swatch").forEach((swatch) => {
                    swatch.addEventListener("click", function () {
                        const color = this.getAttribute("data-color");
                        const [r, g, b] = hexToRgb(color);
                        fillColor = [r, g, b, 255];
                        hideDropdowns();
                    });
                });

                document
                    .getElementById("shapes")
                    .addEventListener("click", () => {
                        activateTool("shapes");
                        toggleDropdown(
                            document.getElementById("shapes-dropdown")
                        );
                    });

                document
                    .querySelectorAll("#shapes-dropdown .dropdown-item")
                    .forEach((item) => {
                        item.addEventListener("click", function () {
                            shape = this.getAttribute("data-shape");
                            hideDropdowns();
                        });
                    });

                document
                    .getElementById("undo")
                    .addEventListener("click", () => undoDrawing());
                document
                    .getElementById("redo")
                    .addEventListener("click", () => redoDrawing());
                document
                    .getElementById("clear")
                    .addEventListener("click", () => clearCanvas());

                canvas.addEventListener("click", function (e) {
                    if (tool === "fill") {
                        floodFill(e.offsetX, e.offsetY, fillColor);
                    }
                });

                function hideDropdowns() {
                    document
                        .querySelectorAll(".dropdown")
                        .forEach((dropdown) =>
                            dropdown.classList.remove("active")
                        );
                    document
                        .querySelectorAll(".dropdown-arrow")
                        .forEach((arrow) => arrow.classList.remove("active"));
                }

                function hexToRgb(hex) {
                    const bigint = parseInt(hex.slice(1), 16);
                    const r = (bigint >> 16) & 255;
                    const g = (bigint >> 8) & 255;
                    const b = bigint & 255;
                    return [r, g, b];
                }

                saveDrawingAction();
            });
        </script>
    </body>
</html>
