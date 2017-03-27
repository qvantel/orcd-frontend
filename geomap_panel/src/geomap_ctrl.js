import {MetricsPanelCtrl} from 'app/plugins/sdk';
import mapRenderer from './map_renderer';
import DataFormatter from './dataFormatter';
import DataGenerator from './dataGenerator';
import ZoomHandler from './zoomHandler';
import Utilities from './utilities';
import InputHandler from './inputHandler';
import PanelDataHandler from './panelDataHandler';
import TemplateHandler from './templateHandler';
import SelectedCountries from './selectedCountries';

/** options */
const options = {
    minColors: 1,
    maxColors: 5
};

/**
 * This class represents the controller of the plugin
 */
export default class GeoMapPanelCtrl extends MetricsPanelCtrl {
    /**
    * Create the controller
    * @param $scope
    * @param $injector
    * @param $log
    * @param contectSrv
    */
    constructor ($scope, $injector, $log, contextSrv, templateSrv, variableSrv) {
        super($scope, $injector, $log);

        // Make sure that everyone with access to the controller also has access to the logging
        this.log = function (msg) {
            $log.log(msg);
        };

        this.scope = $scope;

        // Setup variables
        this.lightTheme = contextSrv.user.lightTheme
        this.breadcrumbs = ['World'];
        this.disableRenderer = false;
        this.disableRefresh = false;

        // Components
        this.panelDataHandler = new PanelDataHandler(this);
        this.utilities = new Utilities();
        this.inputHandler = new InputHandler();
        this.dataGenerator = new DataGenerator(this);
        this.dataFormatter = new DataFormatter(this);
        this.zoomHandler = new ZoomHandler(this);
        this.templateHandler = new TemplateHandler(this, templateSrv, variableSrv);
        this.selectedCountries = new SelectedCountries(this);

        // Bind events
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));

        this.updateDynamicSheet();
        this.loadLocations();
        this.subscribeToPanel();
    }

    /**
    * Load the locations from the json file
    */
    loadLocations () {
        var self = this;
        $.getJSON('public/plugins/qvantel-geomap-panel/data/locations.json').then((res) => {
            self.locations = res;
            self.updatePanelZoom();
        });
    }

    /**
    * Add a tab when the user enters edit mode within Grafana
    */
    onInitEditMode () {
        this.addEditorTab('Options', 'public/plugins/qvantel-geomap-panel/editor.html', 2);
    }

    /**
    * Listen to new data, send data over to the formatter to format it in order for google to be able to read it
    *
    * @param {array} datalist - list of datapoints
    */
    onDataReceived (dataList) {
        if (this.panel.useFakeData) {
            this.data = this.dataGenerator.generate();
        } else {
            this.data = this.dataFormatter.generate(dataList);
        }

        this.render();
        this.disableRefresh = false;
    }

    /**
    * When linked, call the exported mapRenderer function, found in map_renderer.js
    *
    * @param scope
    * @param elem
    * @param attrs
    * @param ctrl
    */
    link (scope, elem, attrs, ctrl) {
        mapRenderer(scope, elem, attrs, ctrl);
    }

    render () {
        if (!this.disableRenderer) {
            super.render();
        }
    }

    refresh () {
        if (!this.disableRenderer) {
            if (this.disableRefresh) {
                this.render();
            } else {
                this.disableRefresh = true;
                super.refresh();
            }
        }
    }

    /**
    * Subscribe all editor options to the panel data handler
    */
    subscribeToPanel () {
        var self = this;
        this.panelDataHandler.subscribe('showLegend', () => {
            self.optionShowLegendUpdated();
        });
        this.panelDataHandler.subscribe(['zoomContinent', 'zoomSubContinent', 'zoomCountry'], (param) => {
            self.optionRegionChanged(param);
        });
        this.panelDataHandler.subscribe(['animate', 'animationDuration'], () => {
            self.optionAnimationUpdated();
        });
        this.panelDataHandler.subscribe('colorAmount', () => {
            self.optionColorAmountUpdated();
        });
        this.panelDataHandler.subscribe('colors', () => {
            self.optionColorsUpdated();
        });
        this.panelDataHandler.subscribe('useFakeData', () => {
            self.refresh();
        });
    }

    /**
    * The editor should call this when something has changed
    */
    optionChanged (key, param) {
        this.panelDataHandler.panelDataUpdated(key, param);
    }

    /**
    * When the region option is updated
    *
    * @param {string} type - Continent, SubContinent or Country
    */
    optionRegionChanged (type) {
        if (typeof type === 'undefined') {
            type = 'continent';
            this.panel.zoomContinent = 'World';
        }

        // If a continent is set, reset sub categories
        if (type === 'continent') {
            this.panel.zoomSubContinent = 'None';
            this.panel.zoomCountry = 'None';
        }

        // If a sub continent is set, reset sub categories
        if (type === 'subContinent') {
            this.panel.zoomCountry = 'None';
        }

        // Collect the panel data into an array and send it over to the zoom handler
        var zoom = ['World'];

        if (this.panel.zoomContinent !== 'World') {
            zoom.push(this.panel.zoomContinent);
        }

        if (this.panel.zoomSubContinent !== 'None') {
            zoom.push(this.panel.zoomSubContinent);
        }

        if (this.panel.zoomCountry !== 'None') {
            zoom.push(this.panel.zoomCountry);
        }

        this.zoomHandler.setZoom(zoom);
    }

    /**
    * When the legend option is updated, tell the map and re-render
    */
    optionShowLegendUpdated () {
        if (!this.map) return;

        this.map.toggleLegend();
        this.render();
    }

    /**
    * When the animation option is updated, tell the dynamic stylesheet and re-render
    */
    optionAnimationUpdated () {
        this.updateDynamicSheet();
        this.render();
    }

    /**
    * When the color amount option is updated, update the color-array, dynamic style sheet and re-render
    */
    optionColorAmountUpdated () {
        // Make sure that color amount doesn't break the limits
        this.panel.colorAmount = this.utilities.clamp(this.panel.colorAmount, options.minColors, options.maxColors);

        var diff = Math.abs(this.panel.colorAmount - this.panel.colors.length);

        // Remove or add elements in the color-array
        for (var i = 0; i < diff; i++) {
            if (this.panel.colorAmount > this.panel.colors.length) {
                this.panel.colors.push('#fff');
            } else {
                this.panel.colors.pop();
            }
        }

        this.optionColorsUpdated();
        this.updateDynamicSheet();
        this.render();
    }

    /**
    * When a color is updated, tell the map, dynamic stylesheet and re-render
    */
    optionColorsUpdated () {
        if (!this.map) return;

        this.map.setColors(this.panel.colors);
        this.updateDynamicSheet();
        this.render();
    }

    /**
    * Callback for the reset button
    */
    optionResetButtonClicked () {
        this.disableRenderer = true;
        this.panelDataHandler.resetToDefaults(true, true);
        this.disableRenderer = false;
        this.refresh();
    }

    /**
    * When the zooming of a map has been changed, call this function and it will tell other components
    */
    zoomUpdated (doApply) {
        this.map.setRegion(this.zoomHandler.getLastZoom());
        this.updateBreadcrumbs(doApply);
        this.updatePanelZoom();
        this.render();
    }

    /**
    * Update the breadcrumbs
    *
    * @param {array} items - An array with locations to be displayed inside the breadcrumbs
    */
    updateBreadcrumbs (doApply) {
        this.breadcrumbs = this.zoomHandler.getZoomNames();

        if (typeof doApply === 'undefined' || doApply) {
            this.scope.$apply();
        }
    }

    /**
    * If the zooming has been changed due to clicking the map, also update the panel options
    */
    updatePanelZoom () {
        var items = this.zoomHandler.getZoomCodes();

        this.panel.zoomContinent = (items.length > 1 ? items[1] : this.panelDataHandler.getPanelDefaults().zoomContinent);
        this.panel.zoomSubContinent = (items.length > 2 ? items[2] : this.panelDataHandler.getPanelDefaults().zoomSubContinent);
        this.panel.zoomCountry = (items.length > 3 ? items[3] : this.panelDataHandler.getPanelDefaults().zoomCountry);

        // Only get the continents once
        if (!this.zoomedContinents) {
            this.zoomedContinents = this.getContinentsSorted();
        }

        // Only get the sub continents if the continent actually have changed
        if (this.oldContinent !== this.panel.zoomContinent) {
            this.zoomedSubContinents = this.getSubContinentsSorted();
        }

        // Only get the countries if the sub continent actually have changed
        if (this.oldSubContinent !== this.panel.zoomSubContinent) {
            this.zoomedCountries = this.getCountriesSorted();
        }

        this.oldContinent = this.panel.zoomContinent;
        this.oldSubContinent = this.panel.zoomSubContinent;
    }

    /**
    * When a breadcrumb has been clicked, this method is called and will let the zoomHandler know which element that was clicked
    */
    breadcrumbClicked (index) {
        this.zoomHandler.zoomOut(index);
    }

    /**
    * Create a HTML-style element in order to dynamically be able to change style of multiple objects
    */
    createDynamicSheet () {
        this.dynamicSheet = window.document.createElement('style');
        window.document.body.appendChild(this.dynamicSheet);
    }

    /**
    * Write data to the dynamic stylesheet
    */
    updateDynamicSheet () {
        if (!this.dynamicSheet) this.createDynamicSheet();

        var sheet = '';
        sheet += '.map path {';

        // Set the country border color to the last color of the color array
        sheet += 'stroke: ' + this.panel.colors[this.panel.colors.length - 1] + ';';

        // If animation is enabled, set the country fill color to transition
        if (this.panel.animate) {
            sheet += 'transition: fill ' + this.panel.animationDuration + 's ease;';
        }

        sheet += '}';
        this.dynamicSheet.innerHTML = sheet;
    }

    /***
    * Sort the continents by its value
    *
    * @return {array} - Array of sorted continents
    */
    getContinentsSorted () {
        var sortable = [];

        for (var key in this.locations.continents) {
            sortable.push({key: key, name: this.locations.continents[key]});
        }

        sortable.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

        return sortable;
    }

    /***
    * Sort the sub continents by its value and filtered by the currently zoomed in continent
    *
    * @return {array} - Array of sorted sub continents
    */
    getSubContinentsSorted () {
        var sortable = [];
        for (var key in this.locations.subContinents) {
            if (this.locations.subContinents[key].continent === this.panel.zoomContinent) {
                sortable.push({key: key, name: this.locations.subContinents[key].name});
            }
        }

        sortable.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

        return sortable;
    }

    /***
    * Sort the country by its value and filtered by the currently zoomed in sub continent
    *
    * @return {array} - Array of sorted countries
    */
    getCountriesSorted () {
        var sortable = [];
        for (var key in this.locations.countries) {
            if (this.locations.countries[key].subContinent === this.panel.zoomSubContinent && this.locations.countries[key].name !== 'N/A') {
                sortable.push({key: key, name: this.locations.countries[key].name});
            }
        }

        sortable.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

        return sortable;
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
