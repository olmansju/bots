const botName = "Bot04";
let userName = "User";
let prompt = `In the following conversation, you are ${botName}, a helpful, creative, and kind phd advisor.`;
let mod = "text-davinci-003";
let temp = 1;

async function botResponse(responseText, userID){
    processLog("botResponse", `passed data:: ${responseText}`);
    let preppedPrompt = prepPrompt(prompt, transcriptArray);
    callGPT3botUI(preppedPrompt, userID);
}

function prepPrompt(prompt, arrayOfTransaction){
    let formattedModel = formatArrayIntoModelPrompt(arrayOfTransaction);
    let theFullPromptAndModel = `${prompt}\n${formattedModel}`;
    document.getElementById("fullPrompt").innerText = theFullPromptAndModel;
    return theFullPromptAndModel;
}

function formatArrayIntoModelPrompt(arrayOfTransaction){
    let model = "";
    arrayOfTransaction.forEach(dialoguePair => {
        model += `\n${dialoguePair[0]}: ${dialoguePair[1]}`;
    } );
    return model;
}
