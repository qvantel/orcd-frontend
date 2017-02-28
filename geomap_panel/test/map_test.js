import Map from '../src/map';

describe('Map', () => {
    let map;
    let ctrl;

    describe('when a map is created', () => {
        beforeEach((done) => {
            setupMap(() => {
                done();
            });
        });
        it('should add Google GeoCharts to the map div', () => {
            expect(document.getElementById('fixture').children.length).to.not.equal(0);
        });
    });

    describe('when the region option has been altered', () => {
        beforeEach((done) => {
            setupMap(() => {
                done();
            });
            map.setRegion('SE');
        });

        it('the map option for region should be set to the specified region', () => {
            expect(map.options.region).to.equal('SE');
        });
    });

    describe('when the legend is shown', () => {
        beforeEach((done) => {
            setupMap(() => {
                done();
            });
            ctrl.panel.showLegend = true;
            map.toggleLegend();
        });

        it('the legend in map option should be built accordingly', () => {
            expect(map.options.legend.textStyle.color).to.equal('#000');
        });
    });

    describe('when the legend is hidden', () => {
        beforeEach((done) => {
            setupMap(() => {
                done();
            });
            ctrl.panel.showLegend = false;
            map.toggleLegend();
        });

        it('the legend in map option should be built accordingly', () => {
            expect(map.options.legend).to.equal('none');
        });
    });

    describe('when a new color scheme is set', () => {
        beforeEach((done) => {
            setupMap(() => {
                done();
            });
            map.setColors(['#ff0000', '#00ff00', '#0000ff']);
        });

        it('the color in map option should be correctly set', () => {
            expect(map.options.colorAxis.colors[0]).to.equal('#f5f5f3');
            expect(map.options.colorAxis.colors[1]).to.equal('#ff0000');
            expect(map.options.colorAxis.colors[2]).to.equal('#00ff00');
            expect(map.options.colorAxis.colors[3]).to.equal('#0000ff');
        });
    });

    describe('when showLegend is false', () => {
        beforeEach((done) => {
            setupMap(() => {
                done();
            }, false);
        });
        it('the legend should be false in config', () => {
            expect(map.options.legend).to.equal('none');
        });
    });

    afterEach(() => {
        document.body.removeChild(document.getElementById('fixture'));
    });

    function setupMap (callback, showLegend) {
        const fixture = '<div id="fixture" class="map"></div>';
        document.body.insertAdjacentHTML('afterbegin', fixture);
        showLegend = (showLegend != null ? showLegend : true)
        ctrl = {
            panel: {
                showLegend: showLegend,
                colors: ['#fff', '#000']
            },
            lightTheme: true,
            getRegion: function () {
                return 'world';
            },
            data: [['Countries', 'Frequency'], ['SE', 10]]
        }

        map = new Map(ctrl, document.getElementById('fixture'), callback);
    }
});
