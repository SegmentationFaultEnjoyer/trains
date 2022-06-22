function msToTime(duration) {
    let seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24),
        days = parseInt(duration / (1000 * 60 * 60 * 24))
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`
}

function travelTimeToMs(value) {
    return value.travelTime.getHours() * 3600000
    + value.travelTime.getMinutes() * 60000
    + value.travelTime.getSeconds() * 1000;
}

function getTravelTime(train) {
    return new Date(2011, 0, 1,
        train.arrivalTime.getHours() - train.departureTime.getHours(),
        train.arrivalTime.getMinutes() - train.departureTime.getMinutes(),
        train.arrivalTime.getSeconds() - train.departureTime.getSeconds(),
        );
}


function processTime(timeString) {
    let time = timeString.split(':').map(el => parseInt(el));
    let dataObj = new Date();
    dataObj.setHours(...time);
    return dataObj;
}

module.exports = {msToTime, travelTimeToMs, getTravelTime, processTime};