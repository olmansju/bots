
async function callGPT3botUI(userResponseText, userID, mod = "text-davinci-003", temp = 1){
    console.log('calling callGPT3botUI function...');
    let responseGiven = await GPT3request(userResponseText, userID, '100', mod, temp);
    let strippedResponse = responseGiven.trim().replace(`${botName}:`, '').replace(/\n/g,' ');
    transcriptArray.push([botName, strippedResponse]);
    console.log('bot response: ', responseGiven);
    if (parseInt(botName.split('Bot')[1], 10) > 4){
        chatSummary(userID);
    }
    document.getElementById("chatInput").focus();
    buildTranscript();
    document.getElementById("chatInput").disabled = false;
    processLog("callGPT3", `generated response:: ${strippedResponse}`);
}

async function callGPT3codeUI(prompt, lang, userID, answerLength, mod = "code-davinci-002", temp = 0){
    console.log('calling callGPT3codeUI function...');
    let responseGiven = await GPT3request(prompt, userID, answerLength, mod, temp);
    waiting('lightgreen');
    console.log("responseReceived", responseGiven);
    transcriptArray.push([codeBotName, responseGiven]);
    document.getElementById("codeInput").disabled = false;
    let formattedResponse = formatResponse(responseGiven, lang);
    document.getElementById("fullResponse").innerHTML = formattedResponse;
    hljs.highlightAll();
}

async function GPT3request(prompt, userID, answerLength, mod, temp){
    let res;
    console.log('calling Express /GPT3post', 'prompt is:', prompt);
    await axios.post('/GPT3post', {
        enteredPrompt: prompt,
        temperature: temp,
        ansLength: answerLength,
        univID: userID,
        model: mod
    })
        .then(function (response) {
            res = response;
            console.log('post response is:', res);
        })
        .catch(function (error) {
            console.log(error);
        });
    if (!res.ok){ console.log('Fetch error: ', res.status);}
    let GPT3response = res["data"][0]["GPT3response"];
    let identity = res["data"][1]["allowed"];
    if (identity.length > 1){
        userName = identity[1];
        if (typeof loggedInStatus !== 'undefined') {
            if (loggedInStatus != 1) {
                saveToLocalStorage(identity);
            }
        }
    }
    console.log('response', GPT3response);
    return GPT3response;
}

function waiting(DIVcolor){
    document.getElementById('topMiddle').style.backgroundColor = DIVcolor;
    document.getElementById('middleMiddle').style.backgroundColor = DIVcolor;
    document.getElementById('bottomMiddle').style.backgroundColor = DIVcolor;
    document.getElementById("mouth").style.fill = DIVcolor;
}
