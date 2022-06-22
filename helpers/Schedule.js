const RoutesTable = require('./RoutesTable');
const {msToTime} = require('./TimeFunctions');

class Schedule {
    constructor(data) {
        this.data = data;
        this.stations = this.getUniqueItemsList('departureStation', 'arrivalStation');
        this.routesTable = new RoutesTable(this.stations, data);
        this.tableForAlg = this.formTable();
        this.getAllPosibleRoutes();
    }

    formTable() {
        let table = new Map();
        this.stations.forEach(station => {
            let temp = this.routesTable.get(station).filter(el => el != null)
            table.set(station, temp.map(el => el[0].arrivalStation));
        })
        return table;
    }

    getUniqueItemsList(...itemProperties) {
        let items = new Set();
        for(let el of this.data) {
            for(let property of itemProperties)
                items.add(el[property]);
        }
        return items;
    }

    InitBuffers(value) {
        this.buffer = [value]
        this.passedStations = new Set([value]);
    }

    AddToBuffer(value) {
        this.buffer.push(value);
        this.passedStations.add(value);
    }

    RemoveFromBuffer(value) {
        this.buffer.pop();
        this.passedStations.delete(value);
    }

    getAllPosibleRoutes() {
        this.stations.forEach(station => {
            this.InitBuffers(station);
            this.getRoute(station);
        })
    }

    bufferForRoutes = []
    buffer = []
    passedStations = new Set();

    getRoute(departure) { 
        let row = this.tableForAlg.get(departure);
        
        for(let item of row) {
            if(this.passedStations.has(item)) continue;

            this.AddToBuffer(item);

            if(this.buffer.length == this.stations.size) {
                this.bufferForRoutes.push([...this.buffer]);
                this.RemoveFromBuffer(item);
                continue;
            }
               
            this.getRoute(item);
        }

        this.RemoveFromBuffer(departure);
    }

    getBestRoutes(option) {
        if(option != 'cost' && option != 'travelTime') return null;
        
        let routes = [];

        for(let route of this.bufferForRoutes) {
            let path = [];
            for(let i = 1; i < route.length; i++) {
                let trains = this.routesTable.get(route[i - 1], route[i]);
                let minRoute = this.getMinFromArr(trains, option);
                trains = trains.filter(train => train[option] === minRoute[option]);
                path.push(trains);
            }
            
            routes.push({
                path,
                [option]: parseFloat(this.getSumByProp(path, option).toFixed(5)) 
            });
        }
        
        let minRoute = this.getMinFromArr(routes, option);
        return routes.filter(route => route[option] === minRoute[option]);
    }   


    printAllRoutes(routes, prop) {
        for(let route of routes) {
            this.printRoute(route, prop);
        }
    }

    printRoute(route, propName) {
        let outputString = "";
        let prop = propName == 'travelTime' ? msToTime(route[propName]) : route[propName];
        route = route.path;

        for(let i = 0; i < route.length; i++) {
            if(route[i].length == 1) outputString += route[i][0].trainNumber;
            
            else {
                outputString += '[';
                for(let j = 0; j < route[i].length; j++) {
                    outputString += route[i][j].trainNumber;

                    if(j != route[i].length - 1) 
                        outputString += ', ';
                }
                outputString += ']';
            }
            
            if(i != route.length - 1)
                outputString += " --> ";
        }
        console.log('\x1b[33m\x1b[4m%s\x1b[0m', `Total ${propName}: ${prop}\n`);
        console.log('Path: \x1b[36m%s\x1b[0m', `${outputString}\n`);
    }

    getSumByProp(arr, prop) {
        return arr.reduce((sum, el) => sum + el[0][prop], 0);
    }

    getMinFromArr(arr, prop) {
        return arr.reduce((min, el) => el[prop] < min[prop] ? el : min, arr[0]);
    }
}

module.exports = Schedule;