// Top-level UI
const leftPanel = document.getElementById("left-panel");
const rightPanel = document.getElementById("right-panel");

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Global variables
const lineWidth = 1;
const padding = 5;
const tickOffset = 15;
let xRadius = canvas.width / 2 - padding;
let yRadius = canvas.height / 2 - padding;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

// Inputs
const xMin = document.getElementById("x-min");
const xMax = document.getElementById("x-max");
const yMin = document.getElementById("y-min");
const yMax = document.getElementById("y-max");

const quadrant1Btn = document.getElementById("quadrant1Btn");
const quadrant14Btn = document.getElementById("quadrant14Btn");


const xTicks = document.getElementById("x-ticks");
const yTicks = document.getElementById("y-ticks");

const xAnnotate = document.getElementById("x-annotate-interval");
const yAnnotate = document.getElementById("y-annotate-interval");

const xLabel = document.getElementById("x-label");
const yLabel = document.getElementById("y-label");

const arrowCheckbox = document.getElementById("arrowCheckbox");
const radianCheckbox = document.getElementById("radianCheckbox");



// Event listeners
document.querySelectorAll("input").forEach((elem) => elem.addEventListener("input", update));
// document.querySelectorAll("input[min=\"1\"]")
window.addEventListener("resize", update);
quadrant1Btn.addEventListener("click", function(){
    xMin.value = "-1";
    yMin.value = "-1";
    update();
});
quadrant14Btn.addEventListener("click", function(){
    xMin.value = "-1";
    yMin.value = -1*yMax.value;
    update();
});

// Function
update();
function update() {
    if (parseFloat(xTicks.value) < 0) xTicks.value = "1";
    if (parseFloat(yTicks.value) < 0) yTicks.value = "1";
    if (parseFloat(xAnnotate.value) < 0) xAnnotate.value = "1";
    if (parseFloat(yAnnotate.value) < 0) yAnnotate.value = "1";
    
    const min = Math.min(rightPanel.offsetWidth, rightPanel.offsetHeight - rightPanel.children[0].offsetHeight)
    canvas.width = min - 8;
    canvas.height = min - 8;
    declareCanvasVars();
    if (parseFloat(xMax.value) > parseFloat(xMin.value) && parseFloat(yMax.value) > parseFloat(yMin.value)) {
        drawAxes();
        // Only draw ticks if axes are drawn
        if (parseFloat(xTicks.value) > 0 && parseFloat(yTicks.value) > 0) drawTicks();
    }
    if (arrowCheckbox.checked){
        drawArrows();
    }
}

function declareCanvasVars() {
    // lineWidth = 1;
    // padding = 5
    //padding = 15;
    xRadius = canvas.width / 2 - padding;
    yRadius = canvas.height / 2 - padding;
    // xRadius = canvas.width / 2
    // yRadius = canvas.height / 2
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
}

// Draws the axes in the center of the graph
// function drawAxes() {
//     ctx.fillStyle = "rgb(0, 0, 0)";
//     // const axesLength = 2 * Math.min(xRadius, yRadius);
//     ctx.fillRect(centerX - xRadius, centerY, 2 * xRadius, lineWidth);
//     console.log("X axis x: " + (centerX - xRadius));
//     console.log("X axis y: " + centerY);

//     ctx.fillRect(centerX, centerY - yRadius, lineWidth, 2 * yRadius);
//     console.log("Y axis x: " + centerX);
//     console.log("Y axis y: " + (centerY - yRadius));

// }


// Draws the axes dependent on the bounds of the graph
// Will also draw the labels of the axes
function drawAxes() {
    
    ctx.fillStyle = "rgb(0, 0, 0)";
    // X axis
    if (0 <= yMin.value) {
        // everything is positive, draw at bottom
        ctx.fillRect(centerX - xRadius, (yRadius - tickOffset) * 2 + tickOffset + padding, 2 * (xRadius), lineWidth);
    } else if (yMax.value <= 0) {
        // everything is negative, draw at top
        ctx.fillRect(centerX - xRadius, tickOffset + padding, 2 * (xRadius), lineWidth);
    } else {
        ctx.fillRect(centerX - xRadius, yMax.value * (yRadius - tickOffset) * 2 / (yMax.value - yMin.value) + tickOffset + padding, 2 * (xRadius), lineWidth);
    }
    
    // Y axis
    if (0 <= xMin.value) {
        // positive, draw at left
        ctx.fillRect(tickOffset + padding, centerY - yRadius, lineWidth, 2 * (yRadius));
    } else if (xMax.value <= 0) {
        // negative, draw at right
        ctx.fillRect((xRadius - tickOffset) * 2 + tickOffset + padding, centerY - yRadius, lineWidth, 2 * (yRadius));
    } else {
        ctx.fillRect(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + tickOffset + padding, centerY - yRadius, lineWidth, 2 * (yRadius));
    }
    //console.log("Y axis x: " + (-xMin.value * xRadius * 2 / (xMax.value - xMin.value)));
}

