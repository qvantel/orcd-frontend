/** Datapoint definition */
const datapointDef = {
    value: 0,
    timestamp: 1
};

/** Class representing the DataFormatter */
export default class DataFormatter {
    /**
    * Build the data formatter
    */
    constructor (ctrl) {
        this.ctrl = ctrl;
    }

    /**
    * Generate a readable data array for Google GeoCharts from data given by Graphite
    *
    * @param {array} inputData the data from Graphite
    * @return {dictionary} returns a dictionary where the key is the country and the value is the frequency
    */
    generate (dataList) {
        var res = [['Country', 'Frequency']];
        var trend = true;

        if (this.ctrl.locations) {
            if (trend) {
                res = this.readTrend(dataList, res);
            } else {
                res = this.readData(dataList, res);
            }
        }

        return res;
    }

    /**
    * Read the data
    *
    * @param {array} dataList the data
    * @param {array} res where the read data should be stored
    * @return {array} the read data
    */
    readData (dataList, res) {
        dataList.forEach((data) => {
            if (this.validateRegionCode(data.target.toUpperCase())) {
                var sum = this.sumDatapointValues(data.datapoints);
                res.push([data.target, sum]);
            }
        });

        this.log(dataList);
        return res;
    }

    /**
    * Summarize data value in each datapoint
    *
    * @param {array} datapoints - the array of datapoints to be summarized
    * @return {int} - the sum of the value of the datapoints
    */
    sumDatapointValues (datapoints) {
        var res = 0;

        datapoints.forEach((datapoint) => {
            res += datapoint[datapointDef.value];
        });

        return res;
    }

    /**
    * Do a check on the region code, if the length is 2, approve, otherwise use the two last characters
    *
    * @param {string} region the region code to be validated
    * @return {string} the validated region
    */
    validateRegionCode (region) {
        return (typeof this.ctrl.locations.countries[region] !== 'undefined');
    }

    readTrend (dataList, res) {
        dataList.forEach((data) => {
            if (this.validateRegionCode(data.target.toUpperCase())) {
                var trend = this.calcTrend(this.getFirstDatapointWithData(data.datapoints), this.getLastDatapointWithData(data.datapoints));
                res.push([data.target, trend]);
            }
        });

        return res;
    }

    getFirstDatapointWithData (datapoints) {
        for (var i = 0; i < datapoints.length; i++) {
            if (datapoints[i][0] !== null) {
                return datapoints[i][0];
            }
        }

        return 0;
    }

    getLastDatapointWithData (datapoints) {
        for (var i = datapoints.length - 1; i >= 0; i--) {
            if (datapoints[i][0] !== null) {
                return datapoints[i][0];
            }
        }

        return 0;
    }

    calcTrend (first, last) {
        this.ctrl.log('first: ' + first);
        this.ctrl.log('last: ' + last);
        this.ctrl.log('--');

        if (first === null) {
            first = 0;
        }

        if (last === null) {
            last = 0;
        }

        if (last > first && first !== 0) {
            return last / first;
        }

        if (last < first && last !== 0) {
            this.ctrl.log(first / last * -1);
            return first / last * -1;
        }

        return 0;
    }
}
