// Top-level UI
const leftPanel = document.getElementById("left-panel");
const rightPanel = document.getElementById("right-panel");

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Global variables
const lineWidth = 2;
const padding = 30;
const tickOffset = 15;
const dpr = window.devicePixelRatio;
let xRadius = canvas.width * dpr / 2 - padding;
let yRadius = canvas.height * dpr / 2 - padding;
let centerX = canvas.width * dpr / 2;
let centerY = canvas.height * dpr / 2;

// Global (mathematical) variables
let xAxisLocation = 0;
let yAxisLocation = 0;
let tickLength = 20;
let xTickLocations = [];
let yTickLocations = [];
let xAnnoFreq = 0;
let yAnnoFreq = 0;
let xTickInterval = 0;
let yTickInterval = 0;

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
const gridLinesCheckbox = document.getElementById("gridCheckbox");
const radianCheckboxX = document.getElementById("radianCheckboxX");
const radianCheckboxY = document.getElementById("radianCheckboxY");



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
    yMin.value = -yMax.value;
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
    const dpr = window.devicePixelRatio;
    canvas.width = (min - 8) * dpr;
    canvas.height = (min - 8) * dpr;
    canvas.style.width = `${min - 8}px`;
    canvas.style.height = `${min - 8}px`;
    declareCanvasVars();
    if (parseFloat(xMax.value) > parseFloat(xMin.value) && parseFloat(yMax.value) > parseFloat(yMin.value)) {
        // calculateTickLocations();
        drawAxes();
        // Only draw ticks if axes are drawn
        if (parseFloat(xTicks.value) > 0 && parseFloat(yTicks.value) > 0) {
            calculateTickLocations();
            if (gridLinesCheckbox.checked) drawBgGrid();
            drawTicks();
        }
        drawLabels();
    }
    if (arrowCheckbox.checked){
        drawArrows();
    }
}

