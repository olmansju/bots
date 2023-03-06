let neo = 0;

function checkNeo4j(nuid){
    switch (version){
        case "AB 0.06":
            getInfoByNUID(nuid);
            break;
        default:
            break;
    }
}

async function getInfoByNUID(NUID){
    let res;
    //let cypherQuery = `MATCH (f: Faculty)-[advisor_for]-(s: Student) where f.nuid=${NUID} return s`;
    let cypherQuery = `MATCH (f: Faculty)-[af: advisor_for]-(s: Student) where f.nuid=${NUID} return f, af, s;`;
    console.log('calling Express /neo4j', 'nuid is:', NUID, 'cypherQuery is:', cypherQuery);
    await axios.post('/neo4j', {
        cypherQuery: cypherQuery
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
