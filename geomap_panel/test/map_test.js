import Map from '../src/map';

describe('Map', () => {
    let map;
    let ctrl;

    beforeEach((done) => {
        setupMap(function () {
            done();
        });
    });

    describe('when a map is created', () => {
        it('should add Google GeoCharts to the map div', () => {
            expect(document.getElementById('fixture').children.length).to.not.be(0);
        });
    });

    describe('when the region option has been altered', () => {
        beforeEach(() => {
            map.setRegion('SE');
        });

        it('the map option for region should be set to the specified region', () => {
            expect(map.options.region).to.be('SE');
        });
    });

    describe('when the legend is shown', () => {
        beforeEach(() => {
            ctrl.panel.showLegend = true;
            map.toggleLegend();
        });

        it('the legend in map option should be built accordingly', () => {
            expect(map.options.legend.textStyle.color).to.be('#000');
        });
    });

    describe('when the legend is hidden', () => {
        beforeEach(() => {
            ctrl.panel.showLegend = false;
            map.toggleLegend();
        });

        it('the legend in map option should be built accordingly', () => {
            expect(map.options.legend).to.be('none');
        });
    });

    describe('when a new color scheme is set', () => {
        beforeEach(() => {
            map.setColors(['#ff0000', '#00ff00', '#0000ff']);
        });

        it('the color in map option should be correctly set', () => {
            expect(map.options.colorAxis.colors[0]).to.be('#f5f5f3');
            expect(map.options.colorAxis.colors[1]).to.be('#ff0000');
            expect(map.options.colorAxis.colors[2]).to.be('#00ff00');
            expect(map.options.colorAxis.colors[3]).to.be('#0000ff');
        });
    });

    afterEach(() => {
        document.body.removeChild(document.getElementById('fixture'));
    });

    function setupMap (callback) {
        const fixture = '<div id="fixture" class="map"></div>';
        document.body.insertAdjacentHTML('afterbegin', fixture);

        ctrl = {
            panel: {
                showLegend: true,
                colors: ['#fff', '#000']
            },
            lightTheme: true,
            getRegion: function () {
                return 'world';
            }
        }

        map = new Map(ctrl, document.getElementById('fixture'), callback);
    }
});
