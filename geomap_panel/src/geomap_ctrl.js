import {MetricsPanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';
import mapRenderer from './map_renderer';
import DataFormatter from './dataFormatter';
import DataGenerator from './dataGenerator';
import Utilities from './utilities';
import InputHandler from './inputHandler';
import PanelDataHandler from './panelDataHandler';
import TemplateHandler from './templateHandler';
import SelectedCountriesHandler from './selectedCountriesHandler';
import TimelapseHandler from './timelapseHandler';

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
        this.disableRenderer = false;
        this.disableRefresh = false;
        this.timestampLength = 10000;

        // Components
        this.panelDataHandler = new PanelDataHandler(this);
        this.utilities = new Utilities();
        this.inputHandler = new InputHandler(this);
        this.dataGenerator = new DataGenerator(this);
        this.dataFormatter = new DataFormatter(this);
        this.templateHandler = new TemplateHandler(this, templateSrv, variableSrv);
        this.selectedCountriesHandler = new SelectedCountriesHandler(this);
        this.timelapseHandler = new TimelapseHandler(this);

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
        this.updateTimestampLength();

        if (this.panel.useFakeData) {
            this.data = this.dataFormatter.generate(
                this.dataGenerator.generate()
            );
        } else {
            this.data = this.dataFormatter.generate(dataList);
        }

        this.timelapseHandler.setTimestampInterval(
            this.dataFormatter.firstTimestamp,
            this.dataFormatter.lastTimestamp
        );

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

        this.selectedCountriesHandler.checkCountriesTemplate();
    }

    /**
    * Subscribe all editor options to the panel data handler
    */
    subscribeToPanel () {
        var self = this;
        this.panelDataHandler.subscribe('showLegend', () => {
            self.optionShowLegendUpdated();
        });
        this.panelDataHandler.subscribe(['animate', 'animationDuration'], () => {
            self.optionAnimationUpdated();
        });
        this.panelDataHandler.subscribe('showTrends', () => {
            self.optionShowTrendsUpdated();
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

    optionShowTrendsUpdated () {
        this.map.updateForTrends();
        this.refresh();
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
        sheet += 'stroke-width: 1px; stroke: #003366;';

        // If animation is enabled, set the country fill color to transition
        if (this.panel.animate) {
            sheet += 'transition: fill ' + this.panel.animationDuration + 's ease;';
        }

        sheet += '}';
        this.dynamicSheet.innerHTML = sheet;
    }

    updateTimestampLength () {
        var timestampLength = this.templateHandler.getVariableCurrentValue('timespan')
        var durationSplitRegexp = /(\d+)(ms|s|m|h|d|w|M|y)/;
        var m = timestampLength.match(durationSplitRegexp);
        var dur = moment.duration(parseInt(m[1]), m[2]);
        timestampLength = dur.asMilliseconds();

        this.timestampLength = timestampLength;
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
