let loggedInStatus;

document.getElementById("logIn").addEventListener("click", checkIdOnServer);
document.getElementById("logOut").addEventListener("click", deleteFromLocalStorage);

async function checkIdOnServer(){
    let res;
    let userID = document.getElementById("univID").value;
    console.log('calling Express /NUID', 'id is:', userID);
    await axios.post('/NUID', {
        univID: userID
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
        if (typeof loggedInStatus !== 'undefined') {
            if (loggedInStatus != 1) {
                saveToLocalStorage(identity);
            }
        }
    }
    console.log('response', identity);
}

function saveToLocalStorage(personArray){
    let [NUID, fName, lName] = personArray;
    let personObject = { "lName": lName, "fName": fName, "NUID": NUID};
    let personObjectStringified = JSON.stringify(personObject);
    localStorage.setItem("person", personObjectStringified);
    loggedInStatus = 1;
    setLogInLogOut(loggedInStatus);
    console.log('saved to local storage...');
    document.getElementById('loggedInMessage').innerText = "you are logged in";
}

function deleteFromLocalStorage(){
    localStorage.removeItem('person');
    loggedInStatus = 0;
    setLogInLogOut(loggedInStatus);
    document.getElementById('needToLogInMessage').innerText = "you are logged out";
}

function checkLocalStorage(){
    let person = localStorage.getItem("person");
    console.log(person);
    if (person != null) {
        console.log("person object found");
        let personObject = JSON.parse(person);
        let fName = personObject.fName;
        let lName = personObject.lname;
        let NUID = personObject.NUID;
        document.getElementById("univID").value = NUID;
        loggedInStatus = 1;
        setLogInLogOut(loggedInStatus);
        document.getElementById('loggedInMessage').innerText = `Hi ${fName}!`;
    } else {
        loggedInStatus = 0;
        setLogInLogOut(loggedInStatus);
        document.getElementById('needToLogInMessage').innerText = `Hi, log in so we can chat!`;
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