let codeBotName = "Guisseppe11";
let userName = "user";
const transcriptArray = [];
let mod = "gpt-3.5-turbo-0301";
let temp = 0.2;
let version = "CB 0.11";
let programmingLanguage;

document.getElementById("buttonInput").addEventListener("click", getResponse);
document.getElementById("buttonInputRefresh").addEventListener("click", getResponse);
document.getElementById("codeInput").addEventListener("keyup", dynamicPrompt);

function getResponse() {
    console.log('Send Button Pressed...');
    waiting('#ffffba');
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

function dynamicPrompt(){
    if (document.getElementById("language").value == null){
        programmingLanguage = 'in general';
    } else {
        programmingLanguage = document.getElementById("language").value;
    }
    let CSlevel = document.getElementById("csFamiliarity").value;
    let requestTheme = document.getElementById("request").value;
    let codeInput = document.getElementById("codeInput").value;
    let trimmedcodeInput = codeInput.trim();
    let preppedPrompt = prepPrompt(programmingLanguage, CSlevel, requestTheme, trimmedcodeInput);
    if (preppedPrompt != null){
        document.getElementById("prompt").innerText = preppedPrompt;
    } else {
        document.getElementById("prompt").innerText = "";
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
        'errorExplanation': `${commentChar} ${lang}\n ${commentChar} What is the meaning of this error message: ${codeInput}. \n\n ${commentChar} Explain it to me like ${level}.\n\n`,
        'ccReflectionRequest': `${commentChar} Help me reflect on the creative coding process, I want to ${codeInput}\n\n`,
        'codeRequest': `${commentChar} ${lang}\n ${commentChar} Write a function that ${codeInput}\n\n`,
        'dataRequest': `${commentChar} ${lang}\n ${commentChar} Generate data that ${codeInput}\n\n`,
        'databaseRequest': `${commentChar} ${lang}\n ${commentChar} Create a query that ${codeInput}\n\n`,
        'explainCodeRequest': `${codeInput}\n\n ${commentChar} Explain what the previous code is doing. Talk to me like ${level}.:\n\n`,
        'debugRequest': `${codeInput}\n\n ${commentChar} Debug the previous code.\n\n`,
        'codeImprovementRequest': `${codeInput}\n\n ${commentChar} Refactor the previous code.\n\n`,
        'codeTransformationToPython': `${commentChar} Translate this code from ${lang} into Python\n\n ${commentChar} ${lang}\n\n ${codeInput}\n\n # Python`
    };
    let fullPrompt = queryOptions[theme];
    const queryModel = {
        'codeRequest': "gpt-3.5-turbo-0301",
        'dataRequest': "gpt-3.5-turbo-0301",
        'databaseRequest': "gpt-3.5-turbo-0301",
        'explainCodeRequest': "gpt-3.5-turbo-0301",
        'debugRequest': "gpt-3.5-turbo-0301",
        'errorExplanation': "gpt-3.5-turbo-0301",
        'codeImprovementRequest': "gpt-3.5-turbo-0301",
        'codeTransformationToPython': "gpt-3.5-turbo-0301",
        'ideationRequest':"gpt-3.5-turbo-0301",
        'researchRequest':"gpt-3.5-turbo-0301",
        'planningRequest':"gpt-3.5-turbo-0301",
        'csConceptRequest':"gpt-3.5-turbo-0301",
        'ccReflectionRequest':"gpt-3.5-turbo-0301"
    };
    mod = queryModel[theme];
    return fullPrompt;
}

function formatPrompt(thePassedPrompt, theElementID){
    document.getElementById(theElementID).innerHTML = thePassedPrompt;
}

function formatResponse(response, lang){
    let formatted;
    if (lang.includes('in general')){
        console.log('includes in general', lang);
        //formatted = `<pre><code class='language-plaintext'> ${response} </code></pre>`;
        formatted = response;
    } else {
        console.log('does not include in general', lang);
        formatted = `<pre><code class='language-${lang.toLowerCase()}'> ${response} </code></pre>`;
    }
    return formatted;
}

async function botResponse(prompt, lang, userID, answerLeng, model, temperature, vers){
    callGPT35codeUI(prompt, lang, userID, answerLeng, model, temperature, vers);
}
