const pineconeIndex = "ilt";
let namespace = "advisorBot";

async function getUserResponseEmbeddings(userText){
    //this function takes a string and returns an embedding array of 1536 vectors or 0
    let res;
    let inputString = userText;
    let stringItem = inputString.trim();
    if (stringItem.length > 2){
        console.log('calling Express /embedADApost', 'stringItem is:', stringItem);
        await axios.post('/embedADApost', {
            stringToEmbed: stringItem,
            model: "text-embedding-ada-002"
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
        console.log('response', ADAresponse.data[0].embedding);
        return ADAresponse.data[0].embedding;
    } else {
        return 0;
    }
}

async function queryPineconeForBestMatch(embeddings, uniID){
    //this function takes an array of 1536 vectors and requests from Pinecone the best matches
    if (embeddings.length > 1530){
        console.log('embeddings ready to go...');
        let res;
        let resSpecific;
        console.log('calling Express /pineconeQuery', 'query is:', embeddings);
        await axios.post('/pineconeQuery', {
            pineconeVector: embeddings,
            numOfMatches: 3,
            includeVectors: false,
            includeVectorMetadata: true,
            filter: {
                initiatingNode: parseInt(neo4jID)
            },
            password: uniID,
            index: pineconeIndex,
            namespace: namespace
        })
            .then(function (response) {
                res = response;
                console.log('the pineconeQuery res', res);
            })
            .catch(function (error) {
                console.log(error);
            });
        if (res.status !== 200 && res.status !== 201) {
            console.log('Pinecone query status:', res.status);
            resSpecific = '0 something went wrong';
        } else {
            resSpecific = res.data.theResult;
        }
        return resSpecific;
    } else {
        return 0 ;
    }
}
