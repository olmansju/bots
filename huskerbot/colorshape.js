
function setHex() {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    var tri = document.getElementById("triangle");
    tri.style.fill = "#" + randomColor;
    var randomColor2 = Math.floor(Math.random()*16777215).toString(16);
    var egg = document.getElementById("egg");
    egg.style.fill = "#" + randomColor2;
    var randomColor3 = Math.floor(Math.random()*16777215).toString(16);
    var mouth = document.getElementById("mouth");
    mouth.style.fill = "#" + randomColor3;
    var randomColor4 = Math.floor(Math.random()*16777215).toString(16);
    var circle = document.getElementById("circleC");
    circle.style.fill = "#" + randomColor4;
    var randomColor5 = Math.floor(Math.random()*16777215).toString(16);
    var square = document.getElementById("square");
    square.style.fill = "#" + randomColor5;

    lookDirection("dLeft");
    console.log(randomColor, randomColor2, randomColor3, randomColor4, randomColor5);
    return ;
}

document.getElementById("triangle").addEventListener("click", setHex);
