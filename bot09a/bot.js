const botName = "Horacio";
let userName = "user";
let neo4jID;
let mod = "gpt-3.5-turbo-0301";
let temp = 0.5;
let version = "AB 0.09a";
const chatArray = [];

document.getElementById("askButton").addEventListener("click", initiateResponse);
let textInputReady = document.getElementById("userInput");
textInputReady.addEventListener("keydown", function (ee) {
    if (ee.key === "Enter"){
        initiateResponse();
    }
});

function initiateResponse() {
    if (loggedInStatus != 1) {
        document.getElementById('needToLogInMessage').innerText = '-----------------------> You need to log in before we can talk.';
        return;
    }
    let responseText;
    responseText = document.getElementById("userInput").value;
    let univID = document.getElementById("univID").value;
    let trimmedResponseText = responseText.trim();
    if (trimmedResponseText !== "") {
        initiateProcess(trimmedResponseText, univID);
    }
}

async function initiateProcess(query, univID){
    let evaluativeArray = [];
    let sendingArray = [];
    let sendingPrompt = `You are ${botName}, a PhD advising assistant. Respond to ${userName} in a kind, helpful way.`;
    let sendingPromptObject = {'role': 'system', 'content': sendingPrompt};
    sendingArray.push(sendingPromptObject);
    //get embeddings (in the future maybe don't use await as the next part should take longer and so this will be ready before the await returns)
    let theResponseEmbeddings = await getUserResponseEmbeddings(query);
    //establish the nature of question use await
    let prompt = `You are ${botName}, a PhD advising assistant. You are helping evaluate student submitted queries. For each query provide an answer to the following questions: \n QUERY1# on a scale of 0.001 to 0.999 what is the probability that this query is related to PhD program advising (please answer only with a number, no additional text)? \n QUERY2# if the probability in QUERY#1 was greater than .5, what would be an interesting (e.g. useful, witty, amusing) response to this query that would occupy the user while the answer was looked up (in 280 characters or less)? \n QUERY3# if the probability in QUERY#1 was less than .5001, what would be your best answer to this question? \n QUERY4# what clarifying question would you ask of someone asking this query? \n QUERY5# what are two insights you can interpolate from the student's query? \n Prepend your answer to each question with: QUERY1#, QUERY2#, QUERY3#, QUERY4#, and QUERY5# respectively \n`;
    evaluativeArray.push({'role': 'system', 'content': prompt});
    let userObject = {'role': 'user', 'content': query};
    buildChatBubble(userObject);
    evaluativeArray.push(userObject);
    //document.getElementById("userInput").value = "";
    //document.getElementById("userInput").disabled = true;
    let evaluation = await botEvalResponse(evaluativeArray, univID);
    console.log('botEvalResponse is:', evaluation);
    let evalObj = await processEval(evaluation);
    console.log('evalObj is:', evalObj, 'embeddings back:', theResponseEmbeddings);
    if (evalObj.q1 > 0.4999){
        //the question is probably about advising: dole out q2, match embeddings
        console.log('Pertinent to advising:', evalObj.q1, 'buy time statement:', evalObj.q2, 'buy time question:', evalObj.q4, 'buy time insights:', evalObj.q5);
        buildChatBubble({'role': botName, 'content': evalObj.q2});
        let top3MatchObjArray = await queryPineconeForBestMatch(theResponseEmbeddings, univID);
        if (top3MatchObjArray.length > 0 && top3MatchObjArray[0].score > 0.699){
            let contentInfo = {'role': 'system', 'content': `use the following information about ${userName} and their program to respond: ${top3MatchObjArray[0].metadata.naturalText}`};
            sendingArray.push(contentInfo);
            let queryObject = {'role': 'user', 'content': query};
            sendingArray.push(queryObject);
            let botFinalResponse = await botResponse(sendingArray, univID);
            buildChatBubble({'role': botName, 'content': botFinalResponse});
        } else {
            console.log('Middling match score:', top3MatchObjArray[0].score, 'response:', evalObj.q3);
            buildChatBubble({'role': botName, 'content': 'Hmmm, I might need more information.'});
            buildChatBubble({'role': botName, 'content': evalObj.q2});
        }
    } else {
        //the question is probably not about advising: use q3 as response
        console.log('Not pertinent to advising:', evalObj.q1, 'response:', evalObj.q3);
        buildChatBubble({'role': botName, 'content': evalObj.q3});
    }
/*
        chatArray.push(userObject);
        buildChatBubble(userObject);

        botResponse(chatArray, univID);
        document.getElementById("userInput").focus();
        document.getElementById("userInput").disabled = false;

 */
}

function processEval(eval){
    //this function takes a gpt3.5 response and processes it
    let evalResponseArray = eval.split('QUERY');
    let probability = 0.5111;
    let q1response = evalResponseArray[evalResponseArray.findIndex(element => element.includes("1#"))];
    let q1responseScrubbed = q1response.replace('1#', '');
    let q1probability = extractFloatFromString(q1responseScrubbed);
    let q2response = evalResponseArray[evalResponseArray.findIndex(element => element.includes("2#"))];
    let q2responseScrubbed = q2response.replace('2#', '');
    let q3response = evalResponseArray[evalResponseArray.findIndex(element => element.includes("3#"))];
    let q3responseScrubbed = q3response.replace('3#', '');
    let q4response = evalResponseArray[evalResponseArray.findIndex(element => element.includes("4#"))];
    let q4responseScrubbed = q4response.replace('4#', '');
    let q5response = evalResponseArray[evalResponseArray.findIndex(element => element.includes("5#"))];
    let q5responseScrubbed = q5response.replace('5#', '');
    console.log('q1response', q1response, 'q1probability', q1probability);
    if (q1probability){
        if (q1probability > 1 ) {
            q1probability = q1probability/100;
        }
        let responseObject = {q1: q1probability, q2: q2responseScrubbed, q3: q3responseScrubbed, q4: q4responseScrubbed, q5: q5responseScrubbed};
        return responseObject;
    } else {
        // no integer found in response
        let responseObject = {q1: probability, q2: q2responseScrubbed, q3: q3responseScrubbed, q4: q4responseScrubbed, q5: q5responseScrubbed};
        return responseObject;
    }
}

function extractFloatFromString(str) {
    const regex = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;
    const matches = str.match(regex);
    if (matches && matches.length > 0) {
        return parseFloat(matches[0]);
    } else {
        return null;
    }
}

async function botEvalResponse(chArray, userID){
    let responseObject;
    responseObject = await callGPT35eval(chArray, userID, mod, temp, version);
    return responseObject;
}

async function botResponse(chArray, userID){
    let responseObject;
    responseObject = await GPT35request(chArray, userID, '1200', mod, temp, version);
    return responseObject;
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
