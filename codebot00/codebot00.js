let codeBotName = "CodeBot00";
let userName = "user";
const transcriptArray = [];
let mod = "code-davinci-002";
let temp = 0;

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

async function callGPT3(prompt, lang){
    let responseGiven = await GPT3request(prompt, lang);
    console.log("responseReceived", responseGiven);
    transcriptArray.push([codeBotName, responseGiven]);
    document.getElementById("codeInput").disabled = false;
    let formattedResponse = formatResponse(responseGiven, lang);
    document.getElementById("fullResponse").innerHTML = formattedResponse;
    hljs.highlightAll();
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

hljs.highlightAll();
