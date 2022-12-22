
const transcriptArray = [];
const botName = "Bot03";
let userName = "user";
let prompt = `In the following conversation, you are ${botName}, a helpful, creative, and kind phd advisor.`;

document.getElementById("buttonChat").addEventListener("click", getChatResponse);

function getChatResponse() {
    let responseText;
    console.log(userName);
    responseText = document.getElementById("chatInput").value;
    let trimmedResponseText = responseText.trim();
    if (responseText !== "") {
        transcriptArray.push([userName, trimmedResponseText]);
        console.log('chat transcript: ', [userName, responseText]);
        document.getElementById("chatInput").value = "";
        buildTranscript();
        document.getElementById("chatInput").disabled = true;
        botResponse(trimmedResponseText);
    }
}

async function botResponse(responseText){
    processLog("botResponse", `passed data:: ${responseText}`);
    let preppedPrompt = prepPrompt(prompt, transcriptArray);
    callGPT3(preppedPrompt);
}

async function callGPT3(userResponseText){
    let queryParameters = `?qField=message&qValue=${userResponseText}`;
    let responseGiven = await GPT3request(queryParameters);
    let strippedResponse = responseGiven[0]["GPT3response"].trim().replace(`${botName}:`, '').replace(/\n/g,' ');
    transcriptArray.push([botName, strippedResponse]);
    console.log('bot response: ', responseGiven);
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

