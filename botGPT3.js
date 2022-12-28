
async function callGPT3botUI(userResponseText, userID){
    let responseGiven = await GPT3request(userResponseText, userID);
    let strippedResponse = responseGiven.trim().replace(`${botName}:`, '').replace(/\n/g,' ');
    transcriptArray.push([botName, strippedResponse]);
    console.log('bot response: ', responseGiven);
    document.getElementById("chatInput").focus();
    buildTranscript();
    document.getElementById("chatInput").disabled = false;
    processLog("callGPT3", `generated response:: ${strippedResponse}`);
}

async function callGPT3codeUI(prompt, lang, userID){
    let responseGiven = await GPT3request(prompt, userID);
    waiting('lightgreen');
    console.log("responseReceived", responseGiven);
    transcriptArray.push([codeBotName, responseGiven]);
    document.getElementById("codeInput").disabled = false;
    let formattedResponse = formatResponse(responseGiven, lang);
    document.getElementById("fullResponse").innerHTML = formattedResponse;
    hljs.highlightAll();
}

async function GPT3request(prompt, userID){
    let res;
    await axios.post('/GPT3post', {
        codexPrompt: prompt,
        temperature: temp,
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