function declareCanvasVars() {
    // lineWidth = 1;
    // padding = 5
    //padding = 15;
    const dpr = window.devicePixelRatio;
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
function drawAxes() {
    
    ctx.fillStyle = "rgb(0, 0, 0)";
    // X axis
    if (0 <= yMin.value) {
        // everything is positive, draw at bottom
        ctx.fillRect(centerX - xRadius, (yRadius - tickOffset) * 2 + tickOffset + padding + lineWidth / 2, 2 * (xRadius), lineWidth);
    } else if (yMax.value <= 0) {
        // everything is negative, draw at top
        ctx.fillRect(centerX - xRadius, tickOffset + padding + lineWidth / 2, 2 * (xRadius), lineWidth);
    } else {
        ctx.fillRect(centerX - xRadius, yMax.value * (yRadius - tickOffset) * 2 / (yMax.value - yMin.value) + tickOffset + padding - lineWidth / 2, 2 * (xRadius), lineWidth);
    }
    
    // Y axis
    if (0 <= xMin.value) {
        // positive, draw at left
        ctx.fillRect(tickOffset + padding - lineWidth / 2, centerY - yRadius, lineWidth, 2 * (yRadius));
    } else if (xMax.value <= 0) {
        // negative, draw at right
        ctx.fillRect((xRadius - tickOffset) * 2 + tickOffset + padding - lineWidth / 2, centerY - yRadius, lineWidth, 2 * (yRadius));
    } else {
        ctx.fillRect(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + tickOffset + padding - lineWidth / 2, centerY - yRadius, lineWidth, 2 * (yRadius));
    }
    //console.log("Y axis x: " + (-xMin.value * xRadius * 2 / (xMax.value - xMin.value)));
}

// Need to make sure that arrows align with the axes again
function drawArrows(){
    // draw arrows
    //const arrowSize = canvas.width / 100;
    const arrowSize = 10;
    
    // //Right arrow
    // ctx.beginPath();
    // ctx.moveTo(centerX + xRadius+.5, yMax.value * (yRadius -  15) * 2 / (yMax.value - yMin.value) +20 + .5);
    // ctx.lineTo(centerX + xRadius - arrowSize+.5, centerY - arrowSize+.5);
    // ctx.lineTo(centerX + xRadius - arrowSize+.5, centerY + arrowSize+.5);
    // ctx.fill();
    
    // Right arrow
    if (yMin.value >= 0) {
        // Right Arrow
        ctx.beginPath();
        ctx.moveTo(centerX + xRadius + arrowSize, 2 * centerY - padding - tickOffset);
        ctx.lineTo(centerX + xRadius, 2 * centerY - arrowSize - padding - tickOffset);
        ctx.lineTo(centerX + xRadius, 2 * centerY + arrowSize - padding - tickOffset);
        ctx.fill();
        // Left Arrow
        ctx.beginPath();
        ctx.moveTo(centerX - xRadius - arrowSize, 2 * centerY - tickOffset);
        ctx.lineTo(centerX - xRadius, 2 * centerY - arrowSize - tickOffset);
        ctx.lineTo(centerX - xRadius, 2 * centerY + arrowSize - tickOffset);
        ctx.fill();
    }
    else if (yMax.value <= 0) {
        // Right Arrow
        ctx.beginPath();
        ctx.moveTo(centerX + xRadius + arrowSize, centerY - yRadius + tickOffset);
        ctx.lineTo(centerX + xRadius, centerY - yRadius - arrowSize + tickOffset);
        ctx.lineTo(centerX + xRadius, centerY - yRadius + arrowSize + tickOffset);
        ctx.fill();
        // Left Arrow
        ctx.beginPath();
        ctx.moveTo(centerX - xRadius - arrowSize, centerY - yRadius + tickOffset);
        ctx.lineTo(centerX - xRadius, centerY - yRadius - arrowSize + tickOffset);
        ctx.lineTo(centerX - xRadius, centerY - yRadius + arrowSize + tickOffset);
        ctx.fill();
    }
    
    // yMax.value * (yRadius - tickOffset) * 2 / (yMax.value - yMin.value) + tickOffset + padding
    // 
    
    else {
        // Right Arrow
        ctx.beginPath();
        ctx.moveTo(centerX + xRadius + arrowSize, yMax.value * (yRadius - tickOffset) * 2 / (yMax.value - yMin.value) + tickOffset + padding);
        ctx.lineTo(centerX + xRadius, yMax.value * (yRadius -  tickOffset) * 2 / (yMax.value - yMin.value) - arrowSize + tickOffset + padding);
        ctx.lineTo(centerX + xRadius, yMax.value * (yRadius -  tickOffset) * 2 / (yMax.value - yMin.value) + arrowSize + tickOffset + padding);
        ctx.fill();
        // Left Arrow
        ctx.beginPath();
        ctx.moveTo(centerX - xRadius - arrowSize, yMax.value * (yRadius - tickOffset) * 2 / (yMax.value - yMin.value) + tickOffset + padding);
        ctx.lineTo(centerX - xRadius, yMax.value * (yRadius -  tickOffset) * 2 / (yMax.value - yMin.value) - arrowSize + tickOffset + padding);
        ctx.lineTo(centerX - xRadius, yMax.value * (yRadius -  tickOffset) * 2 / (yMax.value - yMin.value) + arrowSize + tickOffset + padding);
        ctx.fill();
        
        // // Right Arrow
        // ctx.beginPath();
        // ctx.moveTo(centerX + xRadius + arrowSize, yMax.value * (yRadius + padding - tickOffset) * 2 / (yMax.value - yMin.value) + tickOffset + padding);
        // ctx.lineTo(centerX + xRadius, yMax.value * (yRadius + padding - tickOffset) * 2 / (yMax.value - yMin.value) - arrowSize + tickOffset + padding);
        // ctx.lineTo(centerX + xRadius, yMax.value * (yRadius + padding - tickOffset) * 2 / (yMax.value - yMin.value) + arrowSize + tickOffset + padding);
        // ctx.fill();
        // // Left Arrow
        // ctx.beginPath();
        // ctx.moveTo(centerX - xRadius - arrowSize, yMax.value * (yRadius + padding) * 2 / (yMax.value - yMin.value));
        // ctx.lineTo(centerX - xRadius, yMax.value * (yRadius + padding) * 2 / (yMax.value - yMin.value) - arrowSize);
        // ctx.lineTo(centerX - xRadius, yMax.value * (yRadius + padding) * 2 / (yMax.value - yMin.value) + arrowSize);
        // ctx.fill();
    }
    
    
    
    if (xMin.value >= 0) {
        // Top Arrow
        ctx.beginPath();
        ctx.moveTo(centerX - xRadius + tickOffset, centerY - yRadius);
        ctx.lineTo(centerX - xRadius - arrowSize + tickOffset, centerY - yRadius + arrowSize + 0.5);
        ctx.lineTo(centerX - xRadius + arrowSize + tickOffset, centerY - yRadius + arrowSize + 0.5);
        ctx.fill();
        // Bottom Arrow
        ctx.beginPath();
        ctx.moveTo(centerX - xRadius + tickOffset, centerY + yRadius);
        ctx.lineTo(centerX - xRadius - arrowSize + tickOffset, centerY + yRadius - arrowSize);
        ctx.lineTo(centerX - xRadius + arrowSize + tickOffset, centerY + yRadius - arrowSize);
        ctx.fill();
    }
    
    else if (xMax.value <= 0) {
        // Top Arrow
        ctx.beginPath();
        ctx.moveTo(centerX + xRadius - tickOffset, centerY - yRadius);
        ctx.lineTo(centerX + xRadius - arrowSize - tickOffset, centerY - yRadius + arrowSize);
        ctx.lineTo(centerX + xRadius + arrowSize - tickOffset, centerY - yRadius + arrowSize);
        ctx.fill();
        // Bottom Arrow
        ctx.beginPath();
        ctx.moveTo(centerX + xRadius - tickOffset, centerY + yRadius);
        ctx.lineTo(centerX + xRadius - arrowSize - tickOffset, centerY + yRadius - arrowSize);
        ctx.lineTo(centerX + xRadius + arrowSize - tickOffset, centerY + yRadius - arrowSize);
        ctx.fill();
    }
    
    else {
        // Top arrow
        ctx.beginPath();
        ctx.moveTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + tickOffset + padding, centerY - yRadius);
        ctx.lineTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) - arrowSize + tickOffset + padding, centerY - yRadius + arrowSize);
        ctx.lineTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + arrowSize + tickOffset + padding, centerY - yRadius + arrowSize);
        ctx.fill();
        
        // Bottom arrow
        ctx.beginPath();
        ctx.moveTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + tickOffset + padding, centerY + yRadius);
        ctx.lineTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) - arrowSize + tickOffset + padding, centerY + yRadius - arrowSize);
        ctx.lineTo(-xMin.value * (xRadius - tickOffset) * 2 / (xMax.value - xMin.value) + arrowSize + tickOffset + padding, centerY + yRadius - arrowSize);
        ctx.fill();
    }
    
    console.log("arrows drawn");
}

