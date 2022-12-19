document.getElementById("buttonChat").addEventListener("click", getChatResponse);
document.getElementById("chatInput").addEventListener("click", watchMe);

const transcriptArray = [];

function getChatResponse() {
    var responseText;
    responseText = document.getElementById("chatInput").value;
    if (responseText !== "") {
        transcriptArray.push(responseText);
        console.log('chat transcript: ', responseText);
        document.getElementById("chatInput").value = "";
        buildTranscript();
    }
}

function buildTranscript() {
    if (transcriptArray.length > 1 && transcriptArray.length < 10) {
        document.getElementById("transcript").innerHTML = transcriptArray.join('<br>');
    } else if (transcriptArray.length > 9) {
        document.getElementById("transcript").innerHTML = transcriptArray.slice(-9).join('<br>');
    } else {
        document.getElementById("transcript").innerHTML = transcriptArray.toString();
    }
    lookDirection("straight");
}

var textReady = document.getElementById("chatInput");
textReady.addEventListener("keydown", function (ee) {
    if (ee.key === "Enter"){
        getChatResponse();
        console.log("Enter pressed in chat")
    }
});

function watchMe(){
    lookDirection("down");
}
