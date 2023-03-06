const botName = "Horacio";
let userName = "user";
let mod = "gpt-3.5-turbo-0301";
let temp = 1;
let version = "AB 0.07";
const chatArray = [];

document.getElementById("askButton").addEventListener("click", startResponse);
let textInputReady = document.getElementById("userInput");
textInputReady.addEventListener("keydown", function (ee) {
    if (ee.key === "Enter"){
        startResponse();
        console.log("Enter pressed in chat")
    }
});

function startResponse() {
    if (chatArray.length < 1){
        let prompt = `You are ${botName}, a helpful, creative, and kind assistant PhD advisor. You are helping ${userName}. Answer ${userName} as concisely as possible.`;
        chatArray.push({'role': 'system', 'content': prompt});
    }
    let responseText;
    responseText = document.getElementById("userInput").value;
    let univID = document.getElementById("univID").value;
    let trimmedResponseText = responseText.trim();
    if (trimmedResponseText !== "") {
        chatArray.push({'role': 'user', 'content': trimmedResponseText});
        document.getElementById("userInput").value = "";
        document.getElementById("userInput").disabled = true;
        botResponse(chatArray, univID);
    }
}

async function botResponse(chArray, userID){
    let preppedMessageArray = prepMessage(chArray);
    callGPT35turboBotUI(preppedMessageArray, userID, mod, temp, version);
}

function prepMessage(cArray){
    let theMessage = cArray.slice(Math.max(arr.length - 5, 1));
    theMessage.unshift(cArray[0]);
    return theMessage;
    }
