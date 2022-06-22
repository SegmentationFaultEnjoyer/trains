const {getTravelTime, processTime, travelTimeToMs} = require('./TimeFunctions');

function processData(data) {
    let dataObjects = [];
    data
        .split('\r\n')
        .forEach(value => {
            let newValue = value.split(';');
            let trainObj = {
                trainNumber: Number(newValue[0]),
                departureStation: newValue[1].trim(),
                arrivalStation: newValue[2].trim(),
                cost: parseFloat(newValue[3]),
                departureTime: processTime(newValue[4].trim()),
                arrivalTime: processTime(newValue[5].trim())
            }
            trainObj.travelTime = getTravelTime(trainObj);
            trainObj.travelTime = travelTimeToMs(trainObj);
            dataObjects.push(trainObj);
        });
    return dataObjects;
}

module.exports = processData;