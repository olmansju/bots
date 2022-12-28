let codeBotName = "CodeBot03";
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
    const commentOptions = {
        'Python': '#',
        'JavaScript': '//',
        'TypeScript': '//',
        'Perl': '#',
        'PHP': '//',
        'Ruby': '#',
        'Swift': '///',
        'SQL': '--',
        'Shell': '#',
        'In general': '#'
    };
    let commentChar = commentOptions[lang];
    const queryOptions = {
        'codeRequest': `${commentChar} ${lang}\n ${commentChar} Write a function that ${codeInput}\n\n`,
        'dataRequest': `${commentChar} ${lang}\n ${commentChar} Generate data that ${codeInput}\n\n`,
        'databaseRequest': `${commentChar} ${lang}\n ${commentChar} Create a query that ${codeInput}\n\n`,
        'explainCodeRequest': `${codeInput}\n\n ${commentChar} Explain what the previous code is doing:\n\n It`,
        'debugRequest': `${codeInput}\n\n ${commentChar} Debug the previous code.\n\n`,
        'codeImprovementRequest': `${codeInput}\n\n ${commentChar} Refactor the previous code.\n\n`,
        'codeTransformationToPython': `${commentChar} Translate this code from ${lang} into Python\n\n ${codeInput}\n\n ${commentChar} ${lang}\n\n`
    };
    let fullPrompt = queryOptions[theme];
    const queryModel = {
        'codeRequest': "code-davinci-002",
        'dataRequest': "code-davinci-002",
        'databaseRequest': "code-davinci-002",
        'explainCodeRequest': "code-davinci-002",
        'debugRequest': "code-davinci-002",
        'codeImprovementRequest': "code-davinci-002",
        'codeTransformationToPython': "code-davinci-002"
    };
    mod = queryModel[theme];
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
    callGPT3codeUI(prompt, lang, userID);
}
