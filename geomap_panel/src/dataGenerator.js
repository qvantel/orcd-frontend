/** Class representing the DataGenerator */
export default class DataGenerator {
    /**
    * Create the DataGenerator, the constructor only keeps a list of all available countries
    */
    constructor (ctrl) {
        this.ctrl = ctrl;
    }

    /**
    * Generate and return a random value between 0 and 100 for every country
    * @return {dictionary} returns a dictionary where the key is the country and the value is a random value between 0 and 100
    */
    generate () {
        var data = [];

        if (this.ctrl.locations) {
            var timestampEnd = Math.floor(new Date().getTime() / 1000) * 1000;
            var timestampStart = timestampEnd - (24 * 60 * 60 * 1000);

            for (var key in this.ctrl.locations.countries) {
                data.push({
                    datapoints: this.generateDatapoints(timestampStart, timestampEnd),
                    target: key.toLowerCase()
                });
            }
        }

        return data;
    }

    /**
    * Generate data points between two timestamps
    *
    * @param {Number} timestampStart Timestamp of the first datapoint
    * @param {Number} timestampEnd Timestamp of the last datapoints
    * @return {Array} An array of datapoints
    */
    generateDatapoints (timestampStart, timestampEnd) {
        var datapoints = [];

        var timestampLength = this.ctrl.timestampLength;
        var steps = (timestampEnd - timestampStart) / timestampLength;
        for (var i = 0; i < steps; i++) {
            datapoints.push([
                this.ctrl.utilities.rand(0, 100),
                timestampStart + (i * timestampLength)
            ]);
        }

        return datapoints;
    }
}
