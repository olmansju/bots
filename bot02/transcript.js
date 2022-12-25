
const transcriptArray = [];
const botName = "Bot02";
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
    callGPT3(responseText);
}

async function callGPT3(userResponseText){
    let queryParameters = `?qField=message&qValue=${userResponseText}`;
    let responseGiven = await GPT3request(queryParameters);
    let strippedResponse = responseGiven[0]["GPT3response"].trim().replace(`${botName}:`, '').replace(/\n/g,'');
    transcriptArray.push([botName, strippedResponse]);
    console.log('bot response: ', strippedResponse);
    document.getElementById("chatInput").focus();
    buildTranscript();
    document.getElementById("chatInput").disabled = false;

    processLog("callGPT3", `generated response:: ${strippedResponse}`);
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

