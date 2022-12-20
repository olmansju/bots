
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
        botResponse(responseText);
    }
}

async function botResponse(responseText){
    processLog("botResponse", `passed data:: ${responseText}`);
    setTimeout(baselineBotResponse, 1400);
}

function addHexColor(h1, h2) {
    let hexStr = (parseInt(h1, 16) + parseInt(h2, 16)).toString(16);
    while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
    return hexStr;
}

function baselineBotResponse(){
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    let randomPlus42 = addHexColor(randomColor, '2a2a');
    let responseGiven = `My mouth is the hex color #${randomColor}! My lips are the hex color #${randomPlus42}!`;
    transcriptArray.push([botName, responseGiven]);
    console.log('bot response: ', responseGiven);
    document.getElementById("chatInput").focus();
    document.getElementById("mouth").style.fill = `#${randomColor}`;
    document.getElementById("mouth").style.stroke = `#${randomPlus42}`;
    buildTranscript();
    document.getElementById("chatInput").disabled = false;

    processLog("baselineBotResponse", `generated response:: ${responseGiven}`);
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