// Need to make sure that arrows align with the axes again
function drawArrows(){
    // draw arrows
    const arrowSize = canvas.width / 100;
    
    // Right arrow
    // ctx.beginPath();
    // ctx.moveTo(centerX + xRadius+.5, yMax.value * (yRadius -  15) * 2 / (yMax.value - yMin.value) +20 + .5);
    // ctx.lineTo(centerX + xRadius - arrowSize+.5, centerY - arrowSize+.5);
    // ctx.lineTo(centerX + xRadius - arrowSize+.5, centerY + arrowSize+.5);
    // ctx.fill();
    ctx.beginPath();
    ctx.moveTo(centerX + xRadius+.5, yMax.value * (yRadius - 15) * 2 / (yMax.value - yMin.value) + 20 + .5);
    ctx.lineTo(centerX + xRadius - arrowSize+.5, yMax.value * (yRadius -  15) * 2 / (yMax.value - yMin.value) - arrowSize + 20 + .5);
    ctx.lineTo(centerX + xRadius - arrowSize+.5, yMax.value * (yRadius -  15) * 2 / (yMax.value - yMin.value) + arrowSize + 20 + .5);
    ctx.fill();
    
    // Left arrow
    ctx.beginPath();
    ctx.moveTo(centerX - xRadius-.5, yMax.value * (yRadius - 15) * 2 / (yMax.value - yMin.value) + 20 + .5);
    ctx.lineTo(centerX - xRadius + arrowSize-.5, yMax.value * (yRadius -  15) * 2 / (yMax.value - yMin.value) - arrowSize + 20 + .5);
    ctx.lineTo(centerX - xRadius + arrowSize-.5, yMax.value * (yRadius -  15) * 2 / (yMax.value - yMin.value) + arrowSize + 20 + .5);
    ctx.fill();
    
    // Top arrow
    ctx.beginPath();
    ctx.moveTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + 20 +.5, centerY - yRadius-.5);
    ctx.lineTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) - arrowSize + 20 +.5, centerY - yRadius + arrowSize-.5);
    ctx.lineTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + arrowSize + 20 +.5, centerY - yRadius + arrowSize-.5);
    ctx.fill();
    
    // Bottom arrow
    ctx.beginPath();
    ctx.moveTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + 20 +.5, centerY + yRadius+.5);
    ctx.lineTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) - arrowSize + 20 +.5, centerY + yRadius - arrowSize+.5);
    ctx.lineTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + arrowSize + 20 +.5, centerY + yRadius - arrowSize+.5);
    ctx.fill();
    
    console.log("arrow drawn");
}

