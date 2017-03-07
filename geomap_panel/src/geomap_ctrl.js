import {MetricsPanelCtrl} from 'app/plugins/sdk';
import mapRenderer from './map_renderer';
import DataFormatter from './dataFormatter';
import DataGenerator from './dataGenerator';
import ZoomHandler from './zoomHandler';
import Utilities from './utilities';

/** Default panel settings */
const panelDefaults = {
    mapRegion: 'World',
    showLegend: true,
    showBreadcrumbs: true,
    animate: true,
    animationDuration: 2,
    colorAmount: 1,
    colors: ['#6699cc'],
    breadcrumbs: ['World'],
    zoom: {
        continent: 'World',
        subContinent: 'None',
        country: 'None'
    }
};

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
    constructor ($scope, $injector, $log, contextSrv) {
        super($scope, $injector, $log);

        // Make sure that everyone with access to the controller also has access to the logging
        this.log = function (msg) {
            $log.log(msg);
        };

        this.scope = $scope;
        this.panelDefaults = panelDefaults;

        // Insert the default values into the panel where the current setting is not found
        for (var key in panelDefaults) {
            if (typeof this.panel[key] === 'undefined') {
                this.panel[key] = panelDefaults[key];
            }
        }

        // Setup variables
        this.lightTheme = contextSrv.user.lightTheme
        this.breadcrumbs = ['World'];

        // Components
        this.utilities = new Utilities();
        this.dataGenerator = new DataGenerator();
        this.dataFormatter = new DataFormatter(this);
        this.zoomHandler = new ZoomHandler(this);

        // Bind events
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));

        // Intially set the build the dynamic stylesheet
        this.updateDynamicSheet();
        this.loadLocations();
    }

    /**
    * Load the locations from the json file
    */
    loadLocations () {
        var self = this;
        $.getJSON('public/plugins/qvantel-geomap-panel/data/locations.json').then((res) => {
            self.locations = res;
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
        // this.data = this.dataGenerator.generate();
        this.data = this.dataFormatter.generate(dataList);
        this.render();
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

    /**
    * When the region option is updated
    *
    * @param {string} type - Continent, SubContinent or Country
    */
    optionRegionChanged (type) {
        // If a continent is set, reset sub categories
        if (type === 'continent') {
            this.panel.zoom.subContinent = 'None';
            this.panel.zoom.country = 'None';
        }

        // If a sub continent is set, reset sub categories
        if (type === 'subContinent') {
            this.panel.zoom.country = 'None';
        }

        // Collect the panel data into an array and send it over to the zoom handler
        var zoom = ['World'];

        if (this.panel.zoom.continent !== 'World') {
            zoom.push(this.panel.zoom.continent);
        }

        if (this.panel.zoom.subContinent !== 'None') {
            zoom.push(this.panel.zoom.subContinent);
        }

        if (this.panel.zoom.country !== 'None') {
            zoom.push(this.panel.zoom.country);
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

        this.panel.zoom.continent = (items.length > 1 ? items[1] : panelDefaults.zoom.continent);
        this.panel.zoom.subContinent = (items.length > 2 ? items[2] : panelDefaults.zoom.subContinent);
        this.panel.zoom.country = (items.length > 3 ? items[3] : panelDefaults.zoom.country);
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
}

GeoMapPanelCtrl.templateUrl = 'module.html';
