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
        this.firstTimestamp = undefined;
        this.lastTimestamp = undefined;
    }

    /**
    * Generate a readable data array for Google GeoCharts from data given by Graphite
    *
    * @param {array} inputData the data from Graphite
    * @return {dictionary} returns a dictionary where the key is the country and the value is the frequency
    */
    generate (dataList) {
        var res = [];

        if (this.ctrl.locations) {
            res = this.readData(dataList, res);
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
                var countryData = this.getCountryCurMinMax(data.datapoints);
                res[data.target] = countryData;
            }
        });

        this.firstTimestamp = dataList[0].datapoints[0][1];
        this.lastTimestamp = dataList[0].datapoints[dataList[0].datapoints.length - 1][1];

        return res;
    }

    getCountryCurMinMax (datapoints) {
        if (datapoints.length > 0) {
            var min = 0;
            var max = 0;
            var current = datapoints[datapoints.length - 1][datapointDef.value];
            var all = [];

            if (current === null) {
                current = 0;
            }

            for (var point in datapoints) {
                var val = datapoints[point][datapointDef.value];

                if (val === null) {
                    val = 0;
                }

                if ((min === 0 || val < min)) {
                    min = val;
                }

                if (datapoints[point][datapointDef.value] > max) {
                    max = val;
                }

                all.push(datapoints[point][datapointDef.value]);
            }

            return {min: min, max: max, cur: current, all: all};
        }

        return undefined;
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

    getDataLength () {
        return this.dataLength;
    }
}
