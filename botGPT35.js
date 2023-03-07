
async function callGPT35codeUI(prompt, lang, userID, answerLength, mod = "gpt-3.5-turbo-0301", temp = 0, botVersion = 'unknown'){
    console.log('calling callGPT35codeUI function...');
    let sysOb = {'role': 'system', 'content': 'You are Guisseppe, a helpful computer science and creative coding teacher.'};
    let userOb = {'role': 'user', 'content': prompt};
    let messageArray = [sysOb, userOb];
    let responseGiven = await GPT35request(messageArray, userID, answerLength, mod, temp, botVersion);
    waiting('#E8F5F5');
    console.log("responseReceived", responseGiven);
    transcriptArray.push([codeBotName, responseGiven.content]);
    document.getElementById("codeInput").disabled = false;
    let formattedResponse = formatResponse(responseGiven.content, lang);
    document.getElementById("fullResponse").innerHTML = formattedResponse;
    hljs.highlightAll();
    buildFullTranscript();
}

async function callGPT35turboBotUI(messageArray, userID, mod = "gpt-3.5-turbo", temp = 1, botVersion = 'unknown'){
    console.log('calling turboBotUI function...');
    let responseGiven = await GPT35request(messageArray, userID, '1200', mod, temp, botVersion);
    console.log('responseGiven is:', responseGiven);
    buildChatBubble(responseGiven);
    console.log('bot 3.5 response: ', responseGiven, 'chatArray:', chatArray);
    document.getElementById("userInput").focus();
    document.getElementById("userInput").disabled = false;
    return responseGiven;
}

async function GPT35request(mesArray, userID, answerLength, mod, temp, botVersion){
    let res;
    console.log('calling Express /GPT35post', 'message array is:', mesArray);
    await axios.post('/GPT35post', {
        promptMessageArray: mesArray,
        temperature: temp,
        ansLength: answerLength,
        univID: userID,
        model: mod,
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
    let GPT35response = res["data"][0]["GPT35response"];
    let identity = res["data"][1]["allowed"];
    console.log('gpt-3.5-turbo id:');
    if (identity.length > 1){
        userName = identity[1];
        if (typeof loggedInStatus !== 'undefined') {
            if (loggedInStatus != 1) {
                saveToLocalStorage(identity);
            }
        }
    }
    console.log('response', GPT35response);
    return GPT35response;
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
