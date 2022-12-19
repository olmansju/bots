const stateArray = [];

function buildStatusReport() {
    var stateArrayNoMap = [];
    let i = 1;
    for (var mapObj of stateArray) {
        var mapString = '#0' + i + '  Module: ' + mapObj.get('module') + '  Type: ' + mapObj.get('type') + '  Message: ' + mapObj.get('message') + '  Value: ' + mapObj.get('value');
        stateArrayNoMap.push(mapString);
        i ++;
    }
    if (stateArray.length > 0 && stateArray.length < 10) {
        document.getElementById("stateStatusArticle").innerHTML = stateArrayNoMap.slice().reverse().join('<br>');
    } else if (stateArray.length > 9) {
        document.getElementById("stateStatusArticle").innerHTML = stateArrayNoMap.slice(-9).reverse().join('<br>');
    } else {
        document.getElementById("stateStatusArticle").innerHTML = "Error: No state update";
    }
}

function updateState(module, type, message, value) {
    if (message !== "" && module !== "" && type !== "" && value !== "") {
        let m = new Map();
        m.set('module', module);
        m.set('type', type);
        m.set('message', message);
        m.set('value', value);
        stateArray.push(m); //adds to the back of the array
        buildStatusReport();
    }
}
