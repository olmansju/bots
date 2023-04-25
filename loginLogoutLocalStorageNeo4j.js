let loggedInStatus;

document.getElementById("logIn").addEventListener("click", checkIdOnServer);
document.getElementById("logOut").addEventListener("click", deleteFromLocalStorage);
document.getElementById("needToLogInMessage").style.fontSize = ".8em";
document.getElementById("loggedInMessage").style.fontSize = ".8em";

async function checkIdOnServer(){
    let res;
    let userID = document.getElementById("univID").value;
    let userIDint = parseInt(userID);
    let cypherQuery = `MATCH (q:Student {NUID: ${userIDint}}) return q`;
    console.log('calling Express /NUID', 'id is:', userID);
    await axios.post('/NUID', {
        univID: userID,
        neo4j: cypherQuery
    })
        .then(function (response) {
            res = response;
            console.log('post response is:', res);
        })
        .catch(function (error) {
            console.log(error);
        });
    if (!res.ok){ console.log('Fetch error: ', res.status);}
    let identity = res["data"][0]["allowed"];
    if (identity.length > 1){
        userName = identity[1];
        neo4jID = identity[3];
        console.log('userName is now:', userName, 'neo4jID:', neo4jID, 'set from server');
        if (typeof loggedInStatus !== 'undefined') {
            if (loggedInStatus != 1) {
                saveToLocalStorage(identity);
            }
        }
    }
    console.log('response', identity);
}

function saveToLocalStorage(personArray){
    let [NUID, fName, lName, neoID] = personArray;
    let personObject = { "lName": lName, "fName": fName, "NUID": NUID, "neo4jID": neoID};
    let personObjectStringified = JSON.stringify(personObject);
    localStorage.setItem("person", personObjectStringified);
    loggedInStatus = 1;
    setLogInLogOut(loggedInStatus);
    console.log('saved to local storage...', personObjectStringified);
    document.getElementById('loggedInMessage').innerText = " ";
}

function deleteFromLocalStorage(){
    localStorage.removeItem('person');
    loggedInStatus = 0;
    setLogInLogOut(loggedInStatus);
    document.getElementById('needToLogInMessage').innerText = "you are logged out";
    userName = "User";
}

function checkLocalStorage(){
    let person = localStorage.getItem("person");
    console.log(person);
    if (person != null) {
        let personObject = JSON.parse(person);
        if (personObject.neo4jID){
            console.log("person object found with neo4jID:", person.neo4jID);
            userName = personObject.fName;
            neo4jID = personObject.neo4jID;
            console.log('userName is now:', userName, 'set from local storage');
            let lName = personObject.lname;
            let NUID = personObject.NUID;
            document.getElementById("univID").value = NUID;
            loggedInStatus = 1;
            setLogInLogOut(loggedInStatus);
            document.getElementById('loggedInMessage').innerText = ` `;
            document.getElementById('logOut').textContent = `${userName} logout`;
        } else {
            loggedInStatus = 0;
            setLogInLogOut(loggedInStatus);
            document.getElementById('needToLogInMessage').innerText = `0. Log in... `;
        }
    } else {
        loggedInStatus = 0;
        setLogInLogOut(loggedInStatus);
        document.getElementById('needToLogInMessage').innerText = `0. Log in... `;
    }
}

function setLogInLogOut(status){
    const notLoggedIn = document.getElementsByClassName("notLoggedIn");
    const loggedIn = document.getElementsByClassName("loggedIn");
    console.log('notLoggedIn length:', notLoggedIn.length, 'loggedIn length:', loggedIn.length);
    if (status > 0){
        Array.from(notLoggedIn).forEach(elem => {
            elem.style.display = 'none';
        });
        Array.from(loggedIn).forEach(elem => {
            elem.style.display = 'block';
        });
        console.log('you are logged in');
    } else {
        Array.from(notLoggedIn).forEach(elem => {
            elem.style.display = 'block';
        });
        Array.from(loggedIn).forEach(elem => {
            elem.style.display = 'none';
        });
        console.log('you are not logged in');
    }
}

checkLocalStorage();