/** Class representing the DataFormatter */
export default class DataFormatter {
    constructor (ctrl) {
        this.ctrl = ctrl;
    }

    /**
    * Generate a readable data array for Google GeoCharts from data given by Graphite
    *
    * @param {array} inputData the data from Graphite
    * @return {dictionary} returns a dictionary where the key is the country and the value is the frequency
    */
    generate (inputData) {
        var data = [['Country', 'Frequency']];

        for (var key in inputData) {
            if (inputData[key]['datapoints'][0][0] !== null) {
                this.ctrl.log('A:' + inputData[key]['datapoints'][0][0]);
                data.push([inputData[key]['target'], inputData[key]['datapoints'][0][0]]);
            }
        }

        return data;
    }
}
