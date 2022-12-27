const botName = "Bot02";
let userName = "user";
let mod = "text-davinci-003";
let temp = 1;

async function botResponse(responseText){
    processLog("botResponse", `passed data:: ${responseText}`);
    callGPT3(responseText);
}

async function callGPT3(userResponseText){
    let responseGiven = await GPT3request(userResponseText);
    let strippedResponse = responseGiven.trim().replace(`${botName}:`, '').replace(/\n/g,' ');
    transcriptArray.push([botName, strippedResponse]);
    console.log('bot response: ', responseGiven);
    document.getElementById("chatInput").focus();
    buildTranscript();
    document.getElementById("chatInput").disabled = false;
    processLog("callGPT3", `generated response:: ${strippedResponse}`);
}

async function GPT3request(prompt){
    let res;
    await axios.post('/GPT3post', {
        codexPrompt: prompt,
        temperature: temp,
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