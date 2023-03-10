let codeBotName = "CodeBot02";
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
    let univID = document.getElementById("univID").value;
    let trimmedcodeInput = codeInput.trim();
    if (trimmedcodeInput !== "") {
        let preppedPrompt = prepPrompt(programmingLanguage, CSlevel, requestTheme, trimmedcodeInput);
        transcriptArray.push([userName, preppedPrompt]);
        formatPrompt(preppedPrompt, "prompt");
        botResponse(preppedPrompt, programmingLanguage, univID);
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

async function botResponse(prompt, lang, userID){
    callGPT3codeUI(prompt, lang, userID, '100');
}
