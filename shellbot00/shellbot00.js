
document.getElementById("buttonAsk").addEventListener("click", getResponseFromFlask);

async function getResponseFromFlask(){
    let res;
    let passPhrase = document.getElementById("passPhrase").value;
    let questionText = document.getElementById("question").value;
    await axios.post('/botdata', {
        passPhrase: passPhrase,
        questionText: questionText
    })
        .then(function (response) {
            res = response;
            console.log('post response is:', res);
        })
        .catch(function (error) {
            console.log(error);
        });
    if (!res.ok){ console.log('Fetch error: ', res.status);}
    document.getElementById("response").innerText = res;
}