// draws the ticks and the labels
function drawTicks() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    
    const xTickInterval = parseFloat(xTicks.value);
    const yTickInterval = parseFloat(yTicks.value);
    
    const xNumericRange = parseFloat(xMax.value) - parseFloat(xMin.value);
    const yNumericRange = parseFloat(yMax.value) - parseFloat(yMin.value);
    
    let xTickBound = xRadius - tickOffset; // basically, since we want a little padding to not go to the end of the axis
    let yTickBound = yRadius - tickOffset;
    
    const xCanvasFrequency = Math.floor((xTickInterval / xNumericRange) * 2 * xTickBound);
    const yCanvasFrequency = Math.floor((yTickInterval / yNumericRange) * 2 * yTickBound);
    
    const xAnnotateEvery = parseInt(xAnnotate.value);
    const yAnnotateEvery = parseInt(yAnnotate.value);
    
    // error check for number of ticks
    if (xNumericRange / xTickInterval >= 25 || yNumericRange / yTickInterval >= 25) {
        alert("Please adjust the number of ticks as it is too much");
    }
    
    let xAxisLocation = 0; // this is a y value lmao
    if (0 <= yMin.value) xAxisLocation = centerY + yTickBound; // everything is positive, position bottom
    else if (yMax.value <= 0) xAxisLocation = centerY - yTickBound; // everything nevative, position top
    else {
        // zero is in between
        let mx = parseFloat(yMax.value);
        let mn = -parseFloat(yMin.value);
        
        let zeroProp = mn / (mx + mn);
        let range = 2 * yTickBound;
        xAxisLocation = centerY + yTickBound - zeroProp * range;
    }
    console.log("xAxisLocation", xAxisLocation);
    
    let yAxisLocation = 0; // this is a x-value
    if (0 <= parseFloat(xMin.value)) yAxisLocation = centerX - xTickBound; // left of page
    else if (parseFloat(xMax.value) <= 0) yAxisLocation = centerX + xTickBound; // right of page
    else {
        // zero is in between
        let mx = parseFloat(xMax.value);
        let mn = -parseFloat(xMin.value);
        
        let zeroProp = mn / (mx + mn);
        let range = 2 * xTickBound;
        yAxisLocation = centerX - xTickBound + zeroProp * range;
        console.log("y axis on screen");
    }
    console.log("yAxisLocation", yAxisLocation);
    
    // function to easily scale the numerical value, to the location on canvas
    let scale = (a) => 
        (a - parseFloat(xMin.value)) / (parseFloat(xMax.value) - parseFloat(xMin.value)) 
        * 2 * xTickBound + (centerX - xTickBound);
    console.log("scale min", scale(parseFloat(xMin.value)), "centerX - xTickBound)", centerX - xTickBound);
    
    // Draws the ticks on the x axis
    let startX = Math.ceil(parseFloat(xMin.value) / xTickInterval) * xTickInterval;
    let endX = Math.min(parseFloat(xMax.value) / xTickInterval) * xTickInterval;
    let xAnnoFreq = xAnnotateEvery * xTickInterval;
    for (let curX = startX; curX <= endX; curX += 1) {
        let i = scale(curX);
        if (curX != 0) {
            // draw ticks
            let tickLength = 20;
            ctx.beginPath();
            ctx.moveTo(i, xAxisLocation - tickLength * 0.5);
            ctx.lineTo(i, xAxisLocation + tickLength * 0.5);
            ctx.stroke();
            
            // draw labels
            let onAxis = Math.abs(i - yAxisLocation) <= 0.001;

            let residue = curX / xAnnoFreq - Math.floor(curX / xAnnoFreq);
            if (residue <= 0.001 && !onAxis) {
                ctx.font = "16px serif";
                ctx.fillText(curX, i, xAxisLocation - tickLength);
                ctx.textAlign = "center";
                console.log("label drawn at ", curX);
            }
        }
        if (curX == endX) break;
        curX += xTickInterval;
    }
    
    let curY = parseFloat(yMin.value);
    let yAnnoFreq = yAnnotateEvery * yTickInterval;
    // Draws the ticks on the y axis
    for (let i = (centerY + yTickBound); i >= (centerY - yTickBound); i -= yCanvasFrequency) {
        if (curY != 0) {
            // draw ticks
            let tickLength = 20;
            ctx.beginPath();
            ctx.moveTo(yAxisLocation - tickLength * 0.5, i);
            ctx.lineTo(yAxisLocation + tickLength * 0.5, i);
            ctx.stroke();
            
            // draw labels
            let onAxis = Math.abs(i -xAxisLocation) <= 0.001;

            let residue = curY / yAnnoFreq - Math.floor(curY / yAnnoFreq);
            if (residue <= 0.001 && !onAxis) {
                ctx.font = "16px serif";
                ctx.fillText(curY, yAxisLocation + tickLength, i);
                ctx.textAlign = "center";
            }
        }
        curY += yTickInterval;
    }
}

// ctx.fillStyle = "green";
// ctx.fillRect(10, 10, 150, 100);

// ctx.beginPath();
// ctx.moveTo(75, 50);
// ctx.lineTo(100, 75);

// ctx.font = "12px Poppins";
// ctx.fillText("Hello world", 10, 50);