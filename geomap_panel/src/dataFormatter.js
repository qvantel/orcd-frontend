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
        var res = [['Country', (this.ctrl.panel.showTrends ? 'Trend' : 'Roaming calls')]];

        if (this.ctrl.locations) {
            if (this.ctrl.panel.showTrends) {
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
                var trend = this.calcTrend(data.datapoints[this.getFirstDatapointWithData(data.datapoints)], data.datapoints[this.getLastDatapointWithData(data.datapoints)]);
                res.push([data.target, trend]);
            }
        });

        return res;
    }

    getFirstDatapointWithData (datapoints) {
        for (var i = 0; i < datapoints.length; i++) {
            if (datapoints[i][0] !== null) {
                return i;
            }
        }

        return 0;
    }

    getLastDatapointWithData (datapoints) {
        for (var i = datapoints.length - 1; i >= 0; i--) {
            if (datapoints[i][0] !== null) {
                return i;
            }
        }

        return datapoints.length - 1;
    }

    calcTrend (first, last) {
        var firstValue = (first[0] !== null ? first[0] : 0);
        var firstTimestamp = first[1];
        var lastValue = (last[0] !== null ? last[0] : 0);
        var lastTimestamp = last[1];

        var deltaValue = lastValue - firstValue;
        var deltaTime = (lastTimestamp - firstTimestamp) / 1000;

        if (deltaTime === 0) {
            return 0;
        }

        return Math.atan(deltaValue / deltaTime) / (Math.PI * 0.5);
    }
}
