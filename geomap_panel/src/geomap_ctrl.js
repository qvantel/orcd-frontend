import {MetricsPanelCtrl} from 'app/plugins/sdk';
import mapRenderer from './map_renderer';
import DataGenerator from './dataGenerator';

/** Default panel settings */
const panelDefaults = {
    mapRegion: 'World',
    showLegend: true,
    animate: true,
    animationDuration: 2,
    colorAmount: 1,
    colors: ['#6699cc']
};

/** Region mapping from name to code */
const regionMapping = {
    World: 'world',
    Africa: '002',
    Europe: '150',
    America: '019',
    Asia: '142',
    Oceania: '009'
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

        // Determine which Grafan theme the user is using
        this.lightTheme = contextSrv.user.lightTheme

        // Instantiate the data generator
        this.dataGenerator = new DataGenerator();

        // Inser the default values into the panel where the current setting is not found
        for (var key in panelDefaults) {
            if (typeof this.panel[key] === 'undefined') {
                this.panel[key] = panelDefaults[key];
            }
        }

        // Bind events
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));

        // Intially set the build the dynamic stylesheet
        this.updateDynamicSheet();
    }

    /**
    * Add a tab when the user enters edit mode within Grafana
    */
    onInitEditMode () {
        this.addEditorTab('Options', 'public/plugins/qvantel-geomap-panel/editor.html', 2);
    }

    /**
    * Listen to new data - currently, when new data is presented, generated random data and re-render the map
    */
    onDataReceived (dataList) {
        this.data = this.dataGenerator.generate();
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
    * When the region option is updated, tell the map and re-render
    */
    optionRegionUpdated () {
        if (!this.map) return;

        this.map.setRegion(this.getRegion());
        this.render();
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
        this.panel.colorAmount = this.clamp(this.panel.colorAmount, options.minColors, options.maxColors);

        var diff = this.abs(this.panel.colorAmount - this.panel.colors.length);

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

    /**
    * Get the mapped region
    *
    * @return {string} - the mapped region
    */
    getRegion () {
        return regionMapping[this.panel.mapRegion];
    }

    /**
    * Clamp a value
    *
    * @param {number} val - The value to be clamped
    * @param {number} min - The min value
    * @param {number} max - The max value
    * @return {number} - The clamped value
    */
    clamp (val, min, max) {
        if (val < min) return min;
        if (val > max) return max;
        return val;
    }

    /**
    * Clamp a value between 0 and 1
    *
    * @param {number} val - The value to be clamped
    * @return {number} - The clamped value
    */
    clamp01 (val) {
        return this.clamp(val, 0, 1);
    }

    /**
    * Get the absolute value
    *
    * @param {number} val - The value to be absoluted
    * @return {number} - The absolute value
    */
    abs (val) {
        if (val < 0) return val * -1;
        return val;
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
