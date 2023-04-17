
document.getElementById("processButton").addEventListener("click", startProcess);

async function startProcess(){
    let password = document.getElementById("password").value;
    let startNode = document.getElementById("startNode").value;
    let distance = document.getElementById("distance").value;
    // first return all nodes of selected type, then iterate through them
    let cypherQuery = `MATCH (q:${startNode}) RETURN q.id`;
    let nodeList = await neo4jQuery(cypherQuery);
    //next iterate through each of the selected nodes
    let cypherPathQuery = `MATCH path = (s:Student)-[r*1..4]->(n) WHERE NOT (n:Student) AND ALL(rel IN r WHERE type(rel) <> "ADVISED_BY") RETURN path`;
}

async function neo4jQuery(cypher){
    let res;
    console.log('calling Express /neo4j', 'query is:', cypher);
    await axios.post('/neo4j', {
        cypherQuery: cypher
    })
        .then(function (response) {
            res = response;
        })
        .catch(function (error) {
            console.log(error);
        });
    if (!res.ok){ console.log('Neo4j fetch status: ', res.status);}
    console.log('neo4j response:', res);
}
