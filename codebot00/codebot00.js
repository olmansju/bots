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
    let univID = document.getElementById("univID").value;
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
        botResponse(preppedPrompt, programmingLanguage, univID);
    }
}

async function botResponse(prompt, lang, userID){
    callGPT3codeUI(prompt, lang, userID, '100');
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

hljs.highlightAll();
