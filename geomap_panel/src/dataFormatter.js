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
}
