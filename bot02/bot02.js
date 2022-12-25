const botName = "Bot02";
let userName = "user";

async function botResponse(responseText){
    processLog("botResponse", `passed data:: ${responseText}`);
    callGPT3(responseText);
}

async function callGPT3(userResponseText){
    let queryParameters = `?qField=message&qValue=${userResponseText}`;
    let responseGiven = await GPT3request(queryParameters);
    let strippedResponse = responseGiven[0]["GPT3response"].trim().replace(`${botName}:`, '').replace(/\n/g,'');
    transcriptArray.push([botName, strippedResponse]);
    console.log('bot response: ', strippedResponse);
    document.getElementById("chatInput").focus();
    buildTranscript();
    document.getElementById("chatInput").disabled = false;

    processLog("callGPT3", `generated response:: ${strippedResponse}`);
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