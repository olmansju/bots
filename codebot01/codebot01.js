let codeBotName = "CodeBot01";
let userName = "user";
const transcriptArray = [];
let mod = "code-davinci-002";
let temp = 0;

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

async function callGPT3(prompt, lang){
    let responseGiven = await GPT3request(prompt, lang);
    waiting('lightgreen');
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

function waiting(DIVcolor){
    document.getElementById('topMiddle').style.backgroundColor = DIVcolor;
    document.getElementById('middleMiddle').style.backgroundColor = DIVcolor;
    document.getElementById('bottomMiddle').style.backgroundColor = DIVcolor;
    document.getElementById("mouth").style.fill = DIVcolor;
}
