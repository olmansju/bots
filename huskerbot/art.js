var canvas = document.getElementById('c');

var context = canvas.getContext('2d');
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var radius = 70;

context.beginPath();
context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
context.fillStyle = 'black';
context.fill();
context.lineWidth = 5;
context.strokeStyle = '#be06c4';
context.stroke();

function makeCircle(event) {
    context.beginPath();
    let theXadjust = event.clientX - 10;
    let theYadjust = event.clientY - 25;
    context.arc(theXadjust, theYadjust, Math.floor(Math.random() * 40) + 10, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 4;
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    context.strokeStyle = "#" + randomColor;
    context.stroke();
    lookDirection("left");
    console.log("that's a circle at: ", event.clientX, event.clientY)
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    lookDirection("straight");
    console.log("clear button pushed");
}

const eleme = document.querySelector(".buttonArtClear");
eleme.addEventListener("click", clearCanvas);
//eleme.onclick = function() { clearCanvas(); }

var ele = document.getElementById('c');
ele.onclick = function() { makeCircle(event); }
// document.addEventListener("click", makeCircle);