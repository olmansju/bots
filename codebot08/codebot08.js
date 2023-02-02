let codeBotName = "Lenna08";
let userName = "user";
const transcriptArray = [];
let mod = "code-davinci-002";
let temp = 0.2;
let version = "codeBot08";
let programmingLanguage;

document.getElementById("buttonInput").addEventListener("click", getResponse);
document.getElementById("buttonInputRefresh").addEventListener("click", getResponse);

function getResponse() {
    console.log('Send Button Pressed...');
    waiting('#FFEBCD');
    console.log('language select value:', document.getElementById("language").value);
    if (document.getElementById("language").value == null){
        programmingLanguage = 'in general';
    } else {
        programmingLanguage = document.getElementById("language").value;
    }
    let CSlevel = document.getElementById("csFamiliarity").value;
    let answerLength = document.getElementById("answerLength").value;
    let requestTheme = document.getElementById("request").value;
    let codeInput = document.getElementById("codeInput").value;
    let univID = document.getElementById("univID").value;
    let trimmedcodeInput = codeInput.trim();
    if (trimmedcodeInput !== "") {
        let preppedPrompt = prepPrompt(programmingLanguage, CSlevel, requestTheme, trimmedcodeInput);
        transcriptArray.push([userName, preppedPrompt]);
        formatPrompt(preppedPrompt, "prompt");
        botResponse(preppedPrompt, programmingLanguage, univID, answerLength, mod, temp, version);
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
        'in general': '#'
    };
    let commentChar = commentOptions[lang];
    console.log('commentChar is:', commentChar);
    const queryOptions = {
        'ideationRequest': `${commentChar} ${lang}\n ${commentChar} Help me brainstorm ideas for my  project, so far I'm thinking that ${codeInput}\n Idea #01: \n\n`,
        'researchRequest': `${commentChar} ${lang}\n ${commentChar} Let's do some research, what do you know about ${codeInput}?\n\n`,
        'planningRequest': `${commentChar} ${lang}\n ${commentChar} Please help me come up with a plan for my project. My goals are to ${codeInput}.\n\n`,
        'csConceptRequest': `${commentChar} ${lang}\n ${commentChar} Help me understand the concept of ${codeInput}. Explain it to me like ${level}. \n\n`,
        'ccReflectionRequest': `${commentChar} Help me reflect on the creative coding process, I want to ${codeInput}\n\n`,
        'codeRequest': `${commentChar} ${lang}\n ${commentChar} Write a function that ${codeInput}\n\n`,
        'dataRequest': `${commentChar} ${lang}\n ${commentChar} Generate data that ${codeInput}\n\n`,
        'databaseRequest': `${commentChar} ${lang}\n ${commentChar} Create a query that ${codeInput}\n\n`,
        'explainCodeRequest': `${codeInput}\n\n ${commentChar} Explain what the previous code is doing like ${level}.:\n\n It`,
        'debugRequest': `${codeInput}\n\n ${commentChar} Debug the previous code.\n\n`,
        'codeImprovementRequest': `${codeInput}\n\n ${commentChar} Refactor the previous code.\n\n`,
        'codeTransformationToPython': `${commentChar} Translate this code from ${lang} into Python\n\n ${commentChar} ${lang}\n\n ${codeInput}\n\n # Python`
    };
    let fullPrompt = queryOptions[theme];
    const queryModel = {
        'codeRequest': "code-davinci-002",
        'dataRequest': "code-davinci-002",
        'databaseRequest': "code-davinci-002",
        'explainCodeRequest': "code-davinci-002",
        'debugRequest': "code-davinci-002",
        'codeImprovementRequest': "code-davinci-002",
        'codeTransformationToPython': "code-davinci-002",
        'ideationRequest':"text-davinci-003",
        'researchRequest':"text-davinci-003",
        'planningRequest':"text-davinci-003",
        'csConceptRequest':"text-davinci-003",
        'ccReflectionRequest':"text-davinci-003"
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

async function botResponse(prompt, lang, userID, answerLeng, model, temperature, vers){
    callGPT3codeUI(prompt, lang, userID, answerLeng, model, temperature, vers);
}
