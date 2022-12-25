const botName = "Bot01";
let userName = "user";

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
