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

    onCountryClicked (region) {
        region = region.toLowerCase();

        var regionIndex = this.ctrl.utilities.arrayIndexOf(this.selectedCountries, region);
        if (regionIndex === -1) {
            this.selectedCountries.push(region);
        } else {
            this.selectedCountries.splice(regionIndex, 1);
        }

        this.updateTemplateVariable();
    }

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
                true
            );
        }
    }

    formatQuery (query) {
        return query.split(',').join(' + ');
    }
}
