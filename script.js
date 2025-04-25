const leftPanel = document.getElementById("left-panel");
const rightPanel = document.getElementById("right-panel");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let lineWidth = 1;
let padding = 5;
let xRadius = canvas.width / 2 - padding;
let yRadius = canvas.height / 2 - padding;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

const xMin = document.getElementById("x-min");
const xMax = document.getElementById("x-max");
const yMin = document.getElementById("y-min");
const yMax = document.getElementById("y-max");

const xTicks = document.getElementById("x-ticks");
const yTicks = document.getElementById("y-ticks");

const xAnnotate = document.getElementById("x-annotate-interval");
const yAnnotate = document.getElementById("y-annotate-interval");

const xLabel = document.getElementById("x-label");
const yLabel = document.getElementById("y-label");

/*
var xMinValue = -5;
xMin.addEventListener("change",(event) => {
    xMinValue = document.getElementById("xMin").value;
});

*/

adjustCanvasDimensions();
function adjustCanvasDimensions() {
    const min = Math.min(rightPanel.offsetWidth, rightPanel.offsetHeight - rightPanel.children[0].offsetHeight)
    canvas.width = min;
    canvas.height = min;
    declareCanvasVars();
    drawAxes();
}

window.addEventListener("resize", adjustCanvasDimensions);

function declareCanvasVars() {
    lineWidth = 1;
    padding = 5;
    xRadius = canvas.width / 2 - padding;
    yRadius = canvas.height / 2 - padding;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
}

function drawAxes() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    // const axesLength = 2 * Math.min(xRadius, yRadius);
    ctx.fillRect(centerX - xRadius, centerY, 2 * xRadius, lineWidth);
    ctx.fillRect(centerX, centerY - yRadius, lineWidth, 2 * yRadius);
    
    // draw arrows
    const arrowSize = canvas.width / 100;
    ctx.beginPath();
    ctx.moveTo(centerX + xRadius+.5, centerY+.5);
    ctx.lineTo(centerX + xRadius - arrowSize+.5, centerY - arrowSize+.5);
    ctx.lineTo(centerX + xRadius - arrowSize+.5, centerY + arrowSize+.5);
    ctx.fill();
    
    
    ctx.beginPath();
    ctx.moveTo(centerX - xRadius-.5, centerY+.5);
    ctx.lineTo(centerX - xRadius + arrowSize-.5, centerY - arrowSize+.5);
    ctx.lineTo(centerX - xRadius + arrowSize-.5, centerY + arrowSize+.5);
    ctx.fill();
    
    
    ctx.beginPath();
    ctx.moveTo(centerX+.5, centerY - yRadius-.5);
    ctx.lineTo(centerX - arrowSize+.5, centerY - yRadius + arrowSize-.5);
    ctx.lineTo(centerX + arrowSize+.5, centerY - yRadius + arrowSize-.5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + yRadius+.5);
    ctx.lineTo(centerX - arrowSize+.5, centerY + yRadius - arrowSize+.5);
    ctx.lineTo(centerX + arrowSize+.5, centerY + yRadius - arrowSize+.5);
    ctx.fill();
    
    console.log("arrow drawn");
}

function drawTicks() {
    const tickOffset = 5;
    
    const xTickInterval = parseInt(xTicks.value); // will get from x Tick Interval
    const yTickInterval = parseInt(yTicks.value);
    
    const xNumericRange = parseInt(xMax.value) - parseInt(xMin.value);
    const yNumericRange = parseInt(yMax.value) - parseInt(yMin.value);
    
    const xCanvasFrequency = xTickInterval / xNumericRange * 2 * (xRadius - tickOffset);
    const yCanvasFrequency = yTickInterval / yNumericRange * 2 * (yRadius - tickOffset);
    
    
}

// ctx.fillStyle = "green";
// ctx.fillRect(10, 10, 150, 100);

// ctx.beginPath();
// ctx.moveTo(75, 50);
// ctx.lineTo(100, 75);

// ctx.font = "12px Poppins";
// ctx.fillText("Hello world", 10, 50);
