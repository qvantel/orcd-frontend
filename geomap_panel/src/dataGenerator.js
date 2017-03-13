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
        var data = [['Country', 'Frequency']];

        for (var key in this.ctrl.locations.countries) {
            data.push([key, Math.floor(Math.random() * 100)]);
        }

        return data;
    }
}
