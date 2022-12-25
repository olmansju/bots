const botName = "Bot00";
let userName = "user";

async function botResponse(responseText){
    processLog("botResponse", `passed data:: ${responseText}`);
    setTimeout(baselineBotResponse, 1400);
}

function baselineBotResponse(){

    let responseGiven = ``;
    transcriptArray.push([botName, responseGiven]);
    console.log('bot response: ', responseGiven);

    document.getElementById("chatInput").focus();

    buildTranscript();
    document.getElementById("chatInput").disabled = false;

    processLog("baselineBotResponse", `generated response:: ${responseGiven}`);
}