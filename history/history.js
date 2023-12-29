async function checkLocalStorage(){
    let person = localStorage.getItem("person");
    let theLogs;
    console.log(person);
    if (person != null) {
        console.log("person object found");
        let personObject = JSON.parse(person);
        let NUID = personObject.NUID;
        try {
            theLogs = await getChatLogs(NUID);
            formatLogs(theLogs);
        } catch(err) {
            console.log('checkNEdb does not exist or had an issue', err);
        }
    } else {
        document.getElementById('history').innerText = `You need to have a conversation before you can have a history to call up... `;
    }
}

async function getChatLogs(idNum){
    let userID = idNum;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({idNumber: userID})
    };
    return fetch('/NEdbLogs', options)  // Added return here
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(returnedJSON => {
            if (returnedJSON.error) {
                console.error('Server error:', returnedJSON.error);
                return;
            }
            console.log('something came back');
            return returnedJSON;
        })
        .catch(e => {
            console.error('Fetch error:', e);
            throw e;  // This ensures that the error is also thrown to the calling function
        });
}

function formatLogs(chats){
    //this function takes an array of chat logs and outputs them to the website
    document.getElementById('history').innerText = `${chats}`;
}

checkLocalStorage();
