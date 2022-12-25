const botName = "Bot03";
let userName = "User";
let prompt = `In the following conversation, you are ${botName}, a helpful, creative, and kind phd advisor.`;

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

function prepPrompt(prompt, arrayOfTransaction){
    let formattedModel = formatArrayIntoModelPrompt(arrayOfTransaction);
    let theFullPromptAndModel = `${prompt}\n${formattedModel}`;
    document.getElementById("fullPrompt").innerText = theFullPromptAndModel;
    return theFullPromptAndModel;
}

function formatArrayIntoModelPrompt(arrayOfTransaction){
    let model = "";
    arrayOfTransaction.forEach(dialoguePair => {
        model += `\n${dialoguePair[0]}: ${dialoguePair[1]}`;
    } );
    return model;
}

async function GPT3request(searchParams = null){
    console.log('GPT3request called');
    let URLplusQuery;
    if (searchParams){
        URLplusQuery = '/botGPT3' + searchParams;
        console.log('GPT3request called w params:', searchParams);
    } else {
        URLplusQuery = '/botGPT3';
        console.log('GPT3request called w NO params');
    }
    const response = await fetch(URLplusQuery);
    if (!response.ok){ console.log('Fetch error: ', response.status);}
    let GPT3response = await response.json();
    console.log('response', GPT3response);
    return GPT3response;
}