
async function callGPT3botUI(userResponseText, userID){
    console.log('calling callGPT3botUI function...');
    let responseGiven = await GPT3request(userResponseText, userID, '100');
    let strippedResponse = responseGiven.trim().replace(`${botName}:`, '').replace(/\n/g,' ');
    transcriptArray.push([botName, strippedResponse]);
    console.log('bot response: ', responseGiven);
    document.getElementById("chatInput").focus();
    buildTranscript();
    document.getElementById("chatInput").disabled = false;
    processLog("callGPT3", `generated response:: ${strippedResponse}`);
}

async function callGPT3codeUI(prompt, lang, userID, answerLength){
    console.log('calling callGPT3codeUI function...');
    let responseGiven = await GPT3request(prompt, userID, answerLength);
    waiting('lightgreen');
    console.log("responseReceived", responseGiven);
    transcriptArray.push([codeBotName, responseGiven]);
    document.getElementById("codeInput").disabled = false;
    let formattedResponse = formatResponse(responseGiven, lang);
    document.getElementById("fullResponse").innerHTML = formattedResponse;
    hljs.highlightAll();
}

async function GPT3request(prompt, userID, answerLength){
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
    console.log('response', GPT3response);
    return GPT3response;
}

function waiting(DIVcolor){
    document.getElementById('topMiddle').style.backgroundColor = DIVcolor;
    document.getElementById('middleMiddle').style.backgroundColor = DIVcolor;
    document.getElementById('bottomMiddle').style.backgroundColor = DIVcolor;
    document.getElementById("mouth").style.fill = DIVcolor;
}
