export default class ZoomHandler {
    constructor (ctrl) {
        this.ctrl = ctrl;
        this.loadZoom();
    }

    loadZoom() {
        this.zoom = ["World"];

        var continent = this.ctrl.panel.zoom.continent;
        var subContinent = this.ctrl.panel.zoom.subContinent;
        var country = this.ctrl.panel.zoom.country;

        if (continent !== this.ctrl.panelDefaults.zoom.continent) {
            this.zoom.push(continent);
        }

        if (subContinent !== this.ctrl.panelDefaults.zoom.subContinent) {
            this.zoom.push(subContinent);
        }

        if (country !== this.ctrl.panelDefaults.zoom.country) {
            this.zoom.push(country);
        }
    }

    setZoom (zoom) {
        this.zoom = zoom;
        this.finishZoom(false);
    }

    getLastZoom () {
        return this.zoom[this.zoom.length - 1];
    }

    getZoomCodes() {
        return this.zoom;
    }

    getZoomNames() {
        var zoom = [];
        for (var i = 0; i < this.zoom.length; i++) {
            var res = this.zoom[i];

            if (i === 1) {
                res = this.ctrl.locations.continents[this.zoom[i]];
            } else if (i === 2) {
                res = this.ctrl.locations.subContinents[this.zoom[i]].name;
            } else if(i === 3) {
                res = this.ctrl.locations.countries[this.zoom[i]].name;
            }

            zoom[i] = res;
        }

        return zoom;
    }

    /**
    *
    */
    zoomIn (region) {
        if (typeof this.ctrl.locations.countries[region] !== "undefined") {
            this.zoomInsertCountry(region);
        } else if (typeof this.ctrl.locations.subContinents[region] !== "undefined") {
            this.zoomInsertSubContinent(region);
        } else if (typeof this.ctrl.locations.continents[region] !== "undefined") {
            this.zoomInsertContinent(region);
        } else {
            return;
        }

        this.finishZoom();
    }

    zoomOut (index) {
        this.zoom.length = index + 1;
        this.finishZoom(false);
    }

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

    zoomInsertSubContinent (subContinent) {
        if (this.zoom.length >= 2) {
            this.zoom[2] = subContinent;
        }

        if (this.zoom.length >= 1) {
            this.zoom[1] = this.ctrl.locations.subContinents[subContinent].continent;
        }
    }

    zoomInsertContinent (continent) {
        this.zoom[1] = continent;
    }

    finishZoom (doApply) {
        this.ctrl.zoomUpdated(doApply);
    }
}
