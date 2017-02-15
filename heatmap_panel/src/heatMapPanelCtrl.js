import {PanelCtrl} from 'app/features/panel/panel_ctrl';
import _ from 'lodash';
import {MetricsPanelCtrl} from 'app/plugins/sdk';

export class HeatMapPanelCtrl extends MetricsPanelCtrl {
    constructor ($scope, $injector, $log, $rootScope) {
        super($scope, $injector, $log);
        this.$rootScope = $rootScope;

        var panelDefaults = {
            legend: {
                show: true, // disable/enable legend
                values: true
            },
            links: [],
            datasource: null,
            maxDataPoints: 3,
            interval: null,
            targets: [{}],
            cacheTimeout: null,
            nullPointMode: 'connected',
            legendType: 'Under graph',
            aliasColors: {},
            format: 'short',
            valueName: 'current',
            strokeWidth: 1,
            fontSize: '80%',
            combine: {
                threshold: 0.0,
                label: 'Others'
            }
        };

        _.defaults(this.panel, panelDefaults);
        _.defaults(this.panel.legend, panelDefaults.legend);

        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        //  this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    }

    onDataError () {
        //$log.info('data fetching failed');
        this.series = [];
        this.render();
    }

    onDataReceived (dataList) {
        //  Might contain multiple targets in array.
        this.header = dataList[0].target;
        this.datapoints = dataList[0].datapoints;
        //$log.info(this.datapoints);
    }

    onRender () {
        this.data = 'Render';
    }
}
//HeatMapPanelCtrl.bindToController = true;
//HeatMapPanelCtrl.controllerAs = 'vm';
