let mod = "text-embedding-ada-002";
let version = "EMB 0.02";
const embeddingsArray = [];

document.getElementById("embedButton").addEventListener("click", embeddingRequest);
document.getElementById("tokenButton").addEventListener("click", calculateTokens);

async function calculateTokens(){
    let stringToCalculate = document.getElementById('toEmbed').value;
    stringToCalculate = stringToCalculate.trim();
    if (stringToCalculate != ''){
        console.log('calling Express /tokenPost', 'stringToCalculate is:', stringToCalculate);
        await axios.post('/tokenPost', {
            stringToCalculate: stringToCalculate,
        })
            .then(function (response) {
                res = response;
                console.log('post response is:', res);
            })
            .catch(function (error) {
                console.log(error);
            });
        if (!res.ok){ console.log('Fetch error: ', res.status);}
        let tokenResponse = res["data"][0]["tokenResponse"];
        console.log('response', tokenResponse);
        document.getElementById('numberOfTokens').innerText = `Total tokens: ${tokenResponse}.  `;
    } else {
        document.getElementById('numberOfTokens').innerText = `Total tokens: 0.  `;
    }
}

async function embeddingRequest(){
    let res;
    let stringItem = document.getElementById('toEmbed').value;
    console.log('calling Express /embedADApost', 'stringItem is:', stringItem);
    await axios.post('/embedADApost', {
        stringToEmbed: stringItem,
        model: mod
    })
        .then(function (response) {
            res = response;
            console.log('post response is:', res);
        })
        .catch(function (error) {
            console.log(error);
        });
    if (!res.ok){ console.log('Fetch error: ', res.status);}
    let ADAresponse = res["data"][0]["ADAresponse"];
    let totTokens = ADAresponse.usage.total_tokens;
    console.log('response', ADAresponse.data[0].embedding);
    postResult(ADAresponse.data[0].embedding, stringItem, totTokens);
}

function postResult(embeddingResponse, stringItem, totalTokens){
    let res = JSON.stringify(embeddingResponse, null, 2);
    let len = embeddingResponse.length;
    document.getElementById('result').innerText = `Array of length ${len} returned. Costing ${totalTokens} tokens. Array items: ${res}`;
    embeddingsArray.push({'string': stringItem, 'vector': embeddingResponse});
    printArray(embeddingsArray);
}

function printArray(embArray){
    let prettyArray = JSON.stringify(embArray, null, 2);
    document.getElementById('thusFar').innerText = prettyArray;
}
