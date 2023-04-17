
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
        let pathCount = await getPaths(objID, psswrd, strtNode, dist);
        divContentFiller('s2', `${pathCount} paths returned for node ${objID}\n`);
    }
    divContentFiller('s2', `---process complete.`);
}

async function getPaths(nodeID, password, startNode, distance){
    let cypherPathQuery = `MATCH path = (q:${startNode} WHERE ID(q) = ${nodeID})-[r*1..${distance}]->(n) WHERE NOT (n:${startNode}) RETURN path`;
    let paths = await neo4jQuery(cypherPathQuery, password);
    console.log('returned paths', paths);
    return paths.length;
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