function calculateTickLocations() {
    xTickInterval = parseFloat(xTicks.value);
    yTickInterval = parseFloat(yTicks.value);
    
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
        // alert("Please adjust the number of ticks as it is too much");
        // return;
    }
    
    xAxisLocation = 0; // this is a y value lmao
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

    yAxisLocation = 0; // this is a x-value
    if (0 <= parseFloat(xMin.value)) yAxisLocation = centerX - xTickBound; // left of page
    else if (parseFloat(xMax.value) <= 0) yAxisLocation = centerX + xTickBound; // right of page
    else {
        // zero is in between
        let mx = parseFloat(xMax.value);
        let mn = -parseFloat(xMin.value);
        
        let zeroProp = mn / (mx + mn);
        let range = 2 * xTickBound;
        yAxisLocation = centerX - xTickBound + zeroProp * range;
    }

    // function to easily scale the numerical value, to the location on canvas
    let scaleX = (a) => 
        (a - parseFloat(xMin.value)) / (parseFloat(xMax.value) - parseFloat(xMin.value)) 
        * 2 * xTickBound + (centerX - xTickBound);

    // Draws the ticks on the x axis
    let startX = Math.ceil(parseFloat(xMin.value) / xTickInterval) * xTickInterval;
    let endX = Math.min(parseFloat(xMax.value) / xTickInterval) * xTickInterval;
    xAnnoFreq = xAnnotateEvery * xTickInterval;
    xTickLocations = [];
    for (let curX = startX; curX <= endX; curX += xTickInterval) {
        let i = scaleX(curX);
        xTickLocations.push(i);
    }
    
    let scaleY = (a) => 
        (a - parseFloat(yMin.value)) / (parseFloat(yMax.value) - parseFloat(yMin.value)) 
        * -2 * yTickBound + (centerY + yTickBound);
    
    let startY = Math.ceil(parseFloat(yMin.value) / yTickInterval) * yTickInterval;
    let endY = Math.min(parseFloat(yMax.value) / yTickInterval) * yTickInterval;
    yAnnoFreq = yAnnotateEvery * yTickInterval;
    yTickLocations = [];
    for (let curY = startY; curY <= endY; curY += yTickInterval) {
        let i = scaleY(curY);
        yTickLocations.push(i);
    }
}

function gcd(a, b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    
    if (a == 0) return b;
    if (b == 0) return a;
    
    if (a < b) {
        let temp = a;
        a = b;
        b = temp;
    }
    return gcd(a % b, b);
}

