
document.getElementById("processButton").addEventListener("click", startProcess);

function divContentFiller(divID, message){
    document.getElementById(divID).innerText += message;
}

function wipeStatusDIVmessages(listOfDIVs){
    listOfDIVs.forEach(id => {
        document.getElementById(id).innerText = '';
    });
}

async function startProcess(){
    wipeStatusDIVmessages(['s1', 's2', 's3', 's4', 's5', 's6']);
    let password = document.getElementById("password").value;
    let startNode = document.getElementById("startNode").value;
    let distance = document.getElementById("distance").value;
    // first return all nodes of selected type, then iterate through them
    let cypherQuery = `MATCH (q:${startNode}) RETURN q`;
    let nodeList = await neo4jQuery(cypherQuery, password);
    divContentFiller('s1', `${nodeList.length} of node type ${startNode} returned`);
    //next iterate through each of the selected nodes
    cycleThroughPaths(nodeList, password, startNode, distance);
}

async function cycleThroughPaths(nodeLst, psswrd, strtNode, dist){
    for (const obj of nodeLst) {
        let objID = obj._fields[0].identity.low;
        let paths = await getPaths(objID, psswrd, strtNode, dist);
        let pathCount = paths.length;
        divContentFiller('s2', `${pathCount} paths returned for node ${objID}\n`);
        let pathsIntoTextArray = await pathsIntoText(paths, startNode);
        let textIntoEmbeddingsArray = await batchEmbeddingRequest(pathsIntoTextArray, psswrd);
        let USDcost = (tokenTotal / 1000) * 0.0004;
        divContentFiller('s4', `---${textIntoEmbeddingsArray.length} embeddings produced at a cost of ${tokenTotal} tokens and $${USDcost}.`);
        let insertInVector = await vectorInsertion(textIntoEmbeddingsArray, strtNode, psswrd);
        divContentFiller('s5', insertInVector);
    }
    divContentFiller('s2', `---process complete.`);
    divContentFiller('s3', `---process complete.`);
}

async function pathsIntoText(pathArray, startNode){
    let pathTextArray = await parseFull(pathArray);
    console.log('pathTextArray', pathTextArray);
    divContentFiller('s3', `${pathTextArray.length} paths returned for node ${startNode}\n`);
    return pathTextArray;
}

async function getPaths(nodeID, password, startNode, distance){
    let cypherPathQuery = `MATCH path = (q:${startNode} WHERE ID(q) = ${nodeID})-[r*1..${distance}]->(n) WHERE NOT (n:${startNode}) RETURN path`;
    let paths = await neo4jQuery(cypherPathQuery, password);
    console.log('returned paths', paths);
    return paths;
}

async function neo4jQuery(cypher, psswrd){
    let res;
    console.log('calling Express /neo4jA', 'query is:', cypher);
    await axios.post('/neo4jA', {
        cypherQuery: cypher,
        password: psswrd
    })
        .then(function (response) {
            res = response;
        })
        .catch(function (error) {
            console.log(error);
        });
    if (!res.ok){ console.log('Neo4jA fetch status: ', res.status);}
    console.log('neo4jA response:', res);
    return res.data.theResult;
}
