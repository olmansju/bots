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
    wipeStatusDIVmessages(['s1', 's2']);
    let theResult = 'action not available yet';
    let password = document.getElementById("password").value;
    let index = document.getElementById("index").value;
    let namespace = document.getElementById("namespace").value;
    let action = document.getElementById("action").value;
    if (action == "deleteNamespace"){
        divContentFiller('s1', `Action ${action} called on index ${index}, namespace ${namespace}\n`);
        theResult = await runAction(index, namespace, action, password);
        theResult = JSON.stringify(theResult);
    }
    divContentFiller('s2', `${theResult}\n`);
}

async function runAction(indx, nmSpace, actn, psswrd){
    let res;
    let resSpecific;
    console.log('calling Express /pineconeActions', 'action is:', actn, 'index:', indx, 'namespace', nmSpace);
    await axios.post('/pineconeActions', {
        index: indx,
        namespace: nmSpace,
        action: actn,
        password: psswrd
    })
        .then(function (response) {
            res = response;
        })
        .catch(function (error) {
            console.log(error);
        });
    if (res.status !== 200 && res.status !== 201) {
        console.log('Pinecone action status:', res.status);
        resSpecific = '0 something went wrong';
    } else {
        resSpecific = res.data.theResult;
    }
    return resSpecific;
}
