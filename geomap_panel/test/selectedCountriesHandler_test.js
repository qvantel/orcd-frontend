import SelectedCountriesHandler from '../src/selectedCountriesHandler';
import Utilities from '../src/utilities';
import TemplateHandler from '../src/templateHandler';

describe('SelectedCountriesHandler', () => {
    let selectedCountriesHandler;
    let ctrl;
    let variableSrv;
    let templateSrv;

    beforeEach(() => {
        setupHandler();
    });

    describe('when a country has been clicked', () => {
        beforeEach(() => {
            selectedCountriesHandler.onCountryClicked('SE');
        });

        it('it should be added to the countries array', () => {
            expect(selectedCountriesHandler.selectedCountries[0]).to.equal('se');
        });
    });

    describe('when a country has been clicked twice', () => {
        beforeEach(() => {
            selectedCountriesHandler.onCountryClicked('SE');
            selectedCountriesHandler.onCountryClicked('SE');
        });

        it('it should not be present in the array', () => {
            expect(selectedCountriesHandler.selectedCountries.length).to.equal(0);
        });
    });

    describe('when two countries has been selected', () => {
        beforeEach(() => {
            selectedCountriesHandler.onCountryClicked('SE');
            selectedCountriesHandler.onCountryClicked('DE');
        });

        it('it should both be in the array', () => {
            expect(selectedCountriesHandler.selectedCountries[0]).to.equal('se');
            expect(selectedCountriesHandler.selectedCountries[1]).to.equal('de');
        });
    });

    function setupHandler () {
        var utilities = new Utilities();

        templateSrv = {
            init: () => {
            }
        };

        variableSrv = {
            variables: [],
            updateVariable: () => {
            },
            $rootScope: {
                $emit: () => {
                },
                $broadcast: () => {
                }
            }
        };
        variableSrv.addVariable = (data) => {
            variableSrv.variables.push({
                name: data.name,
                current: data.current
            });
        };

        ctrl = {
            utilities: utilities,
            templateHandler: new TemplateHandler(ctrl, templateSrv, variableSrv)
        };

        selectedCountriesHandler = new SelectedCountriesHandler(ctrl);
    }
});
