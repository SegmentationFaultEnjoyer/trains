class RoutesTable {
    constructor(stations, scheduleData) {
        this.data = scheduleData;
        this.stations = stations;
        this.possibleRoutesTable = new Map();
        this.navbar = Array.from(this.stations);
        this.setRoutes();
    }

    formatGetArgs(departure, arrival = null) {
        if(typeof(departure) == 'number') 
            departure = this.navbar.find(el => this.navbar.indexOf(el) == departure);  
        if(arrival != null && typeof(arrival) == 'string')
            arrival = this.navbar.indexOf(arrival);

        return {i: departure, j: arrival};
    }

    get(departure, arrival = null) {
        const {i , j} = this.formatGetArgs(departure, arrival);

        if(arrival == null) return this.possibleRoutesTable.get(i);

        if(j < 0 || j > this.navbar.length || !this.possibleRoutesTable.has(i)){
            console.log(i, j);
            console.warn('Wrong argument passed to get_function');
            return null;
        } 
            
        return this.possibleRoutesTable.get(i)[j];
    }

    setRoutes() {
        this.stations.forEach(station => {
            this.possibleRoutesTable.set(station, this.getRoutes(station));
        })
    }

    getRoutes(station) {
        let possibleRoutes = this.data.filter(el => el.departureStation === station)
        let formattedRoutes = [];

        for(let el of this.navbar) {
            if(possibleRoutes.find(route => route.arrivalStation === el))
                formattedRoutes.push(possibleRoutes.filter(route => route.arrivalStation === el));
            else
                formattedRoutes.push(null);
        }

        return formattedRoutes;
    }
}


module.exports = RoutesTable;