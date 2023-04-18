

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
    //works on JSON of neo4j paths; returns the path as an array of the ids, a string of same 45:12:82, and the text
    let parsedArrayOfObjects = [];
    let lastSegmentEndId = 1;
    //parse each path
    arrayOfPassedObjects.forEach(path => {
        let pathArrayIDs = [];
        let pathText = '';
        let pathElementCount;
        let pathSegments = path._fields[0].segments;
        if (pathSegments.length > 1){
            pathElementCount = ((pathSegments.length * 2) -1);
        } else {
            pathElementCount = (pathSegments.length * 2);
        }
        pathText += `There are ${pathElementCount} interrelated elements in this path. `;
        //parse each segment
        pathSegments.forEach(async pathElement => {
            let startLabelLowercase = pathElement.start.labels[0].split('_').join(' ').toLowerCase();
            let endLabelLowercase = pathElement.end.labels[0].split('_').join(' ').toLowerCase();
            let relationshipLabelLowercase = pathElement.relationship.type.split('_').join(' ').toLowerCase();
            if (pathArrayIDs.length == 0 || pathElement.start.identity.low != pathArrayIDs.at(-1)){
                pathArrayIDs.push(pathElement.start.identity.low, pathElement.relationship.identity.low, pathElement.end.identity.low);
            } else {
                pathArrayIDs.push(pathElement.relationship.identity.low, pathElement.end.identity.low);
            }
            pathText += `This segment has a ${startLabelLowercase} that ${relationshipLabelLowercase} a ${endLabelLowercase}. `;
            //first node in segment
            let descriptionCapture = '';
            if (Object.keys(pathElement.start.properties).length > 0 && pathElement.start.identity.low != lastSegmentEndId) {
                pathText += `The ${startLabelLowercase} has the following details: `;
                //first node properties
                Object.keys(pathElement.start.properties).forEach(function (skey, index) {
                    if (typeof pathElement.start.properties[skey] !== 'object') {
                        let isURL = isValidHttpUrl(pathElement.start.properties[skey]);
                        if (isURL) {
                            pathText += `${skey.split('_').join(' ')} is located at the following url: ${pathElement.start.properties[skey]} `;
                        } else {
                            pathText += `${skey.split('_').join(' ')}: ${pathElement.start.properties[skey].split('_').join(' ')}. `;
                        }
                    }
                });
            } else {
                pathText += `The ${startLabelLowercase} is the same one described above. `;
            }
            //relationship between the two segments
            if (Object.keys(pathElement.relationship.properties).length > 0) {
                pathText += `The relationship between the ${startLabelLowercase} and ${endLabelLowercase} can be further characterized by the following details: `;
                //relationship properties
                Object.keys(pathElement.relationship.properties).forEach(function (rkey, index) {
                    if (typeof pathElement.relationship.properties[rkey] !== 'object') {
                        let isURLr = isValidHttpUrl(pathElement.relationship.properties[rkey]);
                        if (isURLr) {
                            pathText += `${rkey.split('_').join(' ')} is located at the following url: ${pathElement.relationship.properties[rkey]} `;
                        } else {
                            pathText += `${rkey.split('_').join(' ')}: ${pathElement.relationship.properties[rkey].split('_').join(' ')}. `;
                        }
                    }
                });
            } else {
                pathText += `The relationship between the ${startLabelLowercase} and ${endLabelLowercase} is based on the fact that the ${startLabelLowercase} ${relationshipLabelLowercase} a ${endLabelLowercase}. `;
            }
            if (Object.keys(pathElement.end.properties).length > 0) {
                lastSegmentEndId = pathElement.end.identity.low;
                pathText += `The ${endLabelLowercase} has the following details: `;
                Object.keys(pathElement.end.properties).forEach(function (ekey, index) {
                    if (typeof pathElement.end.properties[ekey] !== 'object' && pathElement.end.properties[ekey] != undefined) {
                        let isURLe = isValidHttpUrl(pathElement.end.properties[ekey]);
                        if (isURLe) {
                            pathText += `${ekey.split('_').join(' ')} is located at the following url: ${pathElement.end.properties[ekey]} `;
                        } else {
                            pathText += `${ekey.split('_').join(' ')}: ${pathElement.end.properties[ekey].split('_').join(' ')}. `;
                        }
                    }
                });
            }
        })
        let pathIDsString = pathArrayIDs.join(':');
        let initiatingNode = pathArrayIDs[0];
        parsedArrayOfObjects.push({'initiatingNode': initiatingNode, 'pathIDsString': pathIDsString, 'pathArrayIDs': pathArrayIDs, 'naturalText': pathText});
    })
    return parsedArrayOfObjects;
}
