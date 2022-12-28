const botName = "Bot02";
let userName = "user";
let mod = "text-davinci-003";
let temp = 1;

async function botResponse(responseText, userID){
    processLog("botResponse", `passed data:: ${responseText}`);
    callGPT3botUI(responseText, userID);
}
