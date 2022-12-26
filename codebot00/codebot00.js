let codeBotName = "CodeBot00";
let userName = "user";
const transcriptArray = [];

document.getElementById("buttonInput").addEventListener("click", getResponse);

function getResponse() {
    let programmingLanguage;
    let CSlevel;
    let requestTheme;
    let codeInput;
    console.log(transcriptArray);
    programmingLanguage = document.getElementById("language").value;
    CSlevel = document.getElementById("csFamiliarity").value;
    requestTheme = document.getElementById("request").value;
    codeInput = document.getElementById("codeInput").value;
    let trimmedcodeInput = codeInput.trim();
    if (trimmedcodeInput !== "") {
        let preppedPrompt = prepPrompt(programmingLanguage, CSlevel, requestTheme, trimmedcodeInput);
        transcriptArray.push([userName, preppedPrompt]);
        console.log('code transcript: ', [userName, preppedPrompt]);
        //document.getElementById("chatInput").value = "";
        formatTranscript(transcriptArray, "prompt");
        let codeHighlight = formatResponse(trimmedcodeInput, programmingLanguage);
        document.getElementById("codeInput").innerHTML = codeHighlight;
        document.getElementById("codeInput").disabled = true;
        botResponse(preppedPrompt, programmingLanguage);
    }
}

async function botResponse(prompt, lang){
    callGPT3(prompt, lang);
}

async function callGPT3(userCodeQuery, lang){
    let queryParameters = `?qField=message&qValue=${userCodeQuery}`;
    let responseGiven = await GPT3request(queryParameters);
    console.log("responseGiven", responseGiven);
    let strippedResponse = responseGiven[0]["GPT3response"].trim();
    transcriptArray.push([codeBotName, strippedResponse]);
    console.log('bot response: ', strippedResponse);
    document.getElementById("codeInput").disabled = false;
    let formattedResponse = formatResponse(strippedResponse, lang);
    document.getElementById("fullResponse").innerHTML = formattedResponse;
}

function formatResponse(response, lang){
    let formatted = `<pre><code class='language-${lang.toLowerCase()}'> ${response} </code></pre>`;
    return formatted;
}

function formatTranscript(thePassedTranscriptArray, theElementID){
    let formatted = "";
    thePassedTranscriptArray.forEach(value=> formatted += `<b>${value[0]}</b>: ${value[1]} <br>`);
    document.getElementById(theElementID).innerHTML = formatted;
}

function prepPrompt(lang, level, theme, codeInput){
    let fullPrompt = `"""${level} asks: in ${lang}, ${theme}"""\n\n${codeInput}`;
    return fullPrompt;
}

async function GPT3request(searchParams = null){
    console.log('GPT3request called');
    let URLplusQuery;
    if (searchParams){
        URLplusQuery = '/codeGPT3' + searchParams;
        console.log('GPT3request called w params:', searchParams);
    } else {
        URLplusQuery = '/codeGPT3';
        console.log('GPT3request called w NO params');
    }
    const response = await fetch(URLplusQuery);
    if (!response.ok){ console.log('Fetch error: ', response.status);}
    let GPT3response = await response.json();
    console.log('response', GPT3response);
    return GPT3response;
}

hljs.highlightAll();
