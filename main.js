const fs = require('fs');
const path = require('path');

const processData = require('./helpers/processInputData');
const Schedule = require('./helpers/Schedule');

let raw_data = fs.readFileSync(path.join(__dirname, 'input', 'data.csv')).toString();
let data = processData(raw_data);

const schedule = new Schedule(data);

console.log('\x1b[1m=================BEST PATHES BY COST=================\x1b[0m\n');

let routesByPrice = schedule.getBestRoutes('cost');
if(routesByPrice)
    schedule.printAllRoutes(routesByPrice, 'cost');

console.log('\x1b[1m=================BEST PATHES BY TIME=================\x1b[0m\n');

let routesByTime = schedule.getBestRoutes('travelTime');
if(routesByTime)
    schedule.printAllRoutes(routesByTime, 'travelTime');