
function reformatObjectsForPinecone(initialArrayOfObjects, strtNode){
    let reformatedObjectArray = [];
    initialArrayOfObjects.forEach(obj => {
        const timestamp = Date.now();
        const newObj = {id: obj.pathIDsString, values: obj.values, metadata: {naturalText: obj.naturalText, initiatingNode: obj.initiatingNode, pathArrayIDs: obj.pathArrayIDs, nodeOriginType: strtNode, insertionTimestamp: timestamp}};
        reformatedObjectArray.push(newObj);
    })
    return reformatedObjectArray;
}

function splitUpLargeArray(tooLargeArray, sizeLimit){
    let arrays = [];
    for (let i=0; i<tooLargeArray.length; i+=sizeLimit){
        arrays.push(tooLargeArray.slice(i, i+sizeLimit))
    }
    return arrays;
}

async function vectorInsertion(arrayOfObjects, startNode, password){
    let pineconeFormatedObjectArray = await reformatObjectsForPinecone(arrayOfObjects, startNode);
    let sizeLimit = 99;
    if (pineconeFormatedObjectArray.length > sizeLimit){
        let arrayOfRightSizedArrays = await splitUpLargeArray(pineconeFormatedObjectArray, sizeLimit);
        for (rightSizeArray of arrayOfRightSizedArrays){
            let upsertToPinecone = await pineconeUpsert(rightSizeArray, password);
            console.log('batch size', rightSizeArray.length, 'vector db response to upload', upsertToPinecone);
        }
    } else {
        let upsertToPinecone = await pineconeUpsert(pineconeFormatedObjectArray, password);
        console.log('batch size', pineconeFormatedObjectArray.length, 'vector db response to upload', upsertToPinecone);
    }
    let resultMessage = `${pineconeFormatedObjectArray.length} vectors inserted into Pinecone DB for originating node ${pineconeFormatedObjectArray[0].metadata.initiatingNode}.`;
    return resultMessage;
}

async function pineconeUpsert(arrayOfVectorObjects, psswrd){
    let res;
    console.log('calling Express /pineconeUpsert', 'query is:', cypher);
    await axios.post('/pineconeUpsert', {
        pineconeUpsertArray: arrayOfVectorObjects,
        password: psswrd
    })
        .then(function (response) {
            res = response;
        })
        .catch(function (error) {
            console.log(error);
        });
    if (!res.ok){ console.log('Pinecone upsert status: ', res.status);}
    console.log('Pinecone response:', res);
    return res;
}
