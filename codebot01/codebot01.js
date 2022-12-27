let codeBotName = "CodeBot01";
let userName = "user";
const transcriptArray = [];

document.getElementById("buttonInput").addEventListener("click", getResponse);

function getResponse() {
    waiting('orange');
    let programmingLanguage = document.getElementById("language").value;
    let CSlevel = document.getElementById("csFamiliarity").value;
    let requestTheme = document.getElementById("request").value;
    let codeInput = document.getElementById("codeInput").value;
    let trimmedcodeInput = codeInput.trim();
    if (trimmedcodeInput !== "") {
        let preppedPrompt = prepPrompt(programmingLanguage, CSlevel, requestTheme, trimmedcodeInput);
        transcriptArray.push([userName, preppedPrompt]);
        formatPrompt(preppedPrompt, "prompt");
        botResponse(preppedPrompt, programmingLanguage);
        let codeHighlight = formatResponse(trimmedcodeInput, programmingLanguage);
        document.getElementById("codeInput").innerHTML = codeHighlight;
        hljs.highlightAll();
    }
}

function prepPrompt(lang, level, theme, codeInput){
    let fullPrompt = `"""${level} asks: in ${lang}, ${theme}"""\n\n${codeInput}`;
    return fullPrompt;
}

function formatPrompt(thePassedPrompt, theElementID){
    document.getElementById(theElementID).innerHTML = thePassedPrompt;
}

function formatResponse(response, lang){
    let formatted = `<pre><code class='language-${lang.toLowerCase()}'> ${response} </code></pre>`;
    return formatted;
}

async function botResponse(prompt, lang){
    callGPT3(prompt, lang);
}

async function callGPT3(userCodeQuery, lang){
    let queryParameters = `?qField=message&qValue=${userCodeQuery}`;
    let responseGiven = await GPT3request(queryParameters);
    waiting('lightgreen');
    console.log("responseReceived", responseGiven);
    let theFirstResponse = responseGiven[0]["GPT3response"];
    transcriptArray.push([codeBotName, theFirstResponse]);
    document.getElementById("codeInput").disabled = false;
    let formattedResponse = formatResponse(theFirstResponse, lang);
    document.getElementById("fullResponse").innerHTML = formattedResponse;
    hljs.highlightAll();
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

function waiting(DIVcolor){
    document.getElementById('topMiddle').style.backgroundColor = DIVcolor;
    document.getElementById('middleMiddle').style.backgroundColor = DIVcolor;
    document.getElementById('bottomMiddle').style.backgroundColor = DIVcolor;
    document.getElementById("mouth").style.fill = DIVcolor;
}
