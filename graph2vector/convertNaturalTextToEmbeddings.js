let tokenTotal = 0;
let pathProcessTotal = 0;

async function batchEmbeddingRequest(natTextArray){
    const batchEmbeddingsArray = [];
    console.log('beginning batch embedding process...');
    for (const obj of natTextArray) {
        let theObjPlusEmbeddings = await embeddingRequestForBatch(obj);
        batchEmbeddingsArray.push(theObjPlusEmbeddings);
        //console.log(theObjPlusEmbeddings);
        pathProcessTotal += 1;
        divContentReplacer('s4', `total embeddings requested: ${pathProcessTotal} \n`);
    }
    console.log(`processing complete. ${batchEmbeddingsArray.length} embeddings`);
    return batchEmbeddingsArray;
}

async function embeddingRequestForBatch(theObj){
    let res;
    let mod = "text-embedding-ada-002";
    let theText = theObj.naturalText;
    //console.log('calling Express /embedADApost', 'naturalText is:', theText);
    await axios.post('/embedADApost', {
        stringToEmbed: theText,
        model: mod
    })
        .then(function (response) {
            res = response;
            //console.log('post response is:', res);
        })
        .catch(function (error) {
            console.log(error);
        });
    if (res.status !== 200) { console.log('Fetch error: ', res.status); }
    let ADAresponse = res["data"][0]["ADAresponse"];
    tokenTotal += ADAresponse.usage.total_tokens;
    theObj.values = ADAresponse.data[0].embedding;
    return theObj;
}
