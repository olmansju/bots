
function getLength(jsonArray, msg){
    let jsonArrayString = JSON.stringify(jsonArray);
    let encoder = new TextEncoder();
    let encodedString = encoder.encode(jsonArrayString);
    console.log('Pinecone-headed array that is:', msg, formatBytes(encodedString.length));
}

function formatBytes(bytes, decimals = 2) {
    let answer;
    if (!+bytes) {
        answer =  '0 Bytes';
    } else {
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        answer = `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }
    return answer;
}

function reformatObjectsForPinecone(initialArrayOfObjects, strtNode){
    let reformatedObjectArray = [];
    initialArrayOfObjects.forEach(obj => {
        const timestamp = Date.now();
        const newObj = {id: obj.pathIDsString, values: obj.values, metadata: {naturalText: obj.naturalText, initiatingNode: obj.initiatingNode, nodeOriginType: strtNode, insertionTimestamp: timestamp}};
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
    if (arrayOfObjects.length < 1){
        return 'no vectors to insert. \n';
    } else {
        let msg = await vectorInsertion2(arrayOfObjects, startNode, password);
        return msg;
    }
}

async function vectorInsertion2(arrayOfObjects, startNode, password){
    let pineconeFormatedObjectArray = await reformatObjectsForPinecone(arrayOfObjects, startNode);
    getLength(pineconeFormatedObjectArray, 'full array passed to vectorInsertion2 is:');
    let sizeLimit = 20;
    let vectorsInserted = 0;
    if (pineconeFormatedObjectArray.length > sizeLimit){
        console.log('Pinecone prep: array too big, splitting it up');
        let arrayOfRightSizedArrays = await splitUpLargeArray(pineconeFormatedObjectArray, sizeLimit);
        for (rightSizeArray of arrayOfRightSizedArrays){
            getLength(rightSizeArray, 'partial array passed to vectorInsertion2 is:');
            let upsertToPinecone = await pineconeUpsert(rightSizeArray, password);
            vectorsInserted = vectorsInserted + upsertToPinecone;
            console.log('batch size', rightSizeArray.length, 'vector db response to upload', upsertToPinecone);
        }
    } else if (pineconeFormatedObjectArray.length < 1){
        console.log('Pinecone prep: array is of 0 length, nothing to do.');
        return `no objects to insert startNode is: ${startNode} \n`;
    } else {
        console.log('Pinecone prep: things to upsert...');
        let upsertToPinecone = await pineconeUpsert(pineconeFormatedObjectArray, password);
        vectorsInserted = upsertToPinecone;
        console.log('batch size', pineconeFormatedObjectArray.length, 'vector db response to upload', upsertToPinecone);
    }
    let resultMessage = `${vectorsInserted} vectors inserted into Pinecone DB for originating node ${pineconeFormatedObjectArray[0].metadata.initiatingNode}.\n`;
    return resultMessage;
}

async function pineconeUpsert(arrayOfVectorObjects, psswrd){
    let res;
    let resSpecific;
    console.log('calling Express /pineconeUpsert', 'query is:', arrayOfVectorObjects);
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
    if (res.status !== 200 && res.status !== 201) {
        console.log('Pinecone upsert status:', res.status);
        resSpecific = '0 something went wrong';
    } else {
        resSpecific = res.data.theResult.upsertedCount;
    }
    return resSpecific;
}
