let processArray = [];

function processLog(functionName, dataSent){
    processArray.unshift([functionName, dataSent]);
    formatTranscript(processArray, "fullProcessing");
}