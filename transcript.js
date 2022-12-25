const transcriptArray = [];

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
    thePassedTranscriptArray.forEach(value=> formatted += `<b>${value[0]}</b>: ${value[1]} <br>`);
    document.getElementById(theElementID).innerHTML = formatted;
}

let textReady = document.getElementById("chatInput");
textReady.addEventListener("keydown", function (ee) {
    if (ee.key === "Enter"){
        getChatResponse();
        console.log("Enter pressed in chat")
    }
});

