let formattedTranscript = "";

document.getElementById("copyButton").addEventListener("click", copyToClipboard);
document.getElementById("saveToLocalFileButton").addEventListener("click", downloadFile);

function buildFullTranscript() {
    formatTranscript(transcriptArray, "fullChatTranscript");
}

function formatTranscript(thePassedTranscriptArray, theElementID){
    thePassedTranscriptArray.forEach(value=> formattedTranscript += `<b>${value[0]}</b>: ${value[1]} <br>`);
    document.getElementById(theElementID).innerHTML = formattedTranscript;
}

function copyToClipboard(){
    navigator.clipboard.writeText(formattedTranscript);
    document.getElementById('messageCopied').innerText = "copied";
    setTimeout(clearMessage, 2800, 'messageCopied');
}

function downloadFile(){
    console.log('downloadFile called');
    let results = document.getElementById("fullChatTranscript").innerText;
    let file = new File([results], `${codeBotName}.txt`, {type: "text/plain"});
    console.log('file is:', file);
    const url = window.URL.createObjectURL(file);  //file.data
    const a = document.createElement('a');
    a.href = url;
    a.download = `${codeBotName}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.getElementById('messageSaved').innerText = `${codeBotName}.txt saved`;
    setTimeout(clearMessage, 2800, 'messageSaved');
}

function clearMessage(elementID){
    document.getElementById(elementID).innerText = "";
}
