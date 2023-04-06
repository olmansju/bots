
async function embeddingRequest(userText){
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

async function getCosineSimilarity(queryEmbeddings){
    //this function takes an array of 1536 vectors and compares it to course embeddings returning the top 3 matches
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
        return 0 ;
    }
}





