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
        this.events.on('data-snapshot-load', this.onDataSnapshotLoad.bind(this));

        this.updateDynamicSheet();
        this.subscribeToPanel();
    }

    /**
    * Load the locations from the json file
    */
    loadLocations (callback) {
        var self = this;
        $.getJSON('public/plugins/qvantel-geomap-panel/data/locations.json').then((res) => {
            self.locations = res;
            callback();
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
        // Make sure we have loaded the location data
        if (typeof this.locations === 'undefined') {
            var self = this;
            this.loadLocations(() => {
                self.onDataReceived(dataList);
            });
        } else {
            this.updateTimestampLength();

            // If we're using fake data, ignore the incomming data and generate our own
            if (this.panel.useFakeData) {
                this.data = this.dataFormatter.generate(
                    this.dataGenerator.generate()
                );
            } else {
                this.data = this.dataFormatter.generate(dataList);
            }

            // Make sure to update the timelapse with the new information recieved
            this.timelapseHandler.setTimestampInterval(
                this.dataFormatter.firstTimestamp,
                this.dataFormatter.lastTimestamp
            );

            this.render();
            this.disableRefresh = false;
        }
    }

    onDataSnapshotLoad (snapshotData) {
        this.onDataReceived(snapshotData);
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
    * Override the render call to make sure that we don't render while already
    * rendering and then make sure angular have successfully digested
    */
    render () {
        if (!this.disableRenderer) {
            super.render();
            this.$timeout();
        }
    }

    /**
    * Override the refresh call and make sure to not refresh while a refresh is already in progress
    */
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
        this.panelDataHandler.subscribe(['animate', 'animationDuration'], () => {
            self.optionAnimationUpdated();
        });
        this.panelDataHandler.subscribe('useFakeData', () => {
            self.refresh();
        });
        this.panelDataHandler.subscribe('individualMaxValue', () => {
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
    * When the animation option is updated, tell the dynamic stylesheet and re-render
    */
    optionAnimationUpdated () {
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

        // If animation is enabled, set the country fill color to transition
        if (this.panel.animate) {
            sheet += 'transition: fill ' + this.panel.animationDuration + 's ease;';
        }

        sheet += '}';
        this.dynamicSheet.innerHTML = sheet;
    }

    /**
    * Read the timespan template variable and format it into ms
    * ie the string 1h equals the number 36000000 (ms)
    */
    updateTimestampLength () {
        // Make sure the variable is present
        if (this.templateHandler.variableExists('timespan')) {
            var timestampLength = this.templateHandler.getVariableCurrentValue('timespan')

            // With help of regex, split the number and the prefix.
            var durationSplitRegexp = /(\d+)(ms|s|m|h|d|w|M|y)/;
            var m = timestampLength.match(durationSplitRegexp);

            // Make sure a match was found
            if (m !== null) {
                // Convert the number and prefix into a duration with help of moment.js
                var dur = moment.duration(parseInt(m[1]), m[2]);
                this.timestampLength = dur.asMilliseconds();
            } else {
                this.timestampLength = -1;
            }
        } else {
            this.timestampLength = -1;
        }
    }

    formatTime (timestamp) {
        moment.unix(timestamp).format('DD-MM-YYYY HH:mm:ss')
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
