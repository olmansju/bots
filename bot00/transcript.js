
const transcriptArray = [];
const botName = "Bot00";
let userName = "user";

document.getElementById("buttonChat").addEventListener("click", getChatResponse);

function getChatResponse() {
    let responseText;
    console.log(userName);
    responseText = document.getElementById("chatInput").value;
    if (responseText !== "") {
        transcriptArray.push([userName, responseText]);
        console.log('chat transcript: ', [userName, responseText]);
        document.getElementById("chatInput").value = "";
        buildTranscript();
        document.getElementById("chatInput").disabled = true;
        botResponse();
    }
}

async function botResponse(){
    setTimeout(baselineBotResponse, 1400);
}

function baselineBotResponse(){
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    let responseGiven = `My mouth is the hex color #${randomColor}!`;
    transcriptArray.push([botName, responseGiven]);
    console.log('bot response: ', responseGiven);
    document.getElementById("chatInput").focus();
    document.getElementById("mouth").style.fill = `#${randomColor}`;
    buildTranscript();
    document.getElementById("chatInput").disabled = false;
}

function buildTranscript() {
    if (transcriptArray.length > 1 && transcriptArray.length < 7) {
        formatTranscript(transcriptArray, "transcript");
    } else if (transcriptArray.length > 6) {
        formatTranscript(transcriptArray.slice(-6), "transcript");
    } else {
        formatTranscript(transcriptArray, "transcript");
    }
    formatTranscript(transcriptArray, "fullTranscript");
    document.getElementById("fullArray").innerText = JSON.stringify(transcriptArray);
}

function formatTranscript(thePassedTranscriptArray, theElementID){
    let formatted = "";
    thePassedTranscriptArray.forEach(value=> formatted += `${value[0]}: ${value[1]} <br>`);
    document.getElementById(theElementID).innerHTML = formatted;
}

let textReady = document.getElementById("chatInput");
textReady.addEventListener("keydown", function (ee) {
    if (ee.key === "Enter"){
        getChatResponse();
        console.log("Enter pressed in chat")
    }
});

