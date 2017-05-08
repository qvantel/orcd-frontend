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
            expect(defaults.clickToZoomEnabled).to.equal(true);
            expect(defaults.animate).to.equal(true);
            expect(defaults.animationDuration).to.equal(0.5);
            expect(defaults.useFakeData).to.equal(false);
        });
    });

    describe('when subscribing to a key, you should ge a callback', () => {
        var clickToZoomEnabledUpdated = false;
        beforeEach(() => {
            panelDataHandler.subscribe('clickToZoomEnabled', () => {
                clickToZoomEnabledUpdated = true;
            });
            panelDataHandler.panelDataUpdated('clickToZoomEnabled');
        });

        it('it should set the clickToZoomEnabled updated variable to true', () => {
            expect(clickToZoomEnabledUpdated).to.equal(true);
        });
    });

    describe('when subscribing to a multiple, you should get a callback when one of them has been altered', () => {
        var animateUpdated = false;
        beforeEach(() => {
            panelDataHandler.subscribe(['animate', 'animationDuration'], () => {
                animateUpdated = true;
            });
            panelDataHandler.panelDataUpdated('animate');
        });

        it('it should set the show legend and colors updated variables to true', () => {
            expect(animateUpdated).to.equal(true);
        });
    });

    describe('when a panelDataUpdate function is called without any subscriptions', () => {
        beforeEach(() => {
            panelDataHandler.panelDataUpdated('clicanimatekToZoomEnabled');
        });

        it('it should not give an exception', () => {});
    });

    describe('when manually calling resetToDefaults with overwrite and executeCallbacks', () => {
        var clickToZoomEnabled = false;

        beforeEach(() => {
            panelDataHandler.ctrl.panel.clickToZoomEnabled = false;

            panelDataHandler.subscribe('clickToZoomEnabled', () => {
                clickToZoomEnabled = true;
            })

            panelDataHandler.resetToDefaults(true, true);
        });

        it('it should execute the callbacks', () => {
            expect(clickToZoomEnabled).to.equal(true);
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
