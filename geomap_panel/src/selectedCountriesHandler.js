const templateName = 'countries';
const templateLabel = 'Selected Countries';

/** This class will be responsible for handling selected countries */
export default class SelectedCountriesHandler {
    /**
    * Build the handler and set some initiate variables
    */
    constructor (ctrl) {
        this.ctrl = ctrl;
        this.selectedCountries = [];
    }

    /**
    * This should be called when a country has been clicked , it will handle the click and then update the template variables
    *
    * @param {string} region - Clicked region name;
    */
    onCountryClicked (region) {
        region = region.toLowerCase();
        if (typeof this.ctrl.locations.countries[region.toUpperCase()] === 'undefined') return;

        var regionIndex = this.selectedCountries.indexOf(region);
        if (regionIndex === -1) {
            this.selectedCountries.push(region);
        } else {
            this.selectedCountries.splice(regionIndex, 1);
        }
        this.selectedCountries = this.selectedCountries.sort();
        this.updateTemplateVariable();
    }

    /**
    * Updated the template variable via the templateHandler given the data that's been gathered here
    */
    updateTemplateVariable () {
        var th = this.ctrl.templateHandler;
        var countriesOptions = [];
        var countriesQuery = '';

        for (var i = 0; i < this.selectedCountries.length; i++) {
            var c = this.selectedCountries[i];
            countriesOptions.push(th.buildOption(c, c, true));
            countriesQuery += c + (i < this.selectedCountries.length - 1 ? ',' : '');
        }

        if (th.variableExists(templateName)) {
            if (countriesOptions.length > 0) {
                th.updateVariable(templateName, countriesOptions, countriesQuery, this.formatQuery(countriesQuery), this.selectedCountries);
            } else {
                th.deleteVariable(templateName);
            }
        } else {
            th.addVariable(
                'custom',
                templateName,
                templateLabel,
                countriesOptions,
                th.buildCurrent(this.formatQuery(countriesQuery), this.selectedCountries),
                countriesQuery,
                true,
                2
            );
        }
    }

    /**
    * Check if a country exists inside the selected countries array
    *
    * @param {String} country the country to be checked
    * @return {Boolean} The result if the country is in the array or not
    */
    isCountrySelected (country) {
        return this.selectedCountries.indexOf(country.toLowerCase());
    }

    /**
    * Format the query to be more readable
    */
    formatQuery (query) {
        return query.split(',').join(' + ');
    }

    /**
    * Read the template variable containing the selected countries
    * Iterate the countries and stroke them
    */
    checkCountriesTemplate () {
        this.selectedCountries = this.ctrl.templateHandler.getVariableCurrentValue('countries');

        if (typeof this.selectedCountries === 'undefined') {
            this.selectedCountries = [];
        }

        if (typeof this.ctrl.map !== 'undefined') {
            this.ctrl.map.updateStrokeColor();
        }
    }

    /**
    * Get the amount of countries thats currently selected
    *
    * @return {Number} the amount of selected countries
    */
    selectedCountriesAmount () {
        return this.selectedCountries.length;
    }

    /**
    * Cleat the all selected countries by deleting the template variable containing them
    */
    clear () {
        this.ctrl.templateHandler.deleteVariable(templateName);
    }
}
