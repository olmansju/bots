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
        let userObject = {'role': 'user', 'content': trimmedResponseText};
        chatArray.push(userObject);
        buildChatBubble(userObject);
        document.getElementById("userInput").value = "";
        document.getElementById("userInput").disabled = true;
        botResponse(chatArray, univID);
    }
}

async function botResponse(chArray, userID){
    let preppedMessageArray = prepMessage(chArray);
    let responseObject;
    responseObject = await callGPT35turboBotUI(preppedMessageArray, userID, mod, temp, version);
    chatArray.push(responseObject);
}

function buildChatBubble(messageObject){
    console.log('buildChatBubble function called, message obj is:', messageObject);
    let chatRecord = document.getElementById('chatRecord');
    let divEle = document.createElement('Div');
    let imgEle = document.createElement('Img');
    let spanEle = document.createElement('P');
    let textEle = document.createTextNode(messageObject.content);
    let brEle = document.createElement("br");
    if (messageObject.role == 'user'){
        spanEle.classList.add('chatBubbleUserClass');
        spanEle.append(textEle);
        divEle.append(spanEle);
    } else {
        spanEle.classList.add('chatBubbleBotClass');
        imgEle.src = '../images/horatio.png';
        imgEle.height = 62;
        imgEle.width = 61;
        imgEle.style.cssFloat = 'left';
        spanEle.append(textEle);
        divEle.append(imgEle);
        divEle.append(spanEle);
    }
    chatRecord.prepend(divEle);
    //chatRecord.prepend(brEle);
}

function prepMessage(cArray){
    let theMessage = cArray.slice(Math.max(cArray.length - 5, 1));
    theMessage.unshift(cArray[0]);
    return theMessage;
    }
