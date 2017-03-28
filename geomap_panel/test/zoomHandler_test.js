import ZoomHandler from '../src/zoomHandler';

describe('ZoomHandler', () => {
    let zoomHandler;
    let ctrl;

    beforeEach(() => {
        setupZoomHandler();
    });

    describe('when the zoom handler is loaded without any saved options', () => {
        beforeEach(() => {
            ctrl.panel.zoomContinent = ctrl.panelDataHandler.getPanelDefaults().zoomContinent;
            ctrl.panel.zoomSubContinent = ctrl.panelDataHandler.getPanelDefaults().zoomSubContinent;
            ctrl.panel.zoomCountry = ctrl.panelDataHandler.getPanelDefaults().zoomCountry;
            zoomHandler.loadZoom();
        });

        it('it should give an array with only a World element', () => {
            expect(zoomHandler.zoom.length).to.equal(1);
            expect(zoomHandler.zoom[0]).to.equal('World');
        });
    });

    describe('when the zoom handler is loaded with only a continent', () => {
        beforeEach(() => {
            ctrl.panel.zoomContinent = 'Europe';
            ctrl.panel.zoomSubContinent = ctrl.panelDataHandler.getPanelDefaults().zoomSubContinent;
            ctrl.panel.zoomCountry = ctrl.panelDataHandler.getPanelDefaults().zoomCountry;
            zoomHandler.loadZoom();
        });

        it('it should give an array with 2 elements, world and continent element', () => {
            expect(zoomHandler.zoom.length).to.equal(2);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('Europe');
        });
    });

    describe('when the zoom handler is loaded with world, continent and sub continent', () => {
        beforeEach(() => {
            ctrl.panel.zoomContinent = 'Europe';
            ctrl.panel.zoomSubContinent = 'Northern Europe';
            ctrl.panel.zoomCountry = ctrl.panelDataHandler.getPanelDefaults().zoomCountry;
            zoomHandler.loadZoom();
        });

        it('it should give an array with 3 elements, world, continent and sub continent', () => {
            expect(zoomHandler.zoom.length).to.equal(3);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('Europe');
            expect(zoomHandler.zoom[2]).to.equal('Northern Europe');
        });
    });

    describe('when the zoom handler is loaded with world, continent, sub continent and country', () => {
        beforeEach(() => {
            ctrl.panel.zoomContinent = 'Europe';
            ctrl.panel.zoomSubContinent = 'Northern Europe';
            ctrl.panel.zoomCountry = 'Sweden';
            zoomHandler.loadZoom();
        });

        it('it should give an array with 4 elements, continent, sub continent and country', () => {
            expect(zoomHandler.zoom.length).to.equal(4);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('Europe');
            expect(zoomHandler.zoom[2]).to.equal('Northern Europe');
            expect(zoomHandler.zoom[3]).to.equal('Sweden');
        });
    });

    describe('when a zoom array is set, the zooms should match', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World', 'Europe']);
        });

        it('it shuld give an array with 2 elements with the respective elements', () => {
            expect(zoomHandler.zoom.length).to.equal(2);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('Europe');
        });
    });

    describe('when getting the last zoom, it should return the last element of the zoom array', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World', 'Europe']);
        });

        it('it shuld give the last element of the array, Europe', () => {
            expect(zoomHandler.getLastZoom()).to.equal('Europe');
        });
    });

    describe('when getting the zoom codes, the returned value should be returned as is', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World', '150', '154']);
        });

        it('it shuld give an array with 3 elements, World, 150 and 154', () => {
            var zoomCodes = zoomHandler.getZoomCodes();
            expect(zoomCodes.length).to.equal(3);
            expect(zoomCodes[0]).to.equal('World');
            expect(zoomCodes[1]).to.equal('150');
            expect(zoomCodes[2]).to.equal('154');
        });
    });

    describe('when getting the zoom names from a full zoom, it should translate the codes into names', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World', '150', '154', 'SE']);
        });

        it('it shuld give an array with 4 elements, World, Europe, Northen Europe, Sweden', () => {
            var zoomNames = zoomHandler.getZoomNames();
            expect(zoomNames.length).to.equal(4);
            expect(zoomNames[0]).to.equal('World');
            expect(zoomNames[1]).to.equal('Europe');
            expect(zoomNames[2]).to.equal('Northern Europe');
            expect(zoomNames[3]).to.equal('Sweden');
        });
    });

    describe('when zooming into a region with a country code once when the map is currently zoomed into nothing (corner case)', () => {
        beforeEach(() => {
            zoomHandler.setZoom([]);
            zoomHandler.zoomIn('SE');
        });

        it('it should do nothing', () => {
            expect(zoomHandler.zoom.length).to.equal(0);
        });
    });

    describe('when zooming into a region with a country code once when the map is currently zoomed into the world', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World']);
            zoomHandler.zoomIn('SE');
        });

        it('it should zoom into Europe', () => {
            expect(zoomHandler.zoom.length).to.equal(2);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('150');
        });
    });

    describe('when zooming into a region with a country 2 times when the map is currently zoomed into the world', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World']);
            zoomHandler.zoomIn('SE');
            zoomHandler.zoomIn('SE');
        });

        it('it should zoom into Northern Europe', () => {
            expect(zoomHandler.zoom.length).to.equal(3);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('150');
            expect(zoomHandler.zoom[2]).to.equal('154');
        });
    });

    describe('when zooming into a region with a country 3 times when the map is currently zoomed into the world', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World']);
            zoomHandler.zoomIn('SE');
            zoomHandler.zoomIn('SE');
            zoomHandler.zoomIn('SE');
        });

        it('it should zoom into Sweden', () => {
            expect(zoomHandler.zoom.length).to.equal(4);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('150');
            expect(zoomHandler.zoom[2]).to.equal('154');
            expect(zoomHandler.zoom[3]).to.equal('SE');
        });
    });

    describe('when zooming into a region with a sub continent once when the map is currently zoomed into the world', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World']);
            zoomHandler.zoomIn('150');
        });

        it('it should zoom into Europe', () => {
            expect(zoomHandler.zoom.length).to.equal(2);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('150');
        });
    });

    describe('when zooming into a region with a sub continent 2 times when the map is currently zoomed into the world', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World']);
            zoomHandler.zoomIn('154');
            zoomHandler.zoomIn('154');
        });

        it('it should zoom into Northern Europe', () => {
            expect(zoomHandler.zoom.length).to.equal(3);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('150');
            expect(zoomHandler.zoom[2]).to.equal('154');
        });
    });

    describe('when zooming into a region with a sub continent 1 time when the map is currently zoomed into nothing', () => {
        beforeEach(() => {
            zoomHandler.setZoom([]);
            zoomHandler.zoomIn('154');
        });

        it('it should zoom into nothing', () => {
            expect(zoomHandler.zoom.length).to.equal(0);
        });
    });

    describe('when zooming into a region with a continent once when the map is currently zoomed into the world', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World']);
            zoomHandler.zoomIn('150');
        });

        it('it should zoom into Europe', () => {
            expect(zoomHandler.zoom.length).to.equal(2);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('150');
        });
    });

    describe('when zooming into an invalid region, nothing should happen', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World']);
            zoomHandler.zoomIn('Invalid string');
        });

        it('it do nothing', () => {
            expect(zoomHandler.zoom.length).to.equal(1);
            expect(zoomHandler.zoom[0]).to.equal('World');
        });
    });

    describe('when zooming out to a continent from a country', () => {
        beforeEach(() => {
            zoomHandler.setZoom(['World', '150', '154', 'SE']);
            zoomHandler.zoomOut(1);
        });

        it('it should zoom into Europe', () => {
            expect(zoomHandler.zoom.length).to.equal(2);
            expect(zoomHandler.zoom[0]).to.equal('World');
            expect(zoomHandler.zoom[1]).to.equal('150');
        });
    });

    function setupZoomHandler () {
        ctrl = {
            panelDataHandler: {
                getPanelDefaults: () => {
                    return {
                        zoomContinent: 'World',
                        zoomSubContinent: 'None',
                        zoomCountry: 'None'
                    };
                }
            },
            panel: {
                zoomContinent: 'Europe',
                zoomSubContinent: 'Northern Europe',
                zoomCountry: 'Sweden'
            },
            locations: {
                continents: {
                    '150': 'Europe'
                },
                subContinents: {
                    '154': {
                        continent: '150',
                        name: 'Northern Europe'
                    }
                },
                countries: {
                    'SE': {
                        subContinent: '154',
                        name: 'Sweden'
                    }
                }
            },
            zoomUpdated: () => { }
        };

        zoomHandler = new ZoomHandler(ctrl);
    }
});
