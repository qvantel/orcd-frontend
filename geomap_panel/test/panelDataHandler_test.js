import PanelDataHandler from '../src/panelDataHandler';

describe('PanelDataHandler', () => {
    let panelDataHandler;
    let ctrl;

    beforeEach(() => {
        setupHandler();
    });

    describe('when retrieving the panel data handler defaults', () => {
        it('it should give an object with the correct defaults', () => {
            var defaults = panelDataHandler.getPanelDefaults();
            expect(defaults.showLegend).to.equal(true);
            expect(defaults.showBreadcrumbs).to.equal(true);
            expect(defaults.clickToZoomEnabled).to.equal(true);
            expect(defaults.animate).to.equal(true);
            expect(defaults.animationDuration).to.equal(2);
            expect(defaults.colorAmount).to.equal(1);
            expect(defaults.colors[0]).to.equal('#6699cc');
            expect(defaults.breadcrumbs[0]).to.equal('World');
            expect(defaults.zoomContinent).to.equal('World');
            expect(defaults.zoomSubContinent).to.equal('None');
            expect(defaults.zoomCountry).to.equal('None');
            expect(defaults.useFakeData).to.equal(false);
        });
    });

    describe('when subscribing to a key, you should ge a callback', () => {
        var showLegendUpdated = false;
        beforeEach(() => {
            panelDataHandler.subscribe('showLegend', () => {
                showLegendUpdated = true;
            });
            panelDataHandler.panelDataUpdated('showLegend');
        });

        it('it should set the show legend updated variable to true', () => {
            expect(showLegendUpdated).to.equal(true);
        });
    });

    describe('when subscribing to a multiple, you should get a callback when one of them has been altered', () => {
        var zoomUpdated = false;
        beforeEach(() => {
            panelDataHandler.subscribe(['zoomContinent', 'zoomSubContinent', 'zoomCountry'], () => {
                zoomUpdated = true;
            });
            panelDataHandler.panelDataUpdated('zoomContinent');
        });

        it('it should set the show legend and colors updated variables to true', () => {
            expect(zoomUpdated).to.equal(true);
        });
    });

    describe('when a panelDataUpdate function is called without any subscriptions', () => {
        beforeEach(() => {
            panelDataHandler.panelDataUpdated('zoomContinent');
        });

        it('it should not give an exception', () => {});
    });

    describe('when manually calling resetToDefaults with overwrite and executeCallbacks', () => {
        var showLegendUpdated = false;

        beforeEach(() => {
            panelDataHandler.ctrl.panel.colors = ['#fff', '#000'];
            panelDataHandler.ctrl.showLegend = false;

            panelDataHandler.subscribe('showLegend', () => {
                showLegendUpdated = true;
            })

            panelDataHandler.resetToDefaults(true, true);
        });

        it('it should execute the callbacks', () => {
            expect(showLegendUpdated).to.equal(true);
        });

        it('it should overwrite the set data', () => {
            expect(panelDataHandler.ctrl.panel.colors.length).to.equal(1);
            expect(panelDataHandler.ctrl.panel.colors[0]).to.equal('#6699cc');
            expect(panelDataHandler.ctrl.panel.showLegend).to.equal(true);
        });
    });

    function setupHandler () {
        ctrl = {
            'panel': {
                'useFakeData': true
            }
        };

        panelDataHandler = new PanelDataHandler(ctrl);
    }
});
