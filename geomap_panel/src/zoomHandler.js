/* This class will handle the zooming of the map */
export default class ZoomHandler {

    /* Build the zoom handler */
    constructor (ctrl) {
        this.ctrl = ctrl;
        this.loadZoom();
    }

    /**
    * Load the initial zoom from the panel options
    */
    loadZoom () {
        this.zoom = ['World'];

        var continent = this.ctrl.panel.zoomContinent;
        var subContinent = this.ctrl.panel.zoomSubContinent;
        var country = this.ctrl.panel.zoomCountry;

        if (continent !== this.ctrl.panelDataHandler.getPanelDefaults().zoomContinent) {
            this.zoom.push(continent);
        }

        if (subContinent !== this.ctrl.panelDataHandler.getPanelDefaults().zoomSubContinent) {
            this.zoom.push(subContinent);
        }

        if (country !== this.ctrl.panelDataHandler.getPanelDefaults().zoomCountry) {
            this.zoom.push(country);
        }
    }

    /**
    * Give the zoomhandler a complete zoom array
    */
    setZoom (zoom) {
        this.zoom = zoom;
        this.finishZoom(false);
    }

    /**
    * Get the last element in the zoom array
    */
    getLastZoom () {
        return this.zoom[this.zoom.length - 1];
    }

    /**
    * Get an array with zoom codes (Like; world -> 150 -> 153 -> SE)
    */
    getZoomCodes () {
        return this.zoom;
    }

    /**
    * Get an array with zoom names (Like; World -> Europe -> Northern Europe -> Sweden)
    */
    getZoomNames () {
        var zoom = [];
        for (var i = 0; i < this.zoom.length; i++) {
            var res = this.zoom[i];

            if (i === 1) {
                res = this.ctrl.locations.continents[this.zoom[i]];
            } else if (i === 2) {
                res = this.ctrl.locations.subContinents[this.zoom[i]].name;
            } else if (i === 3) {
                res = this.ctrl.locations.countries[this.zoom[i]].name;
            }

            zoom[i] = res;
        }

        return zoom;
    }

    /**
    * Zoom in given a specific region, the region could be either a continent, country or a sub continent
    *
    * @param {string} region - The region to be zoomed into
    */
    zoomIn (region) {
        if (typeof this.ctrl.locations.countries[region] !== 'undefined') {
            this.zoomInsertCountry(region);
        } else if (typeof this.ctrl.locations.subContinents[region] !== 'undefined') {
            this.zoomInsertSubContinent(region);
        } else if (typeof this.ctrl.locations.continents[region] !== 'undefined') {
            this.zoomInsertContinent(region);
        } else {
            return;
        }

        this.finishZoom();
    }

    /**
    * Zoom out given an index for the zoom array, it will zoom back to that region
    */
    zoomOut (index) {
        this.zoom.length = index + 1;
        this.finishZoom(false);
    }

    /**
    * Insert a country to the zoom array and make sure that the sub continent and continent matches
    */
    zoomInsertCountry (country) {
        if (this.zoom.length >= 3) {
            this.zoom[3] = country;
        }

        if (this.zoom.length >= 2) {
            this.zoom[2] = this.ctrl.locations.countries[country].subContinent;
        }

        if (this.zoom.length >= 1) {
            this.zoom[1] = this.ctrl.locations.subContinents[this.ctrl.locations.countries[country].subContinent].continent;
        }
    }

    /**
    * Insert a sub continent to the zoom array and make sure that the continent matches
    */
    zoomInsertSubContinent (subContinent) {
        if (this.zoom.length >= 2) {
            this.zoom[2] = subContinent;
        }

        if (this.zoom.length >= 1) {
            this.zoom[1] = this.ctrl.locations.subContinents[subContinent].continent;
        }
    }

    /**
    * Insert a continent into the zoom array
    */
    zoomInsertContinent (continent) {
        this.zoom[1] = continent;
    }

    /**
    * Tell the controller that a zooming has occured
    */
    finishZoom (doApply) {
        this.ctrl.zoomUpdated(doApply);
    }
}
