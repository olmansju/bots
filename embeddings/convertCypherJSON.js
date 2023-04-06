
function isValidHttpUrl(string){
    //returns true if passed string is formatted like a url
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

function parseFull(arrayOfPassedObjects) {
    //works on JSON of paths ending in empty leaf nodes returns the leafNodeID and the text
    let parsedArrayOfObjects = [];
    let lastSegmentEndId = 1;
    let resultDiv = document.getElementById('result');
    document.getElementById('pathTotal').innerText = arrayOfPassedObjects.length
    //parse each path
    arrayOfPassedObjects.forEach(path => {
        let pathText = '';
        let leafNodeIDint = path._fields[0].segments.at(-1).end.identity.low;
        let pathSegments = path._fields[0].segments;
        pathText += `There are ${pathSegments.length} interrelated segments in this path. \n `;
        resultDiv.innerHTML += `There are ${pathSegments.length} interrelated segments in this knowledge path. <br>`;
        //parse each segment
        pathSegments.forEach(async pathElement => {
            let startLabelLowercase = pathElement.start.labels[0].split('_').join(' ').toLowerCase();
            let endLabelLowercase = pathElement.end.labels[0].split('_').join(' ').toLowerCase();
            let relationshipLabelLowercase = pathElement.relationship.type.split('_').join(' ').toLowerCase();

            resultDiv.innerHTML += `--Id: ${pathElement.start.identity.low}-->${pathElement.relationship.identity.low}-->${pathElement.end.identity.low} <br> --Path: This segment has a ${startLabelLowercase} that ${relationshipLabelLowercase} a ${endLabelLowercase}<br>`;
            pathText += `This segment has a ${startLabelLowercase} that ${relationshipLabelLowercase} a ${endLabelLowercase}. \n `;
            //first node in segment
            let descriptionCapture = '';
            if (Object.keys(pathElement.start.properties).length > 0 && pathElement.start.identity.low != lastSegmentEndId) {
                descriptionCapture += '----';
                pathText += `The ${startLabelLowercase} has the following details: \n `;
                descriptionCapture += `The ${pathElement.start.labels[0]} has the following details: <br>`;
                //first node properties
                Object.keys(pathElement.start.properties).forEach(function (skey, index) {
                    if (typeof pathElement.start.properties[skey] !== 'object') {
                        descriptionCapture += '--------';
                        let isURL = isValidHttpUrl(pathElement.start.properties[skey]);
                        if (isURL) {
                            pathText += `${skey.split('_').join(' ')} is located at the following url: ${pathElement.start.properties[skey]} \n `;
                            descriptionCapture += `${skey.split('_').join(' ')} is located at the following url: ${pathElement.start.properties[skey]}  `;
                        } else {
                            pathText += `${skey.split('_').join(' ')}: ${pathElement.start.properties[skey].split('_').join(' ')}. \n `;
                            descriptionCapture += `${skey.split('_').join(' ')}: ${pathElement.start.properties[skey]} .`;
                        }
                        descriptionCapture += '<br>';
                    }
                });
                descriptionCapture += '<br>';
            } else {
                pathText += `The ${startLabelLowercase} is the same one described above. \n `;
                descriptionCapture += `The ${startLabelLowercase} is the same one described above. <br>`;
            }
            //relationship between the two segments
            if (Object.keys(pathElement.relationship.properties).length > 0) {
                descriptionCapture += '----';
                pathText += `The relationship between the ${startLabelLowercase} and ${endLabelLowercase} can be further characterized by the following details: \n `;
                descriptionCapture += `The relationship between the ${startLabelLowercase} and ${endLabelLowercase} can be further characterized by the following paramters: <br>`;
                //relationship properties
                Object.keys(pathElement.relationship.properties).forEach(function (rkey, index) {
                    if (typeof pathElement.relationship.properties[rkey] !== 'object') {
                        descriptionCapture += '--------';
                        let isURLr = isValidHttpUrl(pathElement.relationship.properties[rkey]);
                        if (isURLr) {
                            pathText += `${rkey.split('_').join(' ')} is located at the following url: ${pathElement.relationship.properties[rkey]} \n `;
                            descriptionCapture += `${rkey.split('_').join(' ')} is located at the following url: ${pathElement.relationship.properties[rkey]} .`;
                        } else {
                            pathText += `${rkey.split('_').join(' ')}: ${pathElement.relationship.properties[rkey].split('_').join(' ')}. \n `;
                            descriptionCapture += `${rkey.split('_').join(' ')}: ${pathElement.relationship.properties[rkey].split('_').join(' ')} .`;
                        }
                        descriptionCapture += '<br>';
                    }
                });
            } else {
                pathText += `The relationship between the ${startLabelLowercase} and ${endLabelLowercase} is based on the fact that the ${startLabelLowercase} ${relationshipLabelLowercase} a ${endLabelLowercase}. \n `;
                descriptionCapture += `This segment has a ${startLabelLowercase} that ${relationshipLabelLowercase} a ${endLabelLowercase}<br>`;
            }
            if (Object.keys(pathElement.end.properties).length > 0) {
                lastSegmentEndId = pathElement.end.identity.low;
                descriptionCapture += '----';
                pathText += `The ${endLabelLowercase} has the following details: \n `;
                descriptionCapture += `The ${endLabelLowercase} has the following details: <br>`;
                Object.keys(pathElement.end.properties).forEach(function (ekey, index) {
                    if (typeof pathElement.end.properties[ekey] !== 'object' && pathElement.start.properties[ekey] != undefined) {
                        descriptionCapture += '--------';
                        let isURLe = isValidHttpUrl(pathElement.end.properties[ekey]);
                        if (isURLe) {
                            pathText += `${ekey.split('_').join(' ')} is located at the following url: ${pathElement.end.properties[ekey]}  \n`;
                            descriptionCapture += `${ekey.split('_').join(' ')} is located at the following url: ${pathElement.end.properties[ekey]}  `;
                        } else {
                            pathText += `${ekey.split('_').join(' ')}: ${pathElement.end.properties[ekey].split('_').join(' ')}. \n `;
                            descriptionCapture += `${ekey.split('_').join(' ')}: ${pathElement.end.properties[ekey].split('_').join(' ')}.`;
                        }
                        descriptionCapture += '<br>';
                    }
                });
            }
            descriptionCapture += '<br>'
            resultDiv.innerHTML += descriptionCapture;
        })
        parsedArrayOfObjects.push({'leafNodeID': leafNodeIDint, 'naturalText': pathText});
    })
    return parsedArrayOfObjects;
}