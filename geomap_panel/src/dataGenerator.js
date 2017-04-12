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

        for (var key in this.ctrl.locations.countries) {
            if (this.ctrl.panel.showTrends) {
                data.push([key, Math.random() * 2 - 1]);
            } else {
                var min = Math.floor(Math.random() * 100) + 1;
                var max = min + Math.floor(Math.random() * 100) + 1;
                var cur = Math.floor(Math.random() * (max - min + 1) + min);

                data[key] = {
                    min: min,
                    max: max,
                    cur: cur
                };
            }
        }

        return data;
    }
}
