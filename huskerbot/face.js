var ellipse = document.getElementsByTagName("ellipse")[1];
var centerX = ellipse.getAttribute("cx");
var centerY = ellipse.getAttribute("cy");

const el = document.getElementById("facebox");

var fillColor = "Gray"

console.log(ellipse, document.getElementById("dialog").innerHTML);

facebox.addEventListener("click", function(event) {
    if (fillColor=="Gray") {
        console.log(ellipse, "clickEvent triggered stroke is Gray should go to blue", dialog.innerHTML);
        ellipse.setAttribute("stroke", "Blue");
        fillColor = "Blue";
        var b = document.getElementById("mouth");
        b.setAttribute("ry", 18);
        lookDirection("straight"); 
    } else {
        console.log(ellipse, "clickEvent triggered stroke is Blue should go to Gray", dialog.innerHTML);
        ellipse.setAttribute("stroke", "Gray");
        fillColor = "Gray"
        var b = document.getElementById("mouth");
        b.setAttribute("ry", 30);
        lookDirection("straight");
    }
});

function setPupil(id, cx, cy){
    var a = document.getElementById(id);
    a.setAttribute("cx", cx);
    a.setAttribute("cy", cy);
}

function lookDirection(di) {
    console.log(di);
    switch(di){
        case 'left':
            setPupil('pupil', 55, -50);
            setPupil('pupil2', -65, -50);
            break;
        case 'dLeft':
            setPupil('pupil', 55, -45);
            setPupil('pupil2', -65, -45);
            break;
        case 'right':
            setPupil('pupil', 65, -50);
            setPupil('pupil2', -55, -50);
            break;
        case 'dRight':
            setPupil('pupil', 65, -45);
            setPupil('pupil2', -55, -45);
            break;
        case 'straight':
            setPupil('pupil', 60, -50);
            setPupil('pupil2', -60, -50);
            break;
        case 'up':
            setPupil('pupil', 60, -55);
            setPupil('pupil2', -60, -55);
            break;
        case 'down':
            setPupil('pupil', 60, -45);
            setPupil('pupil2', -60, -45);
            break;
    }
}