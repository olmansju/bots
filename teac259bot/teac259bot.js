const botName = "Botty";
let userThreadID = "0"
let mod = "gpt-4-1106-preview";
let assistant = "asst_uOqBE2BhPdvAJ6sPZxohxvpR";
let version = "TA-259 0.1";

document.getElementById("askButton").addEventListener("click", startResponse);
let textInputReady = document.getElementById("userInput");
textInputReady.addEventListener("keydown", function (ee) {
    if (ee.key === "Enter"){
        startResponse();
    }
});

async function startResponse() {
    if (loggedInStatus != 1){
        document.getElementById('needToLogInMessage').innerText = '-----------------------> You need to log in before we can talk.';
        return;
    }
    let responseText;
    responseText = document.getElementById("userInput").value;
    let univID = document.getElementById("univID").value;
    let trimmedResponseText = responseText.trim();
    if (trimmedResponseText !== "") {
        let userObject = {'role': 'user', 'content': trimmedResponseText};
        buildChatBubble(userObject);
        document.getElementById("userInput").value = "";
        document.getElementById("userInput").disabled = true;
        botResponse(userObject, univID, userThreadID);
    }
}

async function botResponse(uObject, uID, uThreadID){
    let responseObject;
    responseObject = await callGPT4aTurboBotUI(uObject, uID, mod, version, uThreadID, assistant);
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
