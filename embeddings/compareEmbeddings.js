
document.getElementById("compareEmbeddingsButton").addEventListener("click", organizer);

document.getElementById('totalEmbeddingsDIV').innerText = `Total embeddings: ${embeddingObjectArray.length}`;

async function organizer(){
    console.log('organizer function called...');
    let theQueryObject = await embeddingRequest();
    console.log('theQueryObject is:', theQueryObject);
    let top3Matches = await getCosineSimilarity(theQueryObject.embeddings);
    document.getElementById('resultOfComparisonProcess').innerText = `the top 3 matches are:\n1. ${JSON.stringify(top3Matches[0].naturalText)} \n\n2. ${JSON.stringify(top3Matches[1].naturalText)}\n\n3. ${JSON.stringify(top3Matches[2].naturalText)}`;
}

async function embeddingRequest(){
    let res;
    let queryObject = {'queryID': 17};
    let mod = "text-embedding-ada-002";
    let inputString = document.getElementById('testQuery').value;
    let stringItem = inputString.trim();
    queryObject.naturalText = stringItem;
    if (stringItem.length > 2){
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
        console.log('response', ADAresponse.data[0].embedding);
        queryObject.embeddings = ADAresponse.data[0].embedding;
        console.log('the in embeddingResponse queryObject:', queryObject);
        return queryObject;
    } else {
        document.getElementById('resultOfComparisonProcess').innerText = 'You need to enter more than two characters of text.';
    }
}

async function getCosineSimilarity(queryEmbeddings){
    if (queryEmbeddings.length > 1200){
        console.log('queryObject.embeddings is:', queryEmbeddings);
        const cosineSimilarity = (vecA, vecB) => {
            return math.dot(vecA, vecB) / (math.norm(vecA) * math.norm(vecB));
        };
        const contentEmbeddings = embeddingObjectArray;
        const queryEmbedding = queryEmbeddings;

        const similarities = contentEmbeddings.map(contentEmbedding => cosineSimilarity(queryEmbedding, contentEmbedding.embeddings));

        const top3Indices = similarities
            .map((value, index) => ({ value, index }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map(entry => entry.index);

        const top3Matches = top3Indices.map(index => contentEmbeddings[index]);
        return top3Matches;
    } else {
        document.getElementById('resultOfComparisonProcess').innerText = 'Something went wrong with the embeddings, fewer than 1200, expected 1536.';
    }
}