// draws the ticks and the annotations
function drawTicks() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.strokeStyle = "rgb(0,0,0)";
    
    // calculateTickLocations();
    
    let xVal = Math.ceil(parseFloat(xMin.value) / xTickInterval) * xTickInterval;
    for (let curX = 0; curX < xTickLocations.length; curX += 1) {
        let i = xTickLocations[curX];
        if (xVal != 0) {
            // draw ticks
            ctx.beginPath();
            ctx.moveTo(i + 1, xAxisLocation - tickLength * 0.5);
            ctx.lineTo(i + 1, xAxisLocation + tickLength * 0.5);
            ctx.stroke();
            
            // draw labels
            let onAxis = Math.abs(i - yAxisLocation) <= 0.001;

            let residue = xVal / xAnnoFreq - Math.floor(xVal / xAnnoFreq);
            if (residue > 0.5) residue = 1 - residue;
            // console.log("residue at ", curX, ": ", residue);
            if (residue <= 0.001 && !onAxis) {
                ctx.textAlign = "center";
                ctx.font = (canvas.width * 0.05)+"px serif";
                if((canvas.width * 0.05)>=20){
                    ctx.font = "20px serif";
                }
                if (radianCheckboxX.checked) {
                    let numerator = Math.round(xVal * 1000);
                    let denominator = 1000;
                    let d = gcd(numerator, denominator);
                    numerator /= d;
                    denominator /= d;
                    numerator = Math.abs(numerator);
                    denominator = Math.abs(denominator);
                    let text = "";
                    if (numerator == 1 && denominator == 1) {
                        text = "π";
                    } else if (numerator == 1) {
                        text = "π/" + denominator;
                    } else if (denominator == 1) {
                        text = numerator + "π";
                    } else {
                        text = numerator + "π/" + denominator;
                    }
                    if (xVal < 0) text = "-" + text;
                    ctx.fillText(text, i, xAxisLocation - tickLength);
                } else {
                    ctx.fillText(Math.round(xVal * 1000) / 1000, i, xAxisLocation - tickLength);
                }
                // console.log("label drawn at ", curX);
            }
        }
        xVal += xTickInterval;
    }
    
    let yVal = Math.ceil(parseFloat(yMin.value) / yTickInterval) * yTickInterval;
    for (let curY = 0; curY < yTickLocations.length; curY += 1) {
        let i = yTickLocations[curY];
        if (yVal != 0) {
            // draw ticks
            ctx.beginPath();
            ctx.moveTo(yAxisLocation - tickLength * 0.5, i + 1);
            ctx.lineTo(yAxisLocation + tickLength * 0.5, i + 1);
            ctx.stroke();
            
            // draw labels
            let onAxis = Math.abs(i - xAxisLocation) <= 0.001;

            let residue = yVal / yAnnoFreq - Math.floor(yVal / yAnnoFreq);
            if (residue > 0.5) residue = 1 - residue;

            if (residue <= 0.001 && !onAxis) {
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                
                
                if (radianCheckboxY.checked) {
                    let numerator = Math.round(yVal * 1000);
                    let denominator = 1000;
                    let d = gcd(numerator, denominator);
                    numerator /= d;
                    denominator /= d;
                    let sign = numerator / Math.abs(numerator);
                    numerator = Math.abs(numerator);
                    denominator = Math.abs(denominator);
                    let text = "";
                    if (numerator == 1 && denominator == 1) {
                        text = "π";
                    } else if (numerator == 1) {
                        text = "π/" + denominator;
                    } else if (denominator == 1) {
                        text = numerator + "π";
                    } else {
                        text = numerator + "π/" + denominator;
                    }
                    if (yVal < 0) text = "-" + text;
                    ctx.fillText(text, yAxisLocation + tickLength, i);
                } else {
                    ctx.fillText(Math.round(yVal * 1000) / 1000, yAxisLocation + tickLength, i);
                }
            }
        }
        yVal += yTickInterval;
    }
}

// draw background grid
function drawBgGrid() {
    for (let i = 0; i < xTickLocations.length; i++) {
        if (xTickLocations[i] == yAxisLocation) continue;
        ctx.strokeStyle = "rgb(180,180,180)";
        ctx.beginPath();
        ctx.moveTo(xTickLocations[i], (0 + padding + tickOffset));
        ctx.lineTo(xTickLocations[i] + lineWidth / 2, (canvas.height - padding - tickOffset));
        ctx.stroke();
    }
    
    for (let j = 0; j < yTickLocations.length; j++) {
        if (yTickLocations[j] == xAxisLocation) continue;
        ctx.strokeStyle = "rgb(180,180,180)";
        ctx.beginPath();
        ctx.moveTo((0 + padding + tickOffset), yTickLocations[j]);
        ctx.lineTo((canvas.width - padding - tickOffset), yTickLocations[j] + lineWidth / 2);
        ctx.stroke();
    }
}

// draw the labels of the axes (i.e. time, height)
function drawLabels() {
    ctx.fillStyle = "rgb(0,0,0)";
    // axes are at xAxisLocation, yAxisLocation
    ctx.font = "16px serif";
    ctx.textAlign = "right";
    ctx.fillText(xLabel.value, centerX + xRadius, xAxisLocation + tickLength);
    ctx.textAlign = "left";
    //ctx.fillText(yLabel.value, yAxisLocation + tickLength, centerY - yRadius + 10);
    if(xMax.value<=0){
        ctx.fillText(yLabel.value, yAxisLocation -  7.5*yLabel.value.length, centerY - yRadius);
    }else{
        ctx.fillText(yLabel.value, yAxisLocation + tickLength, centerY - yRadius);
    }
}
