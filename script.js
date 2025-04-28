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

const arrowCheckbox = document.getElementById("arrowCheckbox");
const radianCheckbox = document.getElementById("radianCheckbox");


// document.body.addEventListener("keypress", update);
// document.body.addEventListener("click", update);
document.querySelectorAll("input").forEach((elem) => elem.addEventListener("change", update));
window.addEventListener("resize", update);

update();
function update() {
    const min = Math.min(rightPanel.offsetWidth, rightPanel.offsetHeight - rightPanel.children[0].offsetHeight)
    canvas.width = min;
    canvas.height = min;
    declareCanvasVars();
    drawAxes();
    drawTicks();
    if (arrowCheckbox.checked){
        drawArrows();
    }
}

function declareCanvasVars() {
    lineWidth = 1;
    padding = 5;
    xRadius = canvas.width / 2 - padding;
    yRadius = canvas.height / 2 - padding;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
}

// function drawAxes() {
//     ctx.fillStyle = "rgb(0, 0, 0)";
//     // const axesLength = 2 * Math.min(xRadius, yRadius);
//     ctx.fillRect(centerX - xRadius, centerY, 2 * xRadius, lineWidth);
//     ctx.fillRect(centerX, centerY - yRadius, lineWidth, 2 * yRadius);
// }

function drawAxes() {
    ctx.fill = "rbg(0, 0, 0)";
    
    // X axis
    ctx.fillRect(centerX - xRadius, xMax * xRadius * 2 / (xMax - xMin), 2 * xRadius, lineWidth);
    
    // Y axis
    ctx.fillRect(yMax * yRadius * 2 / (yMax - yMin), centerY - yRadius, lineWidth, 2 * yRadius);
}

function drawArrows(){
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
    ctx.fillStyle = "rgb(0, 0, 0)";

    const tickOffset = 15; // because don't draw ticks too close to the end
    
    const xTickInterval = parseInt(xTicks.value); // will get from x Tick Interval
    const yTickInterval = parseInt(yTicks.value);
    
    const xNumericRange = parseInt(xMax.value) - parseInt(xMin.value);
    const yNumericRange = parseInt(yMax.value) - parseInt(yMin.value);
    
    const xCanvasFrequency = (xTickInterval / xNumericRange) * 2 * (xRadius - tickOffset);
    const yCanvasFrequency = (yTickInterval / yNumericRange) * 2 * (yRadius - tickOffset);
    
    let curX = parseInt(xMin.value);
    
    let xAxisLocation = 0; // this is a y value lmao
    if (0 <= yMin) xAxisLocation = centerY + yRadius - tickOffset; // bottom of page
    if (yMax <= 0) xAxisLocation = centerY - yRadius + tickOffset; // top of page
    
    let dummyYMark = parseInt(yMax.value); // top to bottom is max to min
    for (let i = (centerY - yRadius + tickOffset); i <= (centerY + yRadius - tickOffset); i += yCanvasFrequency) {
        if (dummyYMark == 0) {
            xAxisLocation = i;
            break;
        }
        dummyYMark -= 1;
    }
    
    for (let i = (centerX - xRadius + tickOffset); i <= (centerX + xRadius - tickOffset); i += xCanvasFrequency) {
        // draw ticks
        let tickLength = 20;
        ctx.beginPath();
        ctx.moveTo(i, xAxisLocation - tickLength * 0.5);
        ctx.lineTo(i, xAxisLocation + tickLength * 0.5);
        ctx.stroke();
        // console.log("drew x tick at", i, "y-coordinate", centerY - tickLength * 0.5);
        
        // draw labels
        ctx.font = "16px serif";
        ctx.fillText(curX, i, xAxisLocation - tickLength);
        curX += 1;
    }
    
    let yAxisLocation = 0; // this is a y value lmao
    if (0 <= xMin) yAxisLocation = centerX - xRadius + tickOffset; // left of page
    if (xMax <= 0) yAxisLocation = centerX + xRadius - tickOffset; // right of page
    
    let dummyXMark = parseInt(xMin.value); // top to bottom is max to min
    for (let i = (centerX - xRadius + tickOffset); i <= (centerX + xRadius - tickOffset); i += xCanvasFrequency) {
        if (dummyXMark == 0) {
            yAxisLocation = i;
            break;
        }
        dummyXMark += 1;
    }
    let curY = parseInt(yMax.value);
    for (let i = (centerY - yRadius + tickOffset); i <= (centerY + yRadius - tickOffset); i += yCanvasFrequency) {
        // draw ticks
        let tickLength = 20;
        ctx.beginPath();
        ctx.moveTo(yAxisLocation - tickLength * 0.5, i);
        ctx.lineTo(yAxisLocation + tickLength * 0.5, i);
        ctx.stroke();
        
        // draw labels
        ctx.font = "16px serif";
        ctx.fillText(curY, yAxisLocation + tickLength, i);
        curY -= 1;
    }
}

// ctx.fillStyle = "green";
// ctx.fillRect(10, 10, 150, 100);

// ctx.beginPath();
// ctx.moveTo(75, 50);
// ctx.lineTo(100, 75);

// ctx.font = "12px Poppins";
// ctx.fillText("Hello world", 10, 50);