import TrendCalculator from './trendCalculator';

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
        this.trendCalculator = new TrendCalculator(this.ctrl);
    }

    /**
    * Generate a readable data array for the map from data given by Graphite
    *
    * @param {array} inputData the data from Graphite
    * @return {dictionary} returns a dictionary where the key is the country and the value is the frequency
    */
    generate (dataList) {
        var res = [];
        if (this.ctrl.locations) {
            res = this.readData(dataList);
        }

        return res;
    }

    /**
    * Read the data
    *
    * @param {array} dataList the data
    * @return {array} the read data
    */
    readData (dataList) {
        var res = [];

        // Iterate all the data in order to find the wanted information (cur, min, max, trend)
        dataList.forEach((data) => {
            if (this.validateRegionCode(data.target.toUpperCase())) {
                var countryData = this.getCountryCurMinMaxTrend(data.datapoints);
                res[data.target] = countryData;
            }
        });

        // Store the first and last timestamp for ie the timelapse
        this.firstTimestamp = dataList[0].datapoints[0][1];
        this.lastTimestamp = dataList[0].datapoints[dataList[0].datapoints.length - 1][1];

        return res;
    }

    /**
    * Get the current, min and max value for the data provided.
    * @param {array} datapoints - The array of datapoints to calculate from
    * @return {object} - An object containing values for Current, Min, Max, Trend and an array containing all values. Undefined if datapoints is empty
    */
    getCountryCurMinMaxTrend (datapoints) {
        if (datapoints.length > 0) {
            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;
            var current = datapoints[datapoints.length - 1][datapointDef.value];
            var trend = this.trendCalculator.getTrend(datapoints);
            var all = [];

            if (current === null) {
                current = 0;
            }

            for (var point in datapoints) {
                var val = datapoints[point][datapointDef.value];

                if (val === null) {
                    val = 0;
                }

                min = Math.min(min, val);
                max = Math.max(max, val)

                all.push(Math.floor(datapoints[point][datapointDef.value]));
            }

            return {
                min: Math.floor(min),
                max: Math.floor(max),
                cur: Math.floor(current),
                trend: trend,
                all: all
            };
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
}
