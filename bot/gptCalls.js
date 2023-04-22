let lastGPT35convoID;

async function callGPT35eval(messageArray, userID, mod, temp, botVersion){
    console.log('calling turboBotUI eval function...');
    let responseGiven = await GPT35request(messageArray, userID, '1200', mod, temp, botVersion);
    console.log('responseGiven is:', responseGiven);
    return responseGiven;
}

async function GPT35request(mesArray, userID, answerLength, mod, temp, botVersion){
    let res;
    console.log('calling Express /GPT35post', 'message array is:', mesArray);
    await axios.post('/GPT35post', {
        promptMessageArray: mesArray,
        temperature: temp,
        ansLength: answerLength,
        univID: userID,
        model: mod,
        version: botVersion
    })
        .then(function (response) {
            res = response;
            console.log('post response is:', res);
        })
        .catch(function (error) {
            console.log(error);
        });
    if (!res.ok){ console.log('Fetch error: ', res.status);}
    let GPT35response = res["data"][0]["GPT35response"];
    let identity = res["data"][1]["allowed"];
    lastGPT35convoID = res["data"][2];
    console.log('gpt-3.5-turbo conversation id:', lastGPT35convoID);
    if (identity.length > 1){
        userName = identity[1];
        if (typeof loggedInStatus !== 'undefined') {
            if (loggedInStatus != 1) {
                saveToLocalStorage(identity);
            }
        }
    }
    console.log('response', GPT35response);
    return GPT35response;
}