
async function callGPT4aTurboBotUI(messageObject, userID, mod, botVersion = 'unknown', userThreadID, assistantID){
    console.log('calling turbo4aBotUI function...');
    let responseGiven = await GPT4aRequest(messageObject, userID, '1200', mod, botVersion, userThreadID, assistantID);
    console.log('responseGiven is:', responseGiven);
    buildChatBubble(responseGiven);
    console.log('bot 4a response: ', responseGiven);
    document.getElementById("userInput").focus();
    document.getElementById("userInput").disabled = false;
    return responseGiven;
}

async function GPT4aRequest(mesObj, userID, answerLength, mod, botVersion, userThreadID, uAssistantID){
    let res;
    console.log('calling Express /GPT4post', 'message array is:', mesObj);
    await axios.post('/GPT4post', {
        promptMessageObject: mesObj,
        ansLength: answerLength,
        univID: userID,
        model: mod,
        assistant: uAssistantID,
        thread: userThreadID,
        version: botVersion
    })
        .then(function (response) {
            res = response;
            console.log('post response is:', res);
        })
        .catch(function (error) {
            console.log(error);
        });
    if (!res.ok){ console.log('Fetch error: ', res.status);}
    let GPT4aResponse = res["data"][0]["GPT4aResponse"];
    let identity = res["data"][1];
    if (identity){
        userName = identity.fName;
        if (typeof loggedInStatus !== 'undefined') {
            if (loggedInStatus != 1) {
                saveToLocalStorage(identity);
            }
        }
    }
    console.log('response', GPT4aResponse);
    return GPT4aResponse;
}

function waiting(DIVcolor){
    if (document.getElementById("topMiddle")) {
        document.getElementById('topMiddle').style.backgroundColor = DIVcolor;
    }
    if (document.getElementById("middleMiddle")) {
        document.getElementById('middleMiddle').style.backgroundColor = DIVcolor;
    }
    if (document.getElementById("bottomMiddle")) {
        document.getElementById('bottomMiddle').style.backgroundColor = DIVcolor;
    }
    if (document.getElementById("mouth")) {
        document.getElementById("mouth").style.fill = DIVcolor;
    }
    if (document.getElementById("ambientProcessing7plus")) {
        document.getElementById('ambientProcessing7plus').style.backgroundColor = DIVcolor;
    }
}
