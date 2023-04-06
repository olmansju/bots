let mod = "text-embedding-ada-002";
let version = "EMB 0.02";
const batchEmbeddingsArray = [];
let tokenTotal = 0;

document.getElementById("batchEmbedButton").addEventListener("click", batchEmbeddingRequest);

async function batchEmbeddingRequest(){
    console.log(`parsing the paths, ${thePaths.length} in total...`);
    let theObjs = await parseFull(thePaths);
    console.log('parsing complete, total parsed:', theObjs.length);
    console.log('beginning batch embedding request...');
    for (const obj of theObjs) {
        let theEmbeddings = await embeddingRequestForBatch(obj);
        console.log(theEmbeddings);
    }
    console.log(`processing complete. ${batchEmbeddingsArray.length} embeddings`);
    let USDcost = (tokenTotal / 1000) * 0.0004;
    document.getElementById('resultOfBatchProcess').innerText = `Processed ${batchEmbeddingsArray.length} embeddings at a cost of ${tokenTotal} tokens and $${USDcost}.`;
    downloadFile(batchEmbeddingsArray);
}

async function embeddingRequestForBatch(theObj){
    let res;
    let theText = theObj.naturalText;
    console.log('calling Express /embedADApost', 'naturalText is:', theText);
    await axios.post('/embedADApost', {
        stringToEmbed: theText,
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
    tokenTotal += ADAresponse.usage.total_tokens;
    theObj.embeddings = ADAresponse.data[0].embedding;
    batchEmbeddingsArray.push(theObj);
    return `embeddings processed for leafNodeID: ${theObj.leafNodeID}, a total of ${batchEmbeddingsArray.length} processed`;
}

function downloadFile(objectArray){
    console.log('downloadFile called...');
    let results = JSON.stringify(objectArray);
    let file = new File([results], 'embeddingObjectArray.JSON', {type: "text/json"});
    console.log('file is:', file);
    const url = window.URL.createObjectURL(file);  //file.data
    const a = document.createElement('a');
    a.href = url;
    a.download = 'embeddingObjectArray.JSON';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.getElementById('downloadMessageDIV').innerText = `embeddingObjectArray.JSON saved`;
}
