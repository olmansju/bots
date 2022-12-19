let processArray = [];

function processLog(functionName, dataSent){
    processArray.push([functionName, dataSent]);
    formatTranscript(processArray, "fullProcessing");
}