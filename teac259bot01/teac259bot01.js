const botName = "TA-259-Bot05";
let userName = "User";
let prompt = `In the following conversation, you are ${botName}, a helpful, knowledgeable, and kind Teaching Assistant for TEAC 259, a course on technology integration taken by future teachers and future speech language pathologists.`;


async function chatSummary(userID){
    let mod = "text-curie-001";
    let temp = 0;
    let answerLength = "360";
    let promptCommand = "Summarize this chatlog:";
    let chatlog = formatArrayIntoModelPrompt(transcriptArray);
    let responseModel = `1. What is the main topic?\n2. What advice did ${botName} give to ${userName}?\n3. What would be a one sentence summary of the interaction?\n4. What is the sentiment of the conversation?\n5. What is a shorthand of the conversation?\n6. What is a 10 word summary of the conversation?`;
    let promptEnd = "#Answers#\n1.";
    let promptForSummary = `${promptCommand}\n\n${chatlog}\n\n${responseModel}\n\n${promptEnd}`;
    let summaryGiven = await GPT3request(promptForSummary, userID, answerLength, mod, temp);
    document.getElementById("summary").innerText = `1. ${summaryGiven}`;
}

async function botResponse(responseText, userID){
    processLog("botResponse", `passed data:: ${responseText}`);
    let preppedPrompt = prepPrompt(prompt, transcriptArray);
    let model = "curie:ft-ilt-tlte-cehs-unl-2023-01-06-21-01-08";
    let temp = 0.6;
    callGPT3botUI(preppedPrompt, userID, model, temp);
}

function prepPrompt(prompt, arrayOfTransaction){
    let formattedModel = formatArrayIntoModelPrompt(arrayOfTransaction);
    //let theFullPromptAndModel = `${prompt}\n${formattedModel}`;
    document.getElementById("fullPrompt").innerText = formattedModel;
    return formattedModel;
}

function formatArrayIntoModelPrompt(arrayOfTransaction){
    let model = "";
    let name = arrayOfTransaction[arrayOfTransaction.length - 1][0];
    let question = arrayOfTransaction[arrayOfTransaction.length - 1][1];
    model = `${name}: ${question}\n${botName}:`;
    //arrayOfTransaction.forEach(dialoguePair => {
    //    model += `\n${dialoguePair[0]}: ${dialoguePair[1]}\n${botName}:`;
    //} );
    return question;
}
